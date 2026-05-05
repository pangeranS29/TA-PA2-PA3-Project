package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"

	"gorm.io/gorm"
)

type IbuUsecase interface {
	Create(ibu *models.Ibu) error
	GetByID(id int32) (*models.Ibu, error)
	GetAll() ([]models.Ibu, error)
	Update(ibu *models.Ibu) error
	Delete(id int32) error
}

type ibuUsecase struct {
	repo                  *repositories.IbuRepository
	kependudukanRepo      *repositories.KependudukanRepository
}

func NewIbuUsecase(repo *repositories.IbuRepository, kependudukanRepo *repositories.KependudukanRepository) IbuUsecase {
	return &ibuUsecase{repo: repo, kependudukanRepo: kependudukanRepo}
}

func (u *ibuUsecase) Create(ibu *models.Ibu) error {
	if ibu.PendudukID == 0 {
		return errors.New("id_kependudukan wajib diisi")
	}
	// Validasi apakah penduduk_id ada di tabel kependudukan
	_, err := u.kependudukanRepo.FindByID(ibu.PendudukID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("data penduduk dengan id tersebut tidak ditemukan")
		}
		return err
	}
	return u.repo.Create(ibu)
}

func (u *ibuUsecase) GetByID(id int32) (*models.Ibu, error) {
	return u.repo.FindByID(id)
}

func (u *ibuUsecase) GetAll() ([]models.Ibu, error) {
	return u.repo.FindAll()
}

func (u *ibuUsecase) Update(ibu *models.Ibu) error {
	_, err := u.repo.FindByID(ibu.IDIbu)
	if err != nil {
		return errors.New("data ibu tidak ditemukan")
	}
	return u.repo.Update(ibu)
}

func (u *ibuUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
