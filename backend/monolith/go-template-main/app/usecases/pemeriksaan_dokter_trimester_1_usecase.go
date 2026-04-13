package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type PemeriksaanDokterTrimester1Usecase interface {
	Create(p *models.PemeriksaanDokterTrimester1) error
	GetByID(id uint) (*models.PemeriksaanDokterTrimester1, error)
	GetByIbuID(ibuID uint) ([]models.PemeriksaanDokterTrimester1, error)
	Update(p *models.PemeriksaanDokterTrimester1) error
	Delete(id uint) error
}

type pemeriksaanDokterTrimester1Usecase struct {
	repo *repositories.PemeriksaanDokterTrimester1Repository
}

func NewPemeriksaanDokterTrimester1Usecase(repo *repositories.PemeriksaanDokterTrimester1Repository) PemeriksaanDokterTrimester1Usecase {
	return &pemeriksaanDokterTrimester1Usecase{repo: repo}
}

func (u *pemeriksaanDokterTrimester1Usecase) Create(p *models.PemeriksaanDokterTrimester1) error {
	return u.repo.Create(p)
}

func (u *pemeriksaanDokterTrimester1Usecase) GetByID(id uint) (*models.PemeriksaanDokterTrimester1, error) {
	return u.repo.FindByID(id)
}

func (u *pemeriksaanDokterTrimester1Usecase) GetByIbuID(ibuID uint) ([]models.PemeriksaanDokterTrimester1, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *pemeriksaanDokterTrimester1Usecase) Update(p *models.PemeriksaanDokterTrimester1) error {
	return u.repo.Update(p)
}

func (u *pemeriksaanDokterTrimester1Usecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
