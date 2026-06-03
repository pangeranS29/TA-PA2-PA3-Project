package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type BblUsecase interface {
	GetByAnakID(anakID int32) (*models.Bbl, error)
	Upsert(bbl *models.Bbl) error
}

type bblUsecase struct {
	bblRepo repositories.BblRepository
}

func NewBblUsecase(bblRepo repositories.BblRepository) BblUsecase {
	return &bblUsecase{
		bblRepo: bblRepo,
	}
}

func (u *bblUsecase) GetByAnakID(anakID int32) (*models.Bbl, error) {
	return u.bblRepo.GetByAnakID(anakID)
}

func (u *bblUsecase) Upsert(bbl *models.Bbl) error {
	return u.bblRepo.Upsert(bbl)
}
