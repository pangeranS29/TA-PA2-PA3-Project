package usecases

import (
	"errors"
	"log"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"monitoring-service/app/utils"
	"time"
)

type KehamilanUsecase interface {
	Create(kehamilan *models.Kehamilan) error
	GetByID(id int32) (*models.Kehamilan, error)
	GetByIbuID(ibuID int32) ([]models.Kehamilan, error)
	GetAll() ([]models.Kehamilan, error)
	Update(kehamilan *models.Kehamilan) error
	Delete(id int32) error
	GetDashboardIbuHamil() ([]repositories.KehamilanDashboardDTO, error)
	ExistsActiveByIbuID(ibuID int32) (bool, error)
	 UpdateAllActiveGestationalAge() error
	 UpdateStatusKehamilan(id int32, status string) error
}

type kehamilanUsecase struct {
	repo *repositories.KehamilanRepository
}

func NewKehamilanUsecase(repo *repositories.KehamilanRepository) KehamilanUsecase {
	return &kehamilanUsecase{repo: repo}
}

// hitung IMT hanya jika BB_Awal dan TB diisi
func calculateIMT(bb, tb float64) float64 {
	if tb <= 0 {
		return 0
	}

	tbMeter := tb / 100 //
	return bb / (tbMeter * tbMeter)
}

func (u *kehamilanUsecase) Create(kehamilan *models.Kehamilan) error {
	if kehamilan.IbuID == 0 {
		return errors.New("ibu_id wajib diisi")
	}

	if kehamilan.HPHT.IsZero() {
		return errors.New("HPHT wajib diisi")
	}

	if kehamilan.HPHT.After(time.Now()) {
		return errors.New("HPHT tidak boleh di masa depan")
	}

	// validasi kehamilan aktif
	exists, err := u.repo.ExistsActiveByIbuID(kehamilan.IbuID)
	if err != nil {
		return err
	}
	if exists {
		return errors.New("ibu masih memiliki kehamilan aktif")
	}

	// 🔥 hitung otomatis
	usia := calculateUsiaKehamilan(kehamilan.HPHT)
	kehamilan.UKKehamilanSaatIni = int32(usia)
	kehamilan.StatusKehamilan = determineTrimester(usia)

	// IMT
	if kehamilan.BB_Awal > 0 && kehamilan.TB > 0 {
		kehamilan.IMT_Awal = calculateIMT(kehamilan.BB_Awal, kehamilan.TB)
	}

	return u.repo.Create(kehamilan)
}

func (u *kehamilanUsecase) GetByID(id int32) (*models.Kehamilan, error) {
	return u.repo.FindByID(id)
}

func (u *kehamilanUsecase) GetByIbuID(ibuID int32) ([]models.Kehamilan, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *kehamilanUsecase) GetAll() ([]models.Kehamilan, error) {
	return u.repo.GetAll()
}

func (u *kehamilanUsecase) Update(kehamilan *models.Kehamilan) error {
	existing, err := u.repo.FindByID(kehamilan.ID)
	if err != nil {
		return errors.New("data kehamilan tidak ditemukan")
	}

	if kehamilan.IbuID != 0 {
		existing.IbuID = kehamilan.IbuID
	}

	if !kehamilan.HPHT.IsZero() {
		if kehamilan.HPHT.After(time.Now()) {
			return errors.New("HPHT tidak valid")
		}
		existing.HPHT = kehamilan.HPHT
	}

	if !kehamilan.TaksiranPersalinan.IsZero() {
		existing.TaksiranPersalinan = kehamilan.TaksiranPersalinan
	}

	if kehamilan.BB_Awal > 0 {
		existing.BB_Awal = kehamilan.BB_Awal
	}

	if kehamilan.TB > 0 {
		existing.TB = kehamilan.TB
	}

	// IMT
	if kehamilan.BB_Awal > 0 || kehamilan.TB > 0 {
		existing.IMT_Awal = calculateIMT(existing.BB_Awal, existing.TB)
	}

	// 🔥 WAJIB: hitung ulang
	usia := calculateUsiaKehamilan(existing.HPHT)
	existing.UKKehamilanSaatIni = int32(usia)
	existing.StatusKehamilan = determineTrimester(usia)

	return u.repo.Update(existing)
}

func (u *kehamilanUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
func calculateUsiaKehamilan(hpht time.Time) int32 {
	if hpht.IsZero() {
		return 0
	}

	now := time.Now()
	if hpht.After(now) {
		return 0
	}

	days := int(now.Sub(hpht).Hours() / 24)
	return int32(days / 7)
}

func determineTrimester(usia int32) string {
	switch {
	case usia <= 12:
		return "TRIMESTER 1"
	case usia <= 27:
		return "TRIMESTER 2"
	case usia <= 40:
		return "TRIMESTER 3"
	default:
		return "Non-Aktif"
	}
}
func (u *kehamilanUsecase) GetDashboardIbuHamil() ([]repositories.KehamilanDashboardDTO, error) {
	return u.repo.GetDashboardIbuHamil()
}
func (u *kehamilanUsecase) ExistsActiveByIbuID(ibuID int32) (bool, error) {
	return u.repo.ExistsActiveByIbuID(ibuID)
}

// UpdateAllActiveGestationalAge menghitung ulang usia dan status untuk semua kehamilan aktif
func (u *kehamilanUsecase) UpdateAllActiveGestationalAge() error {
    log.Println("[CRON] Memulai update usia kehamilan dan status trimester...")

    kehamilans, err := u.repo.GetActiveKehamilanList()
    if err != nil {
        log.Printf("Gagal mengambil data kehamilan aktif: %v", err)
        return err
    }

    if len(kehamilans) == 0 {
        log.Println("Tidak ada kehamilan aktif yang perlu diupdate.")
        return nil
    }

    updated := 0
    for _, k := range kehamilans {
        // Hitung usia dari HPHT
        usia := int32(utils.HitungUsiaKehamilanFromTime(k.HPHT))
        // Tentukan trimester berdasarkan usia
        status := utils.DetermineTrimester(int(usia))

        // Update ke database
        err := u.repo.UpdateUsiaDanStatusKehamilan(k.ID, usia, status)
        if err != nil {
            log.Printf("Gagal update kehamilan ID %d: %v", k.ID, err)
        } else {
            updated++
        }
    }

    log.Printf("Selesai. Berhasil update %d dari %d kehamilan.", updated, len(kehamilans))
    return nil
}
// UpdateStatusKehamilan hanya mengubah status_kehamilan tanpa perhitungan ulang
func (u *kehamilanUsecase) UpdateStatusKehamilan(id int32, status string) error {
	existing, err := u.repo.FindByID(id)
	if err != nil {
		return errors.New("data kehamilan tidak ditemukan")
	}
	allowedStatus := map[string]bool{
		"AKTIF":       true,
		"NIFAS":       true,
		"NON-AKTIF":   true,
		"TRIMESTER 1": true,
		"TRIMESTER 2": true,
		"TRIMESTER 3": true,
	}
	if !allowedStatus[status] {
		return errors.New("status tidak valid")
	}
	existing.StatusKehamilan = status
	return u.repo.Update(existing) // atau panggil u.repo.UpdateStatusKehamilan(id, status) jika ingin lebih efisien
}