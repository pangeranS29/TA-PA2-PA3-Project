package usecases

import (
	"errors"
	"log"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type PendudukUsecase interface {
	Create(p *models.Penduduk) (*models.Penduduk, error)
	GetByID(id int64) (*models.Penduduk, error)
	GetByNIK(nik string) (*models.Penduduk, error)
	GetAll() ([]models.Penduduk, error)
	Update(p *models.Penduduk) error
	Delete(id int64) error
}

type pendudukUsecase struct {
	repo *repositories.PendudukRepository
}

func NewPendudukUsecase(repo *repositories.PendudukRepository) PendudukUsecase {
	return &pendudukUsecase{repo: repo}
}

func (u *pendudukUsecase) Create(p *models.Penduduk) (*models.Penduduk, error) {
	if p.NIK != nil && *p.NIK != "" {
		existing, err := u.repo.FindByNIK(*p.NIK)
		if err == nil && existing != nil {
			return nil, errors.New("NIK sudah terdaftar")
		}
	}
	err := u.repo.Create(p)
	if err != nil {
		log.Println("Error creating penduduk:", err)
		return nil, err
	}
	return p, nil
}

func (u *pendudukUsecase) GetByID(id int64) (*models.Penduduk, error) {
	return u.repo.FindByID(id)
}

func (u *pendudukUsecase) GetByNIK(nik string) (*models.Penduduk, error) {
	return u.repo.FindByNIK(nik)
}

func (u *pendudukUsecase) GetAll() ([]models.Penduduk, error) {
	return u.repo.GetAll()
}

func (u *pendudukUsecase) Update(p *models.Penduduk) error {
	_, err := u.repo.FindByID(p.ID)
	if err != nil {
		return errors.New("data penduduk tidak ditemukan")
	}
	return u.repo.Update(p)
}

func (u *pendudukUsecase) Delete(id int64) error {
	return u.repo.Delete(id)
}
