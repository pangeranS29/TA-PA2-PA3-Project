package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type GrafikEvaluasiKehamilanUsecase interface {
	Create(g *models.GrafikEvaluasiKehamilan) error
	GetByID(id uint) (*models.GrafikEvaluasiKehamilan, error)
	GetByIbuID(ibuID uint) ([]models.GrafikEvaluasiKehamilan, error)
	Update(g *models.GrafikEvaluasiKehamilan) error
	Delete(id uint) error
}

type grafikEvaluasiKehamilanUsecase struct {
	repo *repositories.GrafikEvaluasiKehamilanRepository
}

func NewGrafikEvaluasiKehamilanUsecase(repo *repositories.GrafikEvaluasiKehamilanRepository) GrafikEvaluasiKehamilanUsecase {
	return &grafikEvaluasiKehamilanUsecase{repo: repo}
}

func (u *grafikEvaluasiKehamilanUsecase) Create(g *models.GrafikEvaluasiKehamilan) error {
	return u.repo.Create(g)
}

func (u *grafikEvaluasiKehamilanUsecase) GetByID(id uint) (*models.GrafikEvaluasiKehamilan, error) {
	return u.repo.FindByID(id)
}

func (u *grafikEvaluasiKehamilanUsecase) GetByIbuID(ibuID uint) ([]models.GrafikEvaluasiKehamilan, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *grafikEvaluasiKehamilanUsecase) Update(g *models.GrafikEvaluasiKehamilan) error {
	return u.repo.Update(g)
}

func (u *grafikEvaluasiKehamilanUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
