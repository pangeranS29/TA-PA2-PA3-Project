package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type RiwayatKehamilanLaluUsecase interface {
	Create(rk *models.RiwayatKehamilanLalu) error
	GetByID(id uint) (*models.RiwayatKehamilanLalu, error)
	GetByEvaluasiID(evaluasiID uint) ([]models.RiwayatKehamilanLalu, error)
	Update(rk *models.RiwayatKehamilanLalu) error
	Delete(id uint) error
}

type riwayatKehamilanLaluUsecase struct {
	repo *repositories.RiwayatKehamilanLaluRepository
}

func NewRiwayatKehamilanLaluUsecase(repo *repositories.RiwayatKehamilanLaluRepository) RiwayatKehamilanLaluUsecase {
	return &riwayatKehamilanLaluUsecase{repo: repo}
}

func (u *riwayatKehamilanLaluUsecase) Create(rk *models.RiwayatKehamilanLalu) error {
	return u.repo.Create(rk)
}

func (u *riwayatKehamilanLaluUsecase) GetByID(id uint) (*models.RiwayatKehamilanLalu, error) {
	return u.repo.FindByID(id)
}

func (u *riwayatKehamilanLaluUsecase) GetByEvaluasiID(evaluasiID uint) ([]models.RiwayatKehamilanLalu, error) {
	return u.repo.FindByEvaluasiID(evaluasiID)
}

func (u *riwayatKehamilanLaluUsecase) Update(rk *models.RiwayatKehamilanLalu) error {
	return u.repo.Update(rk)
}

func (u *riwayatKehamilanLaluUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
