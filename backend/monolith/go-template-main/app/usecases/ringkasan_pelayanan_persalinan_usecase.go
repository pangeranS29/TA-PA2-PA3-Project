package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type RingkasanPelayananPersalinanUsecase interface {
	Create(rp *models.RingkasanPelayananPersalinan) error
	GetByID(id uint) (*models.RingkasanPelayananPersalinan, error)
	GetByIbuID(ibuID uint) ([]models.RingkasanPelayananPersalinan, error)
	Update(rp *models.RingkasanPelayananPersalinan) error
	Delete(id uint) error
}

type ringkasanPelayananPersalinanUsecase struct {
	repo *repositories.RingkasanPelayananPersalinanRepository
}

func NewRingkasanPelayananPersalinanUsecase(repo *repositories.RingkasanPelayananPersalinanRepository) RingkasanPelayananPersalinanUsecase {
	return &ringkasanPelayananPersalinanUsecase{repo: repo}
}

func (u *ringkasanPelayananPersalinanUsecase) Create(rp *models.RingkasanPelayananPersalinan) error {
	return u.repo.Create(rp)
}

func (u *ringkasanPelayananPersalinanUsecase) GetByID(id uint) (*models.RingkasanPelayananPersalinan, error) {
	return u.repo.FindByID(id)
}

func (u *ringkasanPelayananPersalinanUsecase) GetByIbuID(ibuID uint) ([]models.RingkasanPelayananPersalinan, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *ringkasanPelayananPersalinanUsecase) Update(rp *models.RingkasanPelayananPersalinan) error {
	return u.repo.Update(rp)
}

func (u *ringkasanPelayananPersalinanUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
