package usecases

import (
	"errors"
	"fmt"
	"time"

	"monitoring-service/app/models"
	"monitoring-service/app/repositories"

	"gorm.io/gorm"
)

type AnakUseCase struct {
	anakRepo *repositories.AnakRepository
}

func NewAnakUseCase(anakRepo *repositories.AnakRepository) *AnakUseCase {
	return &AnakUseCase{
		anakRepo: anakRepo,
	}
}

// ====================== GET ======================
func (u *AnakUseCase) GetAnak(id int32) (*models.AnakResponse, error) {
	anak, err := u.anakRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("data anak tidak ditemukan")
		}
		return nil, err
	}

	resp := u.toAnakResponse(anak)
	return &resp, nil
}
// ====================== CREATE ======================
func (u *AnakUseCase) CreateAnak(req models.CreateAnakRequest) (*models.AnakResponse, error) {
	tanggalLahir, err := time.Parse("2006-01-02", req.TanggalLahir)
	if err != nil {
		return nil, errors.New("format tanggal_lahir tidak valid, gunakan YYYY-MM-DD")
	}

	// validasi tambahan
	if tanggalLahir.After(time.Now()) {
		return nil, errors.New("tanggal_lahir tidak boleh di masa depan")
	}

	if req.JenisKelamin != "laki-laki" && req.JenisKelamin != "perempuan" {
		return nil, errors.New("jenis_kelamin harus 'laki-laki' atau 'perempuan'")
	}

	anak := &models.Anak{
		KehamilanID:   req.KehamilanID,
		Nama:          req.Nama,
		TanggalLahir:  tanggalLahir,
		JenisKelamin:  req.JenisKelamin,
		BeratLahirKg:  req.BeratLahirKg,
		GolonganDarah: req.GolonganDarah,
	}

	if err := u.anakRepo.Create(anak); err != nil {
		return nil, err
	}

	resp := u.toAnakResponse(anak)
	return &resp, nil
}

// ====================== UPDATE ======================
func (u *AnakUseCase) UpdateAnak(id int32, req models.UpdateAnakRequest) (*models.AnakResponse, error) {
	anak, err := u.anakRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("data anak tidak ditemukan")
	}

	if req.Nama != "" {
		anak.Nama = req.Nama
	}

	if req.TanggalLahir != "" {
		t, err := time.Parse("2006-01-02", req.TanggalLahir)
		if err != nil {
			return nil, errors.New("format tanggal_lahir tidak valid, gunakan YYYY-MM-DD")
		}

		if t.After(time.Now()) {
			return nil, errors.New("tanggal_lahir tidak boleh di masa depan")
		}

		anak.TanggalLahir = t
	}

	if req.JenisKelamin != "" {
		if req.JenisKelamin != "laki-laki" && req.JenisKelamin != "perempuan" {
			return nil, errors.New("jenis_kelamin tidak valid")
		}
		anak.JenisKelamin = req.JenisKelamin
	}

	if req.BeratLahirKg != nil {
		anak.BeratLahirKg = req.BeratLahirKg
	}

	if req.GolonganDarah != nil {
		anak.GolonganDarah = req.GolonganDarah
	}

	if err := u.anakRepo.Update(anak); err != nil {
		return nil, err
	}

	resp := u.toAnakResponse(anak)
	return &resp, nil
}

// ====================== DELETE ======================
func (u *AnakUseCase) DeleteAnak(id int32) error {
	return u.anakRepo.Delete(id)
}

// ====================== LIST ======================
func (u *AnakUseCase) AdminListAnak(kehamilanID int32) ([]models.AnakResponse, error) {
	var (
		list []models.Anak
		err  error
	)

	// FIX: harus dibandingkan dengan 0
	if kehamilanID != 0 {
		list, err = u.anakRepo.FindByKehamilanID(kehamilanID)
	} else {
		list, err = u.anakRepo.FindAll()
	}

	if err != nil {
		return nil, err
	}

	result := make([]models.AnakResponse, 0, len(list))

	for _, k := range list {
		resp := u.toAnakResponse(&k)
		result = append(result, resp)
	}

	return result, nil
}

// ====================== UTIL ======================
func HitungUsiaBulan(tanggalLahir time.Time) int {
	now := time.Now()

	if tanggalLahir.After(now) {
		return 0
	}

	years := now.Year() - tanggalLahir.Year()
	months := int(now.Month()) - int(tanggalLahir.Month())
	total := years*12 + months

	if now.Day() < tanggalLahir.Day() {
		total--
	}

	if total < 0 {
		return 0
	}

	return total
}

func FormatUsiaTeks(bulan int) string {
	if bulan == 0 {
		return "0 bulan"
	}
	if bulan < 12 {
		return fmt.Sprintf("%d bulan", bulan)
	}

	tahun := bulan / 12
	sisa := bulan % 12

	if sisa == 0 {
		return fmt.Sprintf("%d tahun", tahun)
	}

	return fmt.Sprintf("%d tahun %d bulan", tahun, sisa)
}

func FormatLabelUsia(bulan int) string {
	if bulan == 0 {
		return "Baru Lahir (0 Bulan)"
	}
	if bulan < 12 {
		return fmt.Sprintf("%d Bulan", bulan)
	}

	tahun := bulan / 12
	sisa := bulan % 12

	if sisa == 0 {
		return fmt.Sprintf("%d Tahun", tahun)
	}

	return fmt.Sprintf("%d Tahun %d Bulan", tahun, sisa)
}

// ====================== MAPPER ======================
func (u *AnakUseCase) toAnakResponse(anak *models.Anak) models.AnakResponse {
	usiaBulan := HitungUsiaBulan(anak.TanggalLahir)

	resp := models.AnakResponse{
		ID:            anak.ID,
		Nama:          anak.Nama,
		TanggalLahir:  anak.TanggalLahir.Format("2006-01-02"),
		JenisKelamin:  anak.JenisKelamin,
		UsiaBulan:     usiaBulan,
		UsiaTeks:      FormatUsiaTeks(usiaBulan),
		BeratLahirKg:  anak.BeratLahirKg,
		GolonganDarah: anak.GolonganDarah,
	}

	// 🔥 INI YANG HILANG SELAMA INI
	if anak.Kehamilan != nil {
		resp.Kehamilan = &models.KehamilanSimple{
			ID: anak.Kehamilan.ID,
		}

		// if anak.Kehamilan.Ibu != nil {
		// 	resp.Kehamilan.Ibu.NamaIbu = anak.Kehamilan.Ibu.Kependudukan.NamaLengkap
		// }
	}

	return resp
}
