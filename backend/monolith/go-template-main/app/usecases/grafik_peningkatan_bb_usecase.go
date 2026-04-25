package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type GrafikPeningkatanBBUsecase interface {
	Create(g *models.GrafikPeningkatanBB) error
	GetByID(id int32) (*models.GrafikPeningkatanBB, error)
	GetByKehamilanID(kehamilanID int32) ([]models.GrafikPeningkatanBB, error)
	Update(g *models.GrafikPeningkatanBB) error
	Delete(id int32) error
}

type grafikPeningkatanBBUsecase struct {
	repo *repositories.GrafikPeningkatanBBRepository
}

func NewGrafikPeningkatanBBUsecase(repo *repositories.GrafikPeningkatanBBRepository) GrafikPeningkatanBBUsecase {
	return &grafikPeningkatanBBUsecase{repo: repo}
}

func (u *grafikPeningkatanBBUsecase) Create(g *models.GrafikPeningkatanBB) error {
	if g.KehamilanID == 0 {
		return errors.New("kehamilan_id wajib diisi")
	}
	return u.repo.Create(g)
}

func (u *grafikPeningkatanBBUsecase) GetByID(id int32) (*models.GrafikPeningkatanBB, error) {
	return u.repo.FindByID(id)
}

func (u *grafikPeningkatanBBUsecase) GetByKehamilanID(kehamilanID int32) ([]models.GrafikPeningkatanBB, error) {
	return u.repo.FindByKehamilanID(kehamilanID)
}

func (u *grafikPeningkatanBBUsecase) Update(g *models.GrafikPeningkatanBB) error {
	_, err := u.repo.FindByID(g.IDGrafikBB)
	if err != nil {
		return errors.New("data grafik peningkatan berat badan tidak ditemukan")
	}
	return u.repo.Update(g)
}

func (u *grafikPeningkatanBBUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
