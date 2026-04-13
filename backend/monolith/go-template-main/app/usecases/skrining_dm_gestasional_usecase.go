package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type SkriningDMGestasionalUsecase interface {
	Create(s *models.SkriningDMGestasional) error
	GetByID(id uint) (*models.SkriningDMGestasional, error)
	GetByIbuID(ibuID uint) ([]models.SkriningDMGestasional, error)
	Update(s *models.SkriningDMGestasional) error
	Delete(id uint) error
}

type skriningDMGestasionalUsecase struct {
	repo *repositories.SkriningDMGestasionalRepository
}

func NewSkriningDMGestasionalUsecase(repo *repositories.SkriningDMGestasionalRepository) SkriningDMGestasionalUsecase {
	return &skriningDMGestasionalUsecase{repo: repo}
}

func (u *skriningDMGestasionalUsecase) Create(s *models.SkriningDMGestasional) error {
	return u.repo.Create(s)
}

func (u *skriningDMGestasionalUsecase) GetByID(id uint) (*models.SkriningDMGestasional, error) {
	return u.repo.FindByID(id)
}

func (u *skriningDMGestasionalUsecase) GetByIbuID(ibuID uint) ([]models.SkriningDMGestasional, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *skriningDMGestasionalUsecase) Update(s *models.SkriningDMGestasional) error {
	return u.repo.Update(s)
}

func (u *skriningDMGestasionalUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
