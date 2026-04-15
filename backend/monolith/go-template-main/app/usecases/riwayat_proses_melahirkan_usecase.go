package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type RiwayatProsesMelahirkanUsecase interface {
	Create(rp *models.RiwayatProsesMelahirkan) error
	GetByID(id int32) (*models.RiwayatProsesMelahirkan, error)
	GetByIbuID(ibuID int32) ([]models.RiwayatProsesMelahirkan, error)
	Update(rp *models.RiwayatProsesMelahirkan) error
	Delete(id int32) error
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

func (u *riwayatProsesMelahirkanUsecase) GetByID(id int32) (*models.RiwayatProsesMelahirkan, error) {
	return u.repo.FindByID(id)
}

func (u *riwayatProsesMelahirkanUsecase) GetByIbuID(ibuID int32) ([]models.RiwayatProsesMelahirkan, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *riwayatProsesMelahirkanUsecase) Update(rp *models.RiwayatProsesMelahirkan) error {
	return u.repo.Update(rp)
}

func (u *riwayatProsesMelahirkanUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
