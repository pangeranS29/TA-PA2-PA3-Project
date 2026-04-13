package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type RiwayatProsesMelahirkanUsecase interface {
	Create(rp *models.RiwayatProsesMelahirkan) error
	GetByID(id uint) (*models.RiwayatProsesMelahirkan, error)
	GetByIbuID(ibuID uint) ([]models.RiwayatProsesMelahirkan, error)
	Update(rp *models.RiwayatProsesMelahirkan) error
	Delete(id uint) error
}

type riwayatProsesMelahirkanUsecase struct {
	repo *repositories.RiwayatProsesMelahirkanRepository
}

func NewRiwayatProsesMelahirkanUsecase(repo *repositories.RiwayatProsesMelahirkanRepository) RiwayatProsesMelahirkanUsecase {
	return &riwayatProsesMelahirkanUsecase{repo: repo}
}

func (u *riwayatProsesMelahirkanUsecase) Create(rp *models.RiwayatProsesMelahirkan) error {
	return u.repo.Create(rp)
}

func (u *riwayatProsesMelahirkanUsecase) GetByID(id uint) (*models.RiwayatProsesMelahirkan, error) {
	return u.repo.FindByID(id)
}

func (u *riwayatProsesMelahirkanUsecase) GetByIbuID(ibuID uint) ([]models.RiwayatProsesMelahirkan, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *riwayatProsesMelahirkanUsecase) Update(rp *models.RiwayatProsesMelahirkan) error {
	return u.repo.Update(rp)
}

func (u *riwayatProsesMelahirkanUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
