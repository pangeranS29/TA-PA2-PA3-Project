package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type CatatanPelayananNifasUsecase interface {
	Create(c *models.CatatanPelayananNifas) error
	GetByID(id int32) (*models.CatatanPelayananNifas, error)
	GetByKehamilanID(kehamilanID int32) ([]models.CatatanPelayananNifas, error)
	Update(c *models.CatatanPelayananNifas) error
	Delete(id int32) error
}

type catatanPelayananNifasUsecase struct {
	repo *repositories.CatatanPelayananNifasRepository
}

func NewCatatanPelayananNifasUsecase(repo *repositories.CatatanPelayananNifasRepository) CatatanPelayananNifasUsecase {
	return &catatanPelayananNifasUsecase{repo: repo}
}

func (u *catatanPelayananNifasUsecase) Create(c *models.CatatanPelayananNifas) error {
	if c.KehamilanID == 0 {
		return errors.New("kehamilan_id wajib diisi")
	}
	return u.repo.Create(c)
}

func (u *catatanPelayananNifasUsecase) GetByID(id int32) (*models.CatatanPelayananNifas, error) {
	return u.repo.FindByID(id)
}

func (u *catatanPelayananNifasUsecase) GetByKehamilanID(kehamilanID int32) ([]models.CatatanPelayananNifas, error) {
	return u.repo.FindByKehamilanID(kehamilanID)
}

func (u *catatanPelayananNifasUsecase) Update(c *models.CatatanPelayananNifas) error {
	_, err := u.repo.FindByID(c.IDCatatanNifas)
	if err != nil {
		return errors.New("data catatan pelayanan nifas tidak ditemukan")
	}
	return u.repo.Update(c)
}

func (u *catatanPelayananNifasUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
