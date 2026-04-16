package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type KehamilanUsecase interface {
	// Create(ibu *models.Kehamilan) error
	// GetByID(id int32) (*models.Kehamilan, error)
	// GetAll() ([]models.Kehamilan, error)
	// Update(ibu *models.Kehamilan) error
	// Delete(id int32) error
	GetActiveKehamilan() ([]models.Kehamilan, error)
}
type kehamilanUsecase struct {
	repo *repositories.KehamilanRepository
}


func NewKehamilanUsecase(repo *repositories.KehamilanRepository) KehamilanUsecase {
	return &kehamilanUsecase{repo: repo}
}

func (u *kehamilanUsecase) GetActiveKehamilan() ([]models.Kehamilan, error) {
	return u.repo.FindActiveHPHT()
}