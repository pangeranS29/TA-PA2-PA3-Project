package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type KeluhanAnakUseCase interface {
	Create(data *models.KeluhanAnak) error
	Update(id uint, data *models.KeluhanAnak) error
	Delete(id uint) error
	GetByAnakID(anakID uint) ([]models.KeluhanAnak, error)
	GetByID(id uint) (*models.KeluhanAnak, error)
}

type keluhanAnakUseCase struct {
	repo repositories.KeluhanAnakRepository
}

func NewKeluhanAnakUseCase(repo repositories.KeluhanAnakRepository) KeluhanAnakUseCase {
	return &keluhanAnakUseCase{repo}
}

func (u *keluhanAnakUseCase) Create(data *models.KeluhanAnak) error {
	return u.repo.Create(data)
}

func (u *keluhanAnakUseCase) Update(id uint, data *models.KeluhanAnak) error {
	existing, err := u.repo.FindByID(id)
	if err != nil {
		return err
	}
	existing.Tanggal = data.Tanggal
	existing.Keluhan = data.Keluhan
	existing.Tindakan = data.Tindakan
	existing.Pemeriksa = data.Pemeriksa
	return u.repo.Update(existing)
}

func (u *keluhanAnakUseCase) Delete(id uint) error {
	return u.repo.Delete(id)
}

func (u *keluhanAnakUseCase) GetByAnakID(anakID uint) ([]models.KeluhanAnak, error) {
	return u.repo.FindAllByAnakID(anakID)
}

func (u *keluhanAnakUseCase) GetByID(id uint) (*models.KeluhanAnak, error) {
	return u.repo.FindByID(id)
}
