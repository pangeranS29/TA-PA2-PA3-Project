package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type RingkasanPelayananPersalinanUsecase interface {
	Create(rp *models.RingkasanPelayananPersalinan) error
	GetByID(id int32) (*models.RingkasanPelayananPersalinan, error)
	GetByIbuID(ibuID int32) ([]models.RingkasanPelayananPersalinan, error)
	Update(rp *models.RingkasanPelayananPersalinan) error
	Delete(id int32) error
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

func (u *ringkasanPelayananPersalinanUsecase) GetByID(id int32) (*models.RingkasanPelayananPersalinan, error) {
	return u.repo.FindByID(id)
}

func (u *ringkasanPelayananPersalinanUsecase) GetByIbuID(ibuID int32) ([]models.RingkasanPelayananPersalinan, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *ringkasanPelayananPersalinanUsecase) Update(rp *models.RingkasanPelayananPersalinan) error {
	return u.repo.Update(rp)
}

func (u *ringkasanPelayananPersalinanUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
