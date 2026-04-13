package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type KeteranganLahirUsecase interface {
	Create(k *models.KeteranganLahir) error
	GetByID(id uint) (*models.KeteranganLahir, error)
	GetByIbuID(ibuID uint) ([]models.KeteranganLahir, error)
	Update(k *models.KeteranganLahir) error
	Delete(id uint) error
}

type keteranganLahirUsecase struct {
	repo *repositories.KeteranganLahirRepository
}

func NewKeteranganLahirUsecase(repo *repositories.KeteranganLahirRepository) KeteranganLahirUsecase {
	return &keteranganLahirUsecase{repo: repo}
}

func (u *keteranganLahirUsecase) Create(k *models.KeteranganLahir) error {
	return u.repo.Create(k)
}

func (u *keteranganLahirUsecase) GetByID(id uint) (*models.KeteranganLahir, error) {
	return u.repo.FindByID(id)
}

func (u *keteranganLahirUsecase) GetByIbuID(ibuID uint) ([]models.KeteranganLahir, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *keteranganLahirUsecase) Update(k *models.KeteranganLahir) error {
	return u.repo.Update(k)
}

func (u *keteranganLahirUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
