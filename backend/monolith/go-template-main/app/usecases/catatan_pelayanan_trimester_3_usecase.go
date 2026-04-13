package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type CatatanPelayananTrimester3Usecase interface {
	Create(c *models.CatatanPelayananTrimester3) error
	GetByID(id uint) (*models.CatatanPelayananTrimester3, error)
	GetByIbuID(ibuID uint) ([]models.CatatanPelayananTrimester3, error)
	Update(c *models.CatatanPelayananTrimester3) error
	Delete(id uint) error
}

type catatanPelayananTrimester3Usecase struct {
	repo *repositories.CatatanPelayananTrimester3Repository
}

func NewCatatanPelayananTrimester3Usecase(repo *repositories.CatatanPelayananTrimester3Repository) CatatanPelayananTrimester3Usecase {
	return &catatanPelayananTrimester3Usecase{repo: repo}
}

func (u *catatanPelayananTrimester3Usecase) Create(c *models.CatatanPelayananTrimester3) error {
	return u.repo.Create(c)
}

func (u *catatanPelayananTrimester3Usecase) GetByID(id uint) (*models.CatatanPelayananTrimester3, error) {
	return u.repo.FindByID(id)
}

func (u *catatanPelayananTrimester3Usecase) GetByIbuID(ibuID uint) ([]models.CatatanPelayananTrimester3, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *catatanPelayananTrimester3Usecase) Update(c *models.CatatanPelayananTrimester3) error {
	return u.repo.Update(c)
}

func (u *catatanPelayananTrimester3Usecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
