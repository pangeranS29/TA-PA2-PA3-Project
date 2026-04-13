package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type IbuHamilUsecase interface {
	Create(ibu *models.IbuHamil) error
	GetByID(id uint) (*models.IbuHamil, error)
	GetAll() ([]models.IbuHamil, error)
	Update(ibu *models.IbuHamil) error
	Delete(id uint) error
}

type ibuHamilUsecase struct {
	repo *repositories.IbuHamilRepository
}

func NewIbuHamilUsecase(repo *repositories.IbuHamilRepository) IbuHamilUsecase {
	return &ibuHamilUsecase{repo: repo}
}

func (u *ibuHamilUsecase) Create(ibu *models.IbuHamil) error {
	return u.repo.Create(ibu)
}

func (u *ibuHamilUsecase) GetByID(id uint) (*models.IbuHamil, error) {
	return u.repo.FindByID(id)
}

func (u *ibuHamilUsecase) GetAll() ([]models.IbuHamil, error) {
	return u.repo.FindAll()
}

func (u *ibuHamilUsecase) Update(ibu *models.IbuHamil) error {
	return u.repo.Update(ibu)
}

func (u *ibuHamilUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
