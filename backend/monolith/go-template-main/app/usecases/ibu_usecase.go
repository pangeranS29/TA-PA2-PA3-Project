package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type IbuUsecase interface {
	Create(ibu *models.Ibu) error
	GetByID(id int32) (*models.Ibu, error)
	GetAll() ([]models.Ibu, error)
	Update(ibu *models.Ibu) error
	Delete(id int32) error
}

type ibuUsecase struct {
	repo *repositories.IbuRepository
}

func NewIbuUsecase(repo *repositories.IbuRepository) IbuUsecase {
	return &ibuUsecase{repo: repo}
}

func (u *ibuUsecase) Create(ibu *models.Ibu) error {
	if ibu.PendudukID == 0 {
		return errors.New("penduduk_id wajib diisi")
	}
	return u.repo.Create(ibu)
}

func (u *ibuUsecase) GetByID(id int32) (*models.Ibu, error) {
	return u.repo.FindByID(id)
}

func (u *ibuUsecase) GetAll() ([]models.Ibu, error) {
	return u.repo.FindAll()
}

func (u *ibuUsecase) Update(ibu *models.Ibu) error {
	_, err := u.repo.FindByID(ibu.ID)
	if err != nil {
		return errors.New("data ibu tidak ditemukan")
	}
	return u.repo.Update(ibu)
}

func (u *ibuUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
