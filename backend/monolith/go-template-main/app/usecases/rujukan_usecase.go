package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type RujukanUsecase interface {
	Create(rj *models.Rujukan) error
	GetByID(id int32) (*models.Rujukan, error)
	GetByIbuID(ibuID int32) ([]models.Rujukan, error)
	Update(rj *models.Rujukan) error
	Delete(id int32) error
}

type rujukanUsecase struct {
	repo *repositories.RujukanRepository
}

func NewRujukanUsecase(repo *repositories.RujukanRepository) RujukanUsecase {
	return &rujukanUsecase{repo: repo}
}

func (u *rujukanUsecase) Create(rj *models.Rujukan) error {
	return u.repo.Create(rj)
}

func (u *rujukanUsecase) GetByID(id int32) (*models.Rujukan, error) {
	return u.repo.FindByID(id)
}

func (u *rujukanUsecase) GetByIbuID(ibuID int32) ([]models.Rujukan, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *rujukanUsecase) Update(rj *models.Rujukan) error {
	return u.repo.Update(rj)
}

func (u *rujukanUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
