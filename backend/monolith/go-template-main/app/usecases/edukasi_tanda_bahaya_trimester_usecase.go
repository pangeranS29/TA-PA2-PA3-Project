package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type EdukasiTandaBahayaTrimesterUsecase interface {
	Create(data *models.EdukasiTandaBahayaTrimester) error
	GetAll() ([]models.EdukasiTandaBahayaTrimester, error)
	GetByID(id int32) (*models.EdukasiTandaBahayaTrimester, error)
	Update(id int32, data *models.EdukasiTandaBahayaTrimester) error
	Delete(id int32) error
}

type edukasiTandaBahayaTrimesterUsecase struct {
	repo repositories.EdukasiTandaBahayaTrimesterRepository
}

func NewEdukasiTandaBahayaTrimesterUsecase(repo repositories.EdukasiTandaBahayaTrimesterRepository) EdukasiTandaBahayaTrimesterUsecase {
	return &edukasiTandaBahayaTrimesterUsecase{repo}
}

func (u *edukasiTandaBahayaTrimesterUsecase) Create(data *models.EdukasiTandaBahayaTrimester) error {
	return u.repo.Create(data)
}

func (u *edukasiTandaBahayaTrimesterUsecase) GetAll() ([]models.EdukasiTandaBahayaTrimester, error) {
	return u.repo.FindAll()
}

func (u *edukasiTandaBahayaTrimesterUsecase) GetByID(id int32) (*models.EdukasiTandaBahayaTrimester, error) {
	return u.repo.FindByID(id)
}

func (u *edukasiTandaBahayaTrimesterUsecase) Update(id int32, data *models.EdukasiTandaBahayaTrimester) error {
	existing, err := u.repo.FindByID(id)
	if err != nil {
		return errors.New("data not found")
	}

	existing.Judul = data.Judul
	existing.GambarURL = data.GambarURL
	existing.Isi = data.Isi

	return u.repo.Update(existing)
}

func (u *edukasiTandaBahayaTrimesterUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
