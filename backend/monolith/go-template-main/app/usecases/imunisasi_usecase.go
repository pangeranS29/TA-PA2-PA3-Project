package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"time"
)

type ImunisasiUsecase interface {
	CreateImunisasi(req models.ImunisasiRequest) (*models.JadwalImunisasi, error)
	GetImunisasiByAnakID(anakID int) ([]models.JadwalImunisasi, error)
	GetImunisasiByID(id uint) (*models.JadwalImunisasi, error)
	UpdateImunisasi(id uint, req models.ImunisasiRequest) (*models.JadwalImunisasi, error)
	DeleteImunisasi(id uint) error
}

type imunisasiUsecase struct {
	imunisasiRepo repositories.ImunisasiRepository
}

func NewImunisasiUsecase(repo repositories.ImunisasiRepository) ImunisasiUsecase {
	return &imunisasiUsecase{
		imunisasiRepo: repo,
	}
}

func (u *imunisasiUsecase) CreateImunisasi(req models.ImunisasiRequest) (*models.JadwalImunisasi, error) {
	jadwalImunisasi := &models.JadwalImunisasi{
		AnakID:       req.AnakID,
		ImunisasiID:  req.ImunisasiID,
		TglRencana:   req.TglRencana,
		TglPemberian: req.TglPemberian,
		Status:       req.Status,
		Lokasi:       req.Lokasi,
		Petugas:      req.Petugas,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	err := u.imunisasiRepo.Create(jadwalImunisasi)
	if err != nil {
		return nil, err
	}
	return jadwalImunisasi, nil
}

func (u *imunisasiUsecase) GetImunisasiByAnakID(anakID int) ([]models.JadwalImunisasi, error) {
	return u.imunisasiRepo.FindAllByAnakID(anakID)
}

func (u *imunisasiUsecase) GetImunisasiByID(id uint) (*models.JadwalImunisasi, error) {
	return u.imunisasiRepo.FindByID(id)
}

func (u *imunisasiUsecase) UpdateImunisasi(id uint, req models.ImunisasiRequest) (*models.JadwalImunisasi, error) {
	jadwalImunisasi, err := u.imunisasiRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("data imunisasi tidak ditemukan")
	}

	jadwalImunisasi.AnakID = req.AnakID
	jadwalImunisasi.ImunisasiID = req.ImunisasiID
	jadwalImunisasi.TglRencana = req.TglRencana
	jadwalImunisasi.TglPemberian = req.TglPemberian
	jadwalImunisasi.Status = req.Status
	jadwalImunisasi.Lokasi = req.Lokasi
	jadwalImunisasi.Petugas = req.Petugas
	jadwalImunisasi.UpdatedAt = time.Now()

	err = u.imunisasiRepo.Update(jadwalImunisasi)
	if err != nil {
		return nil, err
	}
	return jadwalImunisasi, nil
}

func (u *imunisasiUsecase) DeleteImunisasi(id uint) error {
	return u.imunisasiRepo.Delete(id)
}
