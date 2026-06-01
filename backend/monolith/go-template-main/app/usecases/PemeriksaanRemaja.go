package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type PemeriksaanRemajaUsecase interface {
	Create(data *models.PemeriksaanRemaja) error
	GetAll() ([]models.PemeriksaanRemaja, error)
	GetByID(id int32) (*models.PemeriksaanRemaja, error)
	Update(data *models.PemeriksaanRemaja) error
	Delete(id int32) error
}

type pemeriksaanRemajaUsecase struct {
	repo repositories.PemeriksaanRemajaRepository
}

func NewPemeriksaanRemajaUsecase(repo repositories.PemeriksaanRemajaRepository) PemeriksaanRemajaUsecase {
	return &pemeriksaanRemajaUsecase{repo: repo}
}

func (u *pemeriksaanRemajaUsecase) Create(data *models.PemeriksaanRemaja) error {
	return u.repo.Create(data)
}

func (u *pemeriksaanRemajaUsecase) GetAll() ([]models.PemeriksaanRemaja, error) {
	return u.repo.GetAll()
}

func (u *pemeriksaanRemajaUsecase) GetByID(id int32) (*models.PemeriksaanRemaja, error) {
	return u.repo.GetByID(id)
}

func (u *pemeriksaanRemajaUsecase) Update(data *models.PemeriksaanRemaja) error {
	return u.repo.Update(data)
}

func (u *pemeriksaanRemajaUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}