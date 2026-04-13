package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type SkriningPreeklampsiaUsecase interface {
	Create(s *models.SkriningPreeklampsia) error
	GetByID(id uint) (*models.SkriningPreeklampsia, error)
	GetByIbuID(ibuID uint) ([]models.SkriningPreeklampsia, error)
	Update(s *models.SkriningPreeklampsia) error
	Delete(id uint) error
}

type skriningPreeklampsiaUsecase struct {
	repo *repositories.SkriningPreeklampsiaRepository
}

func NewSkriningPreeklampsiaUsecase(repo *repositories.SkriningPreeklampsiaRepository) SkriningPreeklampsiaUsecase {
	return &skriningPreeklampsiaUsecase{repo: repo}
}

func (u *skriningPreeklampsiaUsecase) Create(s *models.SkriningPreeklampsia) error {
	return u.repo.Create(s)
}

func (u *skriningPreeklampsiaUsecase) GetByID(id uint) (*models.SkriningPreeklampsia, error) {
	return u.repo.FindByID(id)
}

func (u *skriningPreeklampsiaUsecase) GetByIbuID(ibuID uint) ([]models.SkriningPreeklampsia, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *skriningPreeklampsiaUsecase) Update(s *models.SkriningPreeklampsia) error {
	return u.repo.Update(s)
}

func (u *skriningPreeklampsiaUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
