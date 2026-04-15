package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type GrafikEvaluasiKehamilanUsecase interface {
	Create(g *models.GrafikEvaluasiKehamilan) error
	GetByID(id int32) (*models.GrafikEvaluasiKehamilan, error)
	GetByIbuID(ibuID int32) ([]models.GrafikEvaluasiKehamilan, error)
	Update(g *models.GrafikEvaluasiKehamilan) error
	Delete(id int32) error
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

func (u *grafikEvaluasiKehamilanUsecase) GetByID(id int32) (*models.GrafikEvaluasiKehamilan, error) {
	return u.repo.FindByID(id)
}

func (u *grafikEvaluasiKehamilanUsecase) GetByIbuID(ibuID int32) ([]models.GrafikEvaluasiKehamilan, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *grafikEvaluasiKehamilanUsecase) Update(g *models.GrafikEvaluasiKehamilan) error {
	return u.repo.Update(g)
}

func (u *grafikEvaluasiKehamilanUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
