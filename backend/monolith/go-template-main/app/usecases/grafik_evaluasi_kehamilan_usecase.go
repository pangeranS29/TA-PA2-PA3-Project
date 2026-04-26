package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type GrafikEvaluasiKehamilanUsecase interface {
	Create(g *models.GrafikEvaluasiKehamilan) error
	GetByID(id int32) (*models.GrafikEvaluasiKehamilan, error)
	GetByKehamilanID(kehamilanID int32) ([]models.GrafikEvaluasiKehamilan, error)
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
	if g.KehamilanID == 0 {
		return errors.New("kehamilan_id wajib diisi")
	}
	return u.repo.Create(g)
}

func (u *grafikEvaluasiKehamilanUsecase) GetByID(id int32) (*models.GrafikEvaluasiKehamilan, error) {
	return u.repo.FindByID(id)
}

func (u *grafikEvaluasiKehamilanUsecase) GetByKehamilanID(kehamilanID int32) ([]models.GrafikEvaluasiKehamilan, error) {
	return u.repo.FindByKehamilanID(kehamilanID)
}

func (u *grafikEvaluasiKehamilanUsecase) Update(g *models.GrafikEvaluasiKehamilan) error {
	_, err := u.repo.FindByID(g.ID)
	if err != nil {
		return errors.New("data grafik evaluasi kehamilan tidak ditemukan")
	}
	return u.repo.Update(g)
}

func (u *grafikEvaluasiKehamilanUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
