package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
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