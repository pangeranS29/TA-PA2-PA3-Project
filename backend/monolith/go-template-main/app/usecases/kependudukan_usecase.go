package usecases

import (
	"errors"
	"log"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type KependudukanUsecase interface {
	Create(k *models.Kependudukan) (*models.Kependudukan, error)
	GetByID(id int32) (*models.Kependudukan, error)
	GetByNIK(nik string) (*models.Kependudukan, error)
	GetByKartuKeluargaID(kkID int32) ([]models.Kependudukan, error)
	GetAll() ([]models.Kependudukan, error)
	Update(k *models.Kependudukan) error
	Delete(id int32) error
}

type kependudukanUsecase struct {
	repo *repositories.KependudukanRepository
}

func NewKependudukanUsecase(repo *repositories.KependudukanRepository) KependudukanUsecase {
	return &kependudukanUsecase{repo: repo}
}

func (u *kependudukanUsecase) Create(k *models.Kependudukan) (*models.Kependudukan, error) {
	// Validasi KartuKeluargaID
	if k.KartuKeluargaID == 0 {
		return nil, errors.New("kartu_keluarga_id wajib diisi")
	}

	// Cek apakah KartuKeluargaID valid (ada di database)
	exists, err := u.repo.CheckKartuKeluargaExists(k.KartuKeluargaID)
	if err != nil {
		log.Println("Error checking KartuKeluarga:", err)
		return nil, err
	}
	if !exists {
		return nil, errors.New("kartu_keluarga_id tidak valid")
	}

	// Cek apakah NIK sudah ada
	existing, err := u.repo.FindByNIK(k.NIK)
	if err == nil && existing != nil {
		return nil, errors.New("NIK sudah terdaftar")
	}
	// Jika error bukan record not found, return error
	if err != nil && err.Error() != "record not found" {
		log.Println("Error checking NIK:", err)
		return nil, err
	}
	// Create
	err = u.repo.Create(k)
	if err != nil {
		log.Println("Error creating kependudukan:", err)
		return nil, err
	}
	return k, nil
}

func (u *kependudukanUsecase) GetByID(id int32) (*models.Kependudukan, error) {
	return u.repo.FindByID(id)
}

func (u *kependudukanUsecase) GetByNIK(nik string) (*models.Kependudukan, error) {
	return u.repo.FindByNIK(nik)
}

func (u *kependudukanUsecase) GetByKartuKeluargaID(kkID int32) ([]models.Kependudukan, error) {
	if kkID == 0 {
		return nil, errors.New("kartu_keluarga_id wajib diisi")
	}
	return u.repo.FindByKartuKeluargaID(kkID)
}

func (u *kependudukanUsecase) GetAll() ([]models.Kependudukan, error) {
	return u.repo.GetAll()
}

func (u *kependudukanUsecase) Update(k *models.Kependudukan) error {
	// Validasi KartuKeluargaID jika diubah
	if k.KartuKeluargaID != 0 {
		exists, err := u.repo.CheckKartuKeluargaExists(k.KartuKeluargaID)
		if err != nil {
			log.Println("Error checking KartuKeluarga:", err)
			return err
		}
		if !exists {
			return errors.New("kartu_keluarga_id tidak valid")
		}
	}

	_, err := u.repo.FindByID(k.IDKependudukan)
	if err != nil {
		return errors.New("data kependudukan tidak ditemukan")
	}
	return u.repo.Update(k)
}

func (u *kependudukanUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
