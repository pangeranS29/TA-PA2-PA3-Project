package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type PelayananIbuNifasUsecase interface {
	Create(p *models.PelayananIbuNifas) error
	GetByID(id uint) (*models.PelayananIbuNifas, error)
	GetByIbuID(ibuID uint) ([]models.PelayananIbuNifas, error)
	Update(p *models.PelayananIbuNifas) error
	Delete(id uint) error
}

type pelayananIbuNifasUsecase struct {
	repo *repositories.PelayananIbuNifasRepository
}

func NewPelayananIbuNifasUsecase(repo *repositories.PelayananIbuNifasRepository) PelayananIbuNifasUsecase {
	return &pelayananIbuNifasUsecase{repo: repo}
}

func (u *pelayananIbuNifasUsecase) Create(p *models.PelayananIbuNifas) error {
	return u.repo.Create(p)
}

func (u *pelayananIbuNifasUsecase) GetByID(id uint) (*models.PelayananIbuNifas, error) {
	return u.repo.FindByID(id)
}

func (u *pelayananIbuNifasUsecase) GetByIbuID(ibuID uint) ([]models.PelayananIbuNifas, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *pelayananIbuNifasUsecase) Update(p *models.PelayananIbuNifas) error {
	return u.repo.Update(p)
}

func (u *pelayananIbuNifasUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
