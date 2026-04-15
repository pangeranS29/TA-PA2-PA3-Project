package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type CatatanPelayananTrimester1Usecase interface {
	Create(c *models.CatatanPelayananTrimester1) error
	GetByID(id int32) (*models.CatatanPelayananTrimester1, error)
	GetByIbuID(ibuID int32) ([]models.CatatanPelayananTrimester1, error)
	Update(c *models.CatatanPelayananTrimester1) error
	Delete(id int32) error
}

type catatanPelayananTrimester1Usecase struct {
	repo *repositories.CatatanPelayananTrimester1Repository
}

func NewCatatanPelayananTrimester1Usecase(repo *repositories.CatatanPelayananTrimester1Repository) CatatanPelayananTrimester1Usecase {
	return &catatanPelayananTrimester1Usecase{repo: repo}
}

func (u *catatanPelayananTrimester1Usecase) Create(c *models.CatatanPelayananTrimester1) error {
	return u.repo.Create(c)
}

func (u *catatanPelayananTrimester1Usecase) GetByID(id int32) (*models.CatatanPelayananTrimester1, error) {
	return u.repo.FindByID(id)
}

func (u *catatanPelayananTrimester1Usecase) GetByIbuID(ibuID int32) ([]models.CatatanPelayananTrimester1, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *catatanPelayananTrimester1Usecase) Update(c *models.CatatanPelayananTrimester1) error {
	return u.repo.Update(c)
}

func (u *catatanPelayananTrimester1Usecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
