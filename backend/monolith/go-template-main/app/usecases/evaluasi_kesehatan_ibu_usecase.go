package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type EvaluasiKesehatanIbuUsecase interface {
	Create(e *models.EvaluasiKesehatanIbu) error
	GetByID(id uint) (*models.EvaluasiKesehatanIbu, error)
	GetByIbuID(ibuID uint) ([]models.EvaluasiKesehatanIbu, error)
	Update(e *models.EvaluasiKesehatanIbu) error
	Delete(id uint) error
}

type evaluasiKesehatanIbuUsecase struct {
	repo *repositories.EvaluasiKesehatanIbuRepository
}

func NewEvaluasiKesehatanIbuUsecase(repo *repositories.EvaluasiKesehatanIbuRepository) EvaluasiKesehatanIbuUsecase {
	return &evaluasiKesehatanIbuUsecase{repo: repo}
}

func (u *evaluasiKesehatanIbuUsecase) Create(e *models.EvaluasiKesehatanIbu) error {
	return u.repo.Create(e)
}

func (u *evaluasiKesehatanIbuUsecase) GetByID(id uint) (*models.EvaluasiKesehatanIbu, error) {
	return u.repo.FindByID(id)
}

func (u *evaluasiKesehatanIbuUsecase) GetByIbuID(ibuID uint) ([]models.EvaluasiKesehatanIbu, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *evaluasiKesehatanIbuUsecase) Update(e *models.EvaluasiKesehatanIbu) error {
	return u.repo.Update(e)
}

func (u *evaluasiKesehatanIbuUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
