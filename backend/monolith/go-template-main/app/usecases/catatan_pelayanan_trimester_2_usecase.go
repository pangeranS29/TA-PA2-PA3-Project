package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type CatatanPelayananTrimester2Usecase interface {
	Create(c *models.CatatanPelayananTrimester2) error
	GetByID(id int32) (*models.CatatanPelayananTrimester2, error)
	GetByIbuID(ibuID int32) ([]models.CatatanPelayananTrimester2, error)
	Update(c *models.CatatanPelayananTrimester2) error
	Delete(id int32) error
}

type catatanPelayananTrimester2Usecase struct {
	repo *repositories.CatatanPelayananTrimester2Repository
}

func NewCatatanPelayananTrimester2Usecase(repo *repositories.CatatanPelayananTrimester2Repository) CatatanPelayananTrimester2Usecase {
	return &catatanPelayananTrimester2Usecase{repo: repo}
}

func (u *catatanPelayananTrimester2Usecase) Create(c *models.CatatanPelayananTrimester2) error {
	return u.repo.Create(c)
}

func (u *catatanPelayananTrimester2Usecase) GetByID(id int32) (*models.CatatanPelayananTrimester2, error) {
	return u.repo.FindByID(id)
}

func (u *catatanPelayananTrimester2Usecase) GetByIbuID(ibuID int32) ([]models.CatatanPelayananTrimester2, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *catatanPelayananTrimester2Usecase) Update(c *models.CatatanPelayananTrimester2) error {
	return u.repo.Update(c)
}

func (u *catatanPelayananTrimester2Usecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
