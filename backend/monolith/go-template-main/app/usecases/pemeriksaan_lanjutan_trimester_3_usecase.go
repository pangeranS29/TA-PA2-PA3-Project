package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type PemeriksaanLanjutanTrimester3Usecase interface {
	Create(p *models.PemeriksaanLanjutanTrimester3) error
	GetByID(id int32) (*models.PemeriksaanLanjutanTrimester3, error)
	GetByIbuID(ibuID int32) ([]models.PemeriksaanLanjutanTrimester3, error)
	Update(p *models.PemeriksaanLanjutanTrimester3) error
	Delete(id int32) error
}

type pemeriksaanLanjutanTrimester3Usecase struct {
	repo *repositories.PemeriksaanLanjutanTrimester3Repository
}

func NewPemeriksaanLanjutanTrimester3Usecase(repo *repositories.PemeriksaanLanjutanTrimester3Repository) PemeriksaanLanjutanTrimester3Usecase {
	return &pemeriksaanLanjutanTrimester3Usecase{repo: repo}
}

func (u *pemeriksaanLanjutanTrimester3Usecase) Create(p *models.PemeriksaanLanjutanTrimester3) error {
	return u.repo.Create(p)
}

func (u *pemeriksaanLanjutanTrimester3Usecase) GetByID(id int32) (*models.PemeriksaanLanjutanTrimester3, error) {
	return u.repo.FindByID(id)
}

func (u *pemeriksaanLanjutanTrimester3Usecase) GetByIbuID(ibuID int32) ([]models.PemeriksaanLanjutanTrimester3, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *pemeriksaanLanjutanTrimester3Usecase) Update(p *models.PemeriksaanLanjutanTrimester3) error {
	return u.repo.Update(p)
}

func (u *pemeriksaanLanjutanTrimester3Usecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
