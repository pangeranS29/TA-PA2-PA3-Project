package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type PemeriksaanKehamilanUsecase interface {
	Create(p *models.PemeriksaanKehamilan) error
	GetByID(id uint) (*models.PemeriksaanKehamilan, error)
	GetByIbuID(ibuID uint) ([]models.PemeriksaanKehamilan, error)
	Update(p *models.PemeriksaanKehamilan) error
	Delete(id uint) error
}

type pemeriksaanKehamilanUsecase struct {
	repo *repositories.PemeriksaanKehamilanRepository
}

func NewPemeriksaanKehamilanUsecase(repo *repositories.PemeriksaanKehamilanRepository) PemeriksaanKehamilanUsecase {
	return &pemeriksaanKehamilanUsecase{repo: repo}
}

func (u *pemeriksaanKehamilanUsecase) Create(p *models.PemeriksaanKehamilan) error {
	return u.repo.Create(p)
}

func (u *pemeriksaanKehamilanUsecase) GetByID(id uint) (*models.PemeriksaanKehamilan, error) {
	return u.repo.FindByID(id)
}

func (u *pemeriksaanKehamilanUsecase) GetByIbuID(ibuID uint) ([]models.PemeriksaanKehamilan, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *pemeriksaanKehamilanUsecase) Update(p *models.PemeriksaanKehamilan) error {
	return u.repo.Update(p)
}

func (u *pemeriksaanKehamilanUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
