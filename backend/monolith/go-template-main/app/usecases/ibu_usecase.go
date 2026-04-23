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

// CREATE
func (u *ibuUsecase) Create(ibu *models.Ibu) error {
	if ibu.PendudukID == 0 {
		return errors.New("penduduk_id wajib diisi")
	}

	return u.repo.Create(ibu)
}

// GET BY ID
func (u *ibuUsecase) GetByID(id int32) (*models.Ibu, error) {
	return u.repo.FindByID(id)
}

// GET ALL
func (u *ibuUsecase) GetAll() ([]models.Ibu, error) {
	return u.repo.FindAll()
}

// UPDATE
func (u *ibuUsecase) Update(ibu *models.Ibu) error {
	existing, err := u.repo.FindByID(ibu.ID)
	if err != nil || existing == nil {
		return errors.New("data ibu tidak ditemukan")
	}

	return u.repo.Update(ibu)
}

// DELETE
func (u *ibuUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}