package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type EdukasiMPASIUsecase interface {
	Create(data *models.EdukasiMPASI) error
	GetAll() ([]models.EdukasiMPASI, error)
	GetByID(id int32) (*models.EdukasiMPASI, error)
	Update(id int32, data *models.EdukasiMPASI) error
	Delete(id int32) error
}

type edukasiMPASIUsecase struct {
	repo repositories.EdukasiMPASIRepository
}

func NewEdukasiMPASIUsecase(repo repositories.EdukasiMPASIRepository) EdukasiMPASIUsecase {
	return &edukasiMPASIUsecase{repo}
}

func (u *edukasiMPASIUsecase) Create(data *models.EdukasiMPASI) error {
	return u.repo.Create(data)
}

func (u *edukasiMPASIUsecase) GetAll() ([]models.EdukasiMPASI, error) {
	return u.repo.GetAll()
}

func (u *edukasiMPASIUsecase) GetByID(id int32) (*models.EdukasiMPASI, error) {
	return u.repo.GetByID(id)
}

func (u *edukasiMPASIUsecase) Update(id int32, data *models.EdukasiMPASI) error {
	return u.repo.Update(id, data)
}

func (u *edukasiMPASIUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
