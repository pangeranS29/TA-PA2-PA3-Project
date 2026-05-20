package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type PemeriksaanLansiaUsecase interface {
	Create(data *models.PemeriksaanLansia) error
	GetAll() ([]models.PemeriksaanLansia, error)
	GetByID(id int32) (*models.PemeriksaanLansia, error)
	Update(data *models.PemeriksaanLansia) error
	Delete(id int32) error
}

type pemeriksaanLansiaUsecase struct {
	repo repositories.PemeriksaanLansiaRepository
}

func NewPemeriksaanLansiaUsecase(
	repo repositories.PemeriksaanLansiaRepository,
) PemeriksaanLansiaUsecase {
	return &pemeriksaanLansiaUsecase{
		repo: repo,
	}
}

func (u *pemeriksaanLansiaUsecase) Create(data *models.PemeriksaanLansia) error {
	return u.repo.Create(data)
}

func (u *pemeriksaanLansiaUsecase) GetAll() ([]models.PemeriksaanLansia, error) {
	return u.repo.GetAll()
}

func (u *pemeriksaanLansiaUsecase) GetByID(id int32) (*models.PemeriksaanLansia, error) {
	return u.repo.GetByID(id)
}

func (u *pemeriksaanLansiaUsecase) Update(data *models.PemeriksaanLansia) error {
	return u.repo.Update(data)
}

func (u *pemeriksaanLansiaUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}