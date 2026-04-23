package usecases

// import (
// 	"errors"
// 	"log"
// 	"monitoring-service/app/models"
// 	"monitoring-service/app/repositories"
// )

// type KependudukanUsecase interface {
// 	Create(k *models.Penduduk) (*models.Penduduk, error)
// 	GetByID(id int32) (*models.Penduduk, error)
// 	GetByNIK(nik string) (*models.Penduduk, error)
// 	GetAll() ([]models.Penduduk, error)
// 	Update(k *models.Penduduk) error
// 	Delete(id int32) error
// }

// type kependudukanUsecase struct {
// 	repo *repositories.KependudukanRepository
// }

// func NewKependudukanUsecase(repo *repositories.KependudukanRepository) KependudukanUsecase {
// 	return &kependudukanUsecase{repo: repo}
// }

// func (u *kependudukanUsecase) Create(k *models.Penduduk) (*models.Penduduk, error) {
// 	// Cek apakah NIK sudah ada
// 	existing, err := u.repo.FindByNIK(k.NIK)
// 	if err == nil && existing != nil {
// 		return nil, errors.New("NIK sudah terdaftar")
// 	}
// 	// Jika error bukan record not found, return error
// 	if err != nil && err.Error() != "record not found" {
// 		log.Println("Error checking NIK:", err)
// 		return nil, err
// 	}
// 	// Create
// 	err = u.repo.Create(k)
// 	if err != nil {
// 		log.Println("Error creating kependudukan:", err)
// 		return nil, err
// 	}
// 	return k, nil
// }

// func (u *kependudukanUsecase) GetByID(id int32) (*models.Penduduk, error) {
// 	return u.repo.FindByID(id)
// }

// func (u *kependudukanUsecase) GetByNIK(nik string) (*models.Penduduk, error) {
// 	return u.repo.FindByNIK(nik)
// }

// func (u *kependudukanUsecase) GetAll() ([]models.Penduduk, error) {
// 	return u.repo.GetAll()
// }

// func (u *kependudukanUsecase) Update(k *models.Penduduk) error {
// 	_, err := u.repo.FindByID(int32(*k.KartuKeluargaID))
// 	if err != nil {
// 		return errors.New("data kependudukan tidak ditemukan")
// 	}
// 	return u.repo.Update(k)
// }

// func (u *kependudukanUsecase) Delete(id int32) error {
// 	return u.repo.Delete(id)
// }
