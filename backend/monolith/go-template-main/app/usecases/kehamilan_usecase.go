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

// hitung IMT hanya jika BB_Awal dan TB diisi
func calculateIMT(bb, tb float64) float64 {
	if tb <= 0 {
		return 0
	}
	return bb / (tb * tb)
}

func (u *kehamilanUsecase) Create(kehamilan *models.Kehamilan) error {
	if kehamilan.IbuID == 0 {
		return errors.New("ibu_id wajib diisi")
	}
	// Hitung IMT jika BB_Awal dan TB diisi
	if kehamilan.BB_Awal > 0 && kehamilan.TB > 0 {
		kehamilan.IMT_Awal = calculateIMT(kehamilan.BB_Awal, kehamilan.TB)
	} else {
		kehamilan.IMT_Awal = 0
	}
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
	// Update field yang diisi (tidak nol/nil)
	if kehamilan.IbuID != 0 {
		existing.IbuID = kehamilan.IbuID
	}
	if kehamilan.Gravida != 0 {
		existing.Gravida = kehamilan.Gravida
	}
	if kehamilan.Paritas != 0 {
		existing.Paritas = kehamilan.Paritas
	}
	if kehamilan.Abortus != 0 {
		existing.Abortus = kehamilan.Abortus
	}
	if !kehamilan.HPHT.IsZero() {
		existing.HPHT = kehamilan.HPHT
	}
	if !kehamilan.TaksiranPersalinan.IsZero() {
		existing.TaksiranPersalinan = kehamilan.TaksiranPersalinan
	}
	if kehamilan.UKKehamilanSaatIni != 0 {
		existing.UKKehamilanSaatIni = kehamilan.UKKehamilanSaatIni
	}
	if kehamilan.JarakKehamilanSebelumnya != 0 {
		existing.JarakKehamilanSebelumnya = kehamilan.JarakKehamilanSebelumnya
	}
	if kehamilan.StatusKehamilan != "" {
		existing.StatusKehamilan = kehamilan.StatusKehamilan
	}
	if kehamilan.BB_Awal > 0 {
		existing.BB_Awal = kehamilan.BB_Awal
	}
	if kehamilan.TB > 0 {
		existing.TB = kehamilan.TB
	}
	// Rekalkulasi IMT jika BB_Awal atau TB berubah
	if kehamilan.BB_Awal > 0 || kehamilan.TB > 0 {
		existing.IMT_Awal = calculateIMT(existing.BB_Awal, existing.TB)
	}
	return u.repo.Update(existing)
}

func (u *kehamilanUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
