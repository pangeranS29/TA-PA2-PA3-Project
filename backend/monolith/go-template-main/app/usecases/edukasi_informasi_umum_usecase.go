package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type EdukasiInformasiUmumUsecase interface {
	Create(data *models.EdukasiInformasiUmum) error
	GetAll() ([]models.EdukasiInformasiUmum, error)
	GetByID(id int32) (*models.EdukasiInformasiUmum, error)
	Update(id int32, data *models.EdukasiInformasiUmum) error
	Delete(id int32) error
}

type edukasiInformasiUmumUsecase struct {
	repo repositories.EdukasiInformasiUmumRepository
}

func NewEdukasiInformasiUmumUsecase(repo repositories.EdukasiInformasiUmumRepository) EdukasiInformasiUmumUsecase {
	return &edukasiInformasiUmumUsecase{repo}
}

func (u *edukasiInformasiUmumUsecase) Create(data *models.EdukasiInformasiUmum) error {
	return u.repo.Create(data)
}

func (u *edukasiInformasiUmumUsecase) GetAll() ([]models.EdukasiInformasiUmum, error) {
	return u.repo.FindAll()
}

func (u *edukasiInformasiUmumUsecase) GetByID(id int32) (*models.EdukasiInformasiUmum, error) {
	return u.repo.FindByID(id)
}

func (u *edukasiInformasiUmumUsecase) Update(id int32, data *models.EdukasiInformasiUmum) error {
	existing, err := u.repo.FindByID(id)
	if err != nil {
		return errors.New("data not found")
	}

	existing.Judul = data.Judul
	existing.GambarURL = data.GambarURL
	existing.Deskripsi = data.Deskripsi
	existing.IsiKonten = data.IsiKonten
	existing.MateriInti = data.MateriInti
	existing.HalPenting = data.HalPenting

	return u.repo.Update(existing)
}

func (u *edukasiInformasiUmumUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
