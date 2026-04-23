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
	return &AnakUseCase{anakRepo: anakRepo}
}

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

func (u *AnakUseCase) CreateAnak(req models.CreateAnakRequest) (*models.AnakResponse, error) {
	if req.KehamilanID == 0 {
		return nil, errors.New("kehamilan_id wajib diisi")
	}
	if req.PendudukID == 0 {
		return nil, errors.New("penduduk_id wajib diisi")
	}

	anak := &models.Anak{
		KehamilanID: req.KehamilanID,
		PendudukID:  &req.PendudukID,
		BeratLahir:  req.BeratLahirKg,
		TinggiLahir: req.TinggiLahirCm,
	}

	if err := u.anakRepo.Create(anak); err != nil {
		return nil, err
	}

	// reload relasi (kalau repo support preload)
	anak, err := u.anakRepo.FindByID(anak.ID)
	if err != nil {
		return nil, err
	}

	resp := u.toAnakResponse(anak)
	return &resp, nil
}

func (u *AnakUseCase) UpdateAnak(id int32, req models.UpdateAnakRequest) (*models.AnakResponse, error) {

	anak, err := u.anakRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("data anak tidak ditemukan")
	}

	if req.PendudukID != nil {
		anak.PendudukID = req.PendudukID
	}
	if req.BeratLahirKg != nil {
		anak.BeratLahir = req.BeratLahirKg
	}
	if req.TinggiLahirCm != nil {
		anak.TinggiLahir = req.TinggiLahirCm
	}

	if err := u.anakRepo.Update(anak); err != nil {
		return nil, err
	}

	anak, _ = u.anakRepo.FindByID(id)

	resp := u.toAnakResponse(anak)
	return &resp, nil
}

func (u *AnakUseCase) DeleteAnak(id int32) error {
	return u.anakRepo.Delete(id)
}

func (u *AnakUseCase) AdminListAnak(kehamilanID int32) ([]models.AnakResponse, error) {

	var (
		list []models.Anak
		err  error
	)

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

func (u *AnakUseCase) toAnakResponse(anak *models.Anak) models.AnakResponse {
	resp := models.AnakResponse{
		ID:           anak.ID,
		BeratLahirKg: anak.BeratLahir,
	}
	if anak.Penduduk != nil {
		if anak.Penduduk.NamaLengkap != nil {
			resp.Nama = *anak.Penduduk.NamaLengkap
		}
		if anak.Penduduk.TanggalLahir != nil {
			resp.TanggalLahir = anak.Penduduk.TanggalLahir.Format("2006-01-02")
			usiaBulan := HitungUsiaBulan(*anak.Penduduk.TanggalLahir)
			resp.UsiaBulan = usiaBulan
			resp.UsiaTeks = FormatUsiaTeks(usiaBulan)
		}
		if anak.Penduduk.JenisKelamin != nil {
			resp.JenisKelamin = *anak.Penduduk.JenisKelamin
		}
	}
	if anak.Kehamilan != nil {
		resp.Kehamilan = &models.KehamilanSimple{ID: anak.Kehamilan.ID}
	}
	return resp
}
