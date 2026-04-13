package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type GrafikPeningkatanBBUsecase interface {
	Create(g *models.GrafikPeningkatanBB) error
	GetByID(id uint) (*models.GrafikPeningkatanBB, error)
	GetByIbuID(ibuID uint) ([]models.GrafikPeningkatanBB, error)
	Update(g *models.GrafikPeningkatanBB) error
	Delete(id uint) error
}

type grafikPeningkatanBBUsecase struct {
	repo *repositories.GrafikPeningkatanBBRepository
}

func NewGrafikPeningkatanBBUsecase(repo *repositories.GrafikPeningkatanBBRepository) GrafikPeningkatanBBUsecase {
	return &grafikPeningkatanBBUsecase{repo: repo}
}

func (u *grafikPeningkatanBBUsecase) Create(g *models.GrafikPeningkatanBB) error {
	return u.repo.Create(g)
}

func (u *grafikPeningkatanBBUsecase) GetByID(id uint) (*models.GrafikPeningkatanBB, error) {
	return u.repo.FindByID(id)
}

func (u *grafikPeningkatanBBUsecase) GetByIbuID(ibuID uint) ([]models.GrafikPeningkatanBB, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *grafikPeningkatanBBUsecase) Update(g *models.GrafikPeningkatanBB) error {
	return u.repo.Update(g)
}

func (u *grafikPeningkatanBBUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
