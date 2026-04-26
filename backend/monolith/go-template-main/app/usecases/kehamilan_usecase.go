package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type KehamilanUsecase interface {
	Create(kehamilan *models.Kehamilan) error
	GetByID(id int32) (*models.Kehamilan, error)
	GetByIbuID(ibuID int32) ([]models.Kehamilan, error)
	GetAll() ([]models.Kehamilan, error)
	Update(kehamilan *models.Kehamilan) error
	Delete(id int32) error
}

type kehamilanUsecase struct {
	repo *repositories.KehamilanRepository
}

func NewKehamilanUsecase(repo *repositories.KehamilanRepository) KehamilanUsecase {
	return &kehamilanUsecase{repo: repo}
}

func calculateIMT(bb, tb float64) (float64, error) {
	if tb <= 0 {
		return 0, errors.New("tb tidak boleh 0")
	}
	return bb / (tb * tb), nil
}

func (u *kehamilanUsecase) Create(kehamilan *models.Kehamilan) error {
	if kehamilan.IbuID == 0 {
		return errors.New("ibu_id wajib diisi")
	}
	if kehamilan.BB_Awal <= 0 {
		return errors.New("bb_awal tidak valid")
	}

	imt, err := calculateIMT(kehamilan.BB_Awal, kehamilan.TB)
	if err != nil {
		return err
	}

	kehamilan.IMT_Awal = imt
	return u.repo.Create(kehamilan)
}

func (u *kehamilanUsecase) GetByID(id int32) (*models.Kehamilan, error) {
	return u.repo.FindByID(id)
}

func (u *kehamilanUsecase) GetByIbuID(ibuID int32) ([]models.Kehamilan, error) {
	return u.repo.FindByIbuID(ibuID)
}

func (u *kehamilanUsecase) GetAll() ([]models.Kehamilan, error) {
	return u.repo.GetAll()
}

func (u *kehamilanUsecase) Update(kehamilan *models.Kehamilan) error {
	existing, err := u.repo.FindByID(kehamilan.ID)
	if err != nil {
		return errors.New("data kehamilan tidak ditemukan")
	}

	// UPDATE FIELD NON-IMT
	existing.Gravida = kehamilan.Gravida
	existing.Paritas = kehamilan.Paritas
	existing.Abortus = kehamilan.Abortus
	existing.HPHT = kehamilan.HPHT
	existing.TaksiranPersalinan = kehamilan.TaksiranPersalinan
	existing.UKKehamilanSaatIni = kehamilan.UKKehamilanSaatIni
	existing.JarakKehamilanSebelumnya = kehamilan.JarakKehamilanSebelumnya
	existing.StatusKehamilan = kehamilan.StatusKehamilan

	// UPDATE BB & TB
	if kehamilan.BB_Awal > 0 {
		existing.BB_Awal = kehamilan.BB_Awal
	}
	if kehamilan.TB > 0 {
		existing.TB = kehamilan.TB
	}

	// RECALCULATE IMT
	imt, err := calculateIMT(existing.BB_Awal, existing.TB)
	if err != nil {
		return err
	}

	existing.IMT_Awal = imt

	return u.repo.Update(existing)
}

func (u *kehamilanUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
