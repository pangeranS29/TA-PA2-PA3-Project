package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type SkriningPreeklampsiaUsecase interface {
	Create(s *models.SkriningPreeklampsia) error
	GetByID(id int32) (*models.SkriningPreeklampsia, error)
	GetByKehamilanID(kehamilanID int32) ([]models.SkriningPreeklampsia, error)
	Update(s *models.SkriningPreeklampsia) error
	Delete(id int32) error
}

type skriningPreeklampsiaUsecase struct {
	repo *repositories.SkriningPreeklampsiaRepository
}

func NewSkriningPreeklampsiaUsecase(repo *repositories.SkriningPreeklampsiaRepository) SkriningPreeklampsiaUsecase {
	return &skriningPreeklampsiaUsecase{repo: repo}
}

func (u *skriningPreeklampsiaUsecase) Create(s *models.SkriningPreeklampsia) error {
	if s.KehamilanID == 0 {
		return errors.New("kehamilan_id wajib diisi")
	}
	return u.repo.Create(s)
}

func (u *skriningPreeklampsiaUsecase) GetByID(id int32) (*models.SkriningPreeklampsia, error) {
	return u.repo.FindByID(id)
}

func (u *skriningPreeklampsiaUsecase) GetByKehamilanID(kehamilanID int32) ([]models.SkriningPreeklampsia, error) {
	return u.repo.FindByKehamilanID(kehamilanID)
}

func (u *skriningPreeklampsiaUsecase) Update(s *models.SkriningPreeklampsia) error {
	_, err := u.repo.FindByID(s.IDSkriningPreeklampsia)
	if err != nil {
		return errors.New("data skrining preeklampsia tidak ditemukan")
	}
	return u.repo.Update(s)
}

func (u *skriningPreeklampsiaUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
