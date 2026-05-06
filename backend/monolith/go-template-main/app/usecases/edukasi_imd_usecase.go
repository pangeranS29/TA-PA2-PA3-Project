package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type EdukasiImdUsecase interface {
	Create(data *models.EdukasiImd) error
	GetAll() ([]models.EdukasiImd, error)
	GetByID(id int32) (*models.EdukasiImd, error)
	Update(id int32, data *models.EdukasiImd) error
	Delete(id int32) error
}

type edukasiImdUsecase struct {
	repo repositories.EdukasiImdRepository
}

func NewEdukasiImdUsecase(repo repositories.EdukasiImdRepository) EdukasiImdUsecase {
	return &edukasiImdUsecase{repo}
}

func (u *edukasiImdUsecase) Create(data *models.EdukasiImd) error {
	return u.repo.Create(data)
}

func (u *edukasiImdUsecase) GetAll() ([]models.EdukasiImd, error) {
	return u.repo.FindAll()
}

func (u *edukasiImdUsecase) GetByID(id int32) (*models.EdukasiImd, error) {
	return u.repo.FindByID(id)
}

func (u *edukasiImdUsecase) Update(id int32, data *models.EdukasiImd) error {
	existing, err := u.repo.FindByID(id)
	if err != nil {
		return errors.New("data not found")
	}

	existing.Judul = data.Judul
	existing.GambarURL = data.GambarURL
	existing.Isi = data.Isi

	return u.repo.Update(existing)
}

func (u *edukasiImdUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}