package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

// IbuUsecase mendefinisikan kontrak untuk business logic terkait Ibu
type IbuUsecase interface {
	Create(ibu *models.Ibu) error
	GetByID(id int32) (*models.Ibu, error)
	GetAll() ([]models.Ibu, error)
	Update(ibu *models.Ibu) error
	Delete(id int32) error
}

// ibuUsecase adalah implementasi dari IbuUsecase
type ibuUsecase struct {
	repo *repositories.IbuRepository
}

// NewIbuUsecase membuat instance baru dari IbuUsecase
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


// GetAll mengambil semua data ibu
func (u *ibuUsecase) GetAll() ([]models.Ibu, error) {
	return u.repo.FindAll()
}


// Update memperbarui data ibu yang sudah ada
func (u *ibuUsecase) Update(ibu *models.Ibu) error {
	// Pastikan data ada sebelum update
	_, err := u.repo.FindByID(ibu.ID)
	if err != nil {
		return errors.New("data ibu tidak ditemukan")
	}

	return u.repo.Update(ibu)
}


// Delete menghapus data ibu berdasarkan ID
func (u *ibuUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}