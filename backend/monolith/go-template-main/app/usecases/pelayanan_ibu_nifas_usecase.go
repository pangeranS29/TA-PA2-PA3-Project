package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type PelayananIbuNifasUsecase interface {
	Create(p *models.PelayananIbuNifas) error
	GetByID(id int32) (*models.PelayananIbuNifas, error)
	GetByKehamilanID(kehamilanID int32) ([]models.PelayananIbuNifas, error)
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
	if p.KehamilanID == 0 {
		return errors.New("kehamilan_id wajib diisi")
	}
	return u.repo.Create(p)
}

func (u *pelayananIbuNifasUsecase) GetByID(id int32) (*models.PelayananIbuNifas, error) {
	return u.repo.FindByID(id)
}

func (u *pelayananIbuNifasUsecase) GetByKehamilanID(kehamilanID int32) ([]models.PelayananIbuNifas, error) {
	return u.repo.FindByKehamilanID(kehamilanID)
}

func (u *pelayananIbuNifasUsecase) Update(p *models.PelayananIbuNifas) error {
	_, err := u.repo.FindByID(p.IDNifas)
	if err != nil {
		return errors.New("data pelayanan ibu nifas tidak ditemukan")
	}
	return u.repo.Update(p)
}

func (u *pelayananIbuNifasUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
