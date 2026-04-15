package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type PemeriksaanLaboratoriumJiwaUsecase interface {
	Create(p *models.PemeriksaanLaboratoriumJiwa) error
	GetByID(id int32) (*models.PemeriksaanLaboratoriumJiwa, error)
	GetByIbuID(ibuID int32) ([]models.PemeriksaanLaboratoriumJiwa, error)
	Update(p *models.PemeriksaanLaboratoriumJiwa) error
	Delete(id int32) error
}

type pemeriksaanLaboratoriumJiwaUsecase struct {
	repo *repositories.PemeriksaanLaboratoriumJiwaRepository
}

func NewPemeriksaanLaboratoriumJiwaUsecase(repo *repositories.PemeriksaanLaboratoriumJiwaRepository) PemeriksaanLaboratoriumJiwaUsecase {
	return &pemeriksaanLaboratoriumJiwaUsecase{repo: repo}
}

func (u *pemeriksaanLaboratoriumJiwaUsecase) Create(p *models.PemeriksaanLaboratoriumJiwa) error {
	return u.repo.Create(p)
}

func (u *pemeriksaanLaboratoriumJiwaUsecase) GetByID(id int32) (*models.PemeriksaanLaboratoriumJiwa, error) {
	return u.repo.FindByID(id)
}

func (u *pemeriksaanLaboratoriumJiwaUsecase) GetByIbuID(ibuID int32) ([]models.PemeriksaanLaboratoriumJiwa, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *pemeriksaanLaboratoriumJiwaUsecase) Update(p *models.PemeriksaanLaboratoriumJiwa) error {
	return u.repo.Update(p)
}

func (u *pemeriksaanLaboratoriumJiwaUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
