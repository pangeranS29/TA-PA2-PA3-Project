package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"time"
)

type PengukuranLilAUseCase interface {
	Create(req models.CreatePengukuranLilARequest) error
	Update(id int32, req models.UpdatePengukuranLilARequest) error
	GetByAnakID(anakID int32) ([]models.PengukuranLila, error)
	GetByID(id int32) (*models.PengukuranLila, error)
	GetAll() ([]models.PengukuranLila, error)
	Delete(id int32) error
}

type pengukuranlilaUseCase struct {
	repo repositories.PengukuranLilaRepository
}

func NewPengukuranLilAUseCase(repo repositories.PengukuranLilaRepository) PengukuranLilAUseCase {
	return &pengukuranlilaUseCase{repo: repo}
}

/*
	=========================
	  CREATE

=========================
*/
func (u *pengukuranlilaUseCase) Create(req models.CreatePengukuranLilARequest) error {

	if req.AnakID == 0 {
		return errors.New("anak_id wajib diisi")
	}

	now := time.Now()
	tgl, _ := time.Parse("2006-01-02", req.Tanggal)
	if tgl.IsZero() {
		tgl = now
	}

	kategori := classifyLila(int(req.Bulanke), req.HasilLila)

	pemeriksaan := models.PengukuranLila{
		AnakID:         req.AnakID,
		Bulanke:        req.Bulanke,
		Tanggal:        tgl,
		HasilLila:      req.HasilLila,
		KategoriRisiko: kategori,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	return u.repo.Create(&pemeriksaan)
}

/*
	=========================
	  UPDATE

=========================
*/
func (u *pengukuranlilaUseCase) Update(id int32, req models.UpdatePengukuranLilARequest) error {
	now := time.Now()

	if req.Bulanke != 0 || req.HasilLila != 0 {
		req.KategoriRisiko = classifyLila(int(req.Bulanke), req.HasilLila)
	}

	return u.repo.Update(id, req, now)
}

/*
	=========================
	  CLASSIFY LILA

=========================
*/
func classifyLila(bulan int, hasil float64) string {
	if hasil <= 0 {
		return ""
	}

	if bulan < 6 {
		if hasil < 10.0 {
			return "risiko"
		}
		if hasil >= 11.0 {
			return "baik"
		}
		return "risiko"
	}

	if hasil < 11.5 {
		return "gizi_buruk"
	}
	if hasil < 12.5 {
		return "gizi_kurang"
	}
	return "baik"
}

/*
	=========================
	  GET

=========================
*/
func (u *pengukuranlilaUseCase) GetByAnakID(anakID int32) ([]models.PengukuranLila, error) {
	return u.repo.GetByAnakID(anakID)
}

func (u *pengukuranlilaUseCase) GetByID(id int32) (*models.PengukuranLila, error) {
	return u.repo.GetByID(id)
}

func (u *pengukuranlilaUseCase) GetAll() ([]models.PengukuranLila, error) {
	return u.repo.GetAll()
}

/*
	=========================
	  DELETE

=========================
*/
func (u *pengukuranlilaUseCase) Delete(id int32) error {
	return u.repo.Delete(id)
}
