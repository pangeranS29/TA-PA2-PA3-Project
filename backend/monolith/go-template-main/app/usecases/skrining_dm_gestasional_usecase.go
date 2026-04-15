package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type SkriningDMGestasionalUsecase interface {
	Create(s *models.SkriningDMGestasional) error
	GetByID(id int32) (*models.SkriningDMGestasional, error)
	GetByIbuID(ibuID int32) ([]models.SkriningDMGestasional, error)
	Update(s *models.SkriningDMGestasional) error
	Delete(id int32) error
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

func (u *skriningDMGestasionalUsecase) GetByID(id int32) (*models.SkriningDMGestasional, error) {
	return u.repo.FindByID(id)
}

func (u *skriningDMGestasionalUsecase) GetByIbuID(ibuID int32) ([]models.SkriningDMGestasional, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *skriningDMGestasionalUsecase) Update(s *models.SkriningDMGestasional) error {
	return u.repo.Update(s)
}

func (u *skriningDMGestasionalUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
