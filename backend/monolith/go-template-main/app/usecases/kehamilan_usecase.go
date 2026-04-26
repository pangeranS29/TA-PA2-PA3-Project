package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type KehamilanUsecase interface {
	Create(kehamilan *models.Kehamilan) error
	GetByID(id int32) (*models.Kehamilan, error)
	// GetAktifByPhoneNumber(phoneNumber string) (*models.Kehamilan, error) // MODUL IBU
	GetAktifByUserID(userID int32) (*models.Kehamilan, error) // MODUL IBU
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

func (u *kehamilanUsecase) Create(kehamilan *models.Kehamilan) error {
	if kehamilan.IbuID == 0 {
		return errors.New("ibu_id wajib diisi")
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
	_, err := u.repo.FindByID(kehamilan.ID)
	if err != nil {
		return errors.New("data kehamilan tidak ditemukan")
	}
	return u.repo.Update(kehamilan)
}

func (u *kehamilanUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}

// MODUL IBU
// func (u *kehamilanUsecase) GetAktifByPhoneNumber(phoneNumber string) (*models.Kehamilan, error) {
// 	if phoneNumber == "" {
// 		return nil, errors.New("nomor telepon tidak ditemukan")
// 	}
// 	return u.repo.FindAktifByPhoneNumber(phoneNumber)
// }
func (u *kehamilanUsecase) GetAktifByUserID(userID int32) (*models.Kehamilan, error) {
	if userID == 0 {
		return nil, errors.New("user_id tidak valid")
	}
	return u.repo.FindAktifByUserID(userID)
}