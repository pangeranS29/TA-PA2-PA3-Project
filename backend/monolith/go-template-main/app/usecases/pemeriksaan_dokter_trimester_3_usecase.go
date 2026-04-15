package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type PemeriksaanDokterTrimester3Usecase interface {
	Create(p *models.PemeriksaanDokterTrimester3) error
	GetByID(id int32) (*models.PemeriksaanDokterTrimester3, error)
	GetByIbuID(ibuID int32) ([]models.PemeriksaanDokterTrimester3, error)
	Update(p *models.PemeriksaanDokterTrimester3) error
	Delete(id int32) error
}

type pemeriksaanDokterTrimester3Usecase struct {
	repo *repositories.PemeriksaanDokterTrimester3Repository
}

func NewPemeriksaanDokterTrimester3Usecase(repo *repositories.PemeriksaanDokterTrimester3Repository) PemeriksaanDokterTrimester3Usecase {
	return &pemeriksaanDokterTrimester3Usecase{repo: repo}
}

func (u *pemeriksaanDokterTrimester3Usecase) Create(p *models.PemeriksaanDokterTrimester3) error {
	return u.repo.Create(p)
}

func (u *pemeriksaanDokterTrimester3Usecase) GetByID(id int32) (*models.PemeriksaanDokterTrimester3, error) {
	return u.repo.FindByID(id)
}

func (u *pemeriksaanDokterTrimester3Usecase) GetByIbuID(ibuID int32) ([]models.PemeriksaanDokterTrimester3, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *pemeriksaanDokterTrimester3Usecase) Update(p *models.PemeriksaanDokterTrimester3) error {
	return u.repo.Update(p)
}

func (u *pemeriksaanDokterTrimester3Usecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
