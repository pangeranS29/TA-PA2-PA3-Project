package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type RiwayatProsesMelahirkanUsecase interface {
	Create(rp *models.RiwayatProsesMelahirkan) error
	GetByID(id int32) (*models.RiwayatProsesMelahirkan, error)
	GetByKehamilanID(kehamilanID int32) ([]models.RiwayatProsesMelahirkan, error)
	Update(rp *models.RiwayatProsesMelahirkan) error
	Delete(id int32) error
}

type riwayatProsesMelahirkanUsecase struct {
	repo *repositories.RiwayatProsesMelahirkanRepository
}

func NewRiwayatProsesMelahirkanUsecase(repo *repositories.RiwayatProsesMelahirkanRepository) RiwayatProsesMelahirkanUsecase {
	return &riwayatProsesMelahirkanUsecase{repo: repo}
}

func (u *riwayatProsesMelahirkanUsecase) Create(rp *models.RiwayatProsesMelahirkan) error {
	if rp.KehamilanID == 0 {
		return errors.New("kehamilan_id wajib diisi")
	}
	return u.repo.Create(rp)
}

func (u *riwayatProsesMelahirkanUsecase) GetByID(id int32) (*models.RiwayatProsesMelahirkan, error) {
	return u.repo.FindByID(id)
}

func (u *riwayatProsesMelahirkanUsecase) GetByKehamilanID(kehamilanID int32) ([]models.RiwayatProsesMelahirkan, error) {
	return u.repo.FindByKehamilanID(kehamilanID)
}

func (u *riwayatProsesMelahirkanUsecase) Update(rp *models.RiwayatProsesMelahirkan) error {
	_, err := u.repo.FindByID(rp.IDRiwayatMelahirkan)
	if err != nil {
		return errors.New("data riwayat proses melahirkan tidak ditemukan")
	}
	return u.repo.Update(rp)
}

func (u *riwayatProsesMelahirkanUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
