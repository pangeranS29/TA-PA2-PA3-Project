package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type PelayananIbuNifasUsecase interface {
	Create(p *models.PelayananIbuNifas) error
	GetByID(id int32) (*models.PelayananIbuNifas, error)
	GetByIbuID(ibuID int32) ([]models.PelayananIbuNifas, error)
	Update(p *models.PelayananIbuNifas) error
	Delete(id int32) error
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

func (u *pelayananIbuNifasUsecase) GetByID(id int32) (*models.PelayananIbuNifas, error) {
	return u.repo.FindByID(id)
}

func (u *pelayananIbuNifasUsecase) GetByIbuID(ibuID int32) ([]models.PelayananIbuNifas, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *pelayananIbuNifasUsecase) Update(p *models.PelayananIbuNifas) error {
	return u.repo.Update(p)
}

func (u *pelayananIbuNifasUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
