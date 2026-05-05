package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type RujukanUseCase interface {
	Create(rj *models.Rujukan) error
	GetByID(id int32) (*models.Rujukan, error)
	GetByKehamilanID(kehamilanID int32) ([]models.Rujukan, error)
	Update(rj *models.Rujukan) error
	Delete(id int32) error
}

type rujukanUseCase struct {
	repo *repositories.RujukanRepository
}

func NewRujukanUseCase(repo *repositories.RujukanRepository) RujukanUseCase {
	return &rujukanUseCase{repo: repo}
}

func (u *rujukanUseCase) Create(rj *models.Rujukan) error {
	if rj.KehamilanID == 0 {
		return errors.New("kehamilan_id wajib diisi")
	}
	return u.repo.Create(rj)
}

func (u *rujukanUseCase) GetByID(id int32) (*models.Rujukan, error) {
	return u.repo.FindByID(id)
}

func (u *rujukanUseCase) GetByKehamilanID(kehamilanID int32) ([]models.Rujukan, error) {
	return u.repo.FindByKehamilanID(kehamilanID)
}

func (u *rujukanUseCase) Update(rj *models.Rujukan) error {
	_, err := u.repo.FindByID(rj.ID)
	if err != nil {
		return errors.New("data rujukan tidak ditemukan")
	}
	return u.repo.Update(rj)
}

func (u *rujukanUseCase) Delete(id int32) error {
	return u.repo.Delete(id)
}
