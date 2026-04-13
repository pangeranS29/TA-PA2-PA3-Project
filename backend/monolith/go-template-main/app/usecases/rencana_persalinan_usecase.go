package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type RencanaPersalinanUsecase interface {
	Create(rp *models.RencanaPersalinan) error
	GetByID(id uint) (*models.RencanaPersalinan, error)
	GetByIbuID(ibuID uint) ([]models.RencanaPersalinan, error)
	Update(rp *models.RencanaPersalinan) error
	Delete(id uint) error
}

type rencanaPersalinanUsecase struct {
	repo *repositories.RencanaPersalinanRepository
}

func NewRencanaPersalinanUsecase(repo *repositories.RencanaPersalinanRepository) RencanaPersalinanUsecase {
	return &rencanaPersalinanUsecase{repo: repo}
}

func (u *rencanaPersalinanUsecase) Create(rp *models.RencanaPersalinan) error {
	return u.repo.Create(rp)
}

func (u *rencanaPersalinanUsecase) GetByID(id uint) (*models.RencanaPersalinan, error) {
	return u.repo.FindByID(id)
}

func (u *rencanaPersalinanUsecase) GetByIbuID(ibuID uint) ([]models.RencanaPersalinan, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *rencanaPersalinanUsecase) Update(rp *models.RencanaPersalinan) error {
	return u.repo.Update(rp)
}

func (u *rencanaPersalinanUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
