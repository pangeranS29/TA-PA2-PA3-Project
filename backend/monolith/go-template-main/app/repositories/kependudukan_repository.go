package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type KependudukanRepository struct {
	db *gorm.DB
}

func NewKependudukanRepository(db *gorm.DB) *KependudukanRepository {
	return &KependudukanRepository{db: db}
}

func (r *KependudukanRepository) Create(k *models.Penduduk) error {
	return r.db.Create(k).Error
}

func (r *KependudukanRepository) FindByID(id int32) (*models.Penduduk, error) {
	var k models.Penduduk
	err := r.db.First(&k, id).Error
	return &k, err
}

func (r *KependudukanRepository) FindByNIK(nik string) (*models.Penduduk, error) {
	var k models.Penduduk
	err := r.db.Where("nik = ?", nik).First(&k).Error
	return &k, err
}

func (r *KependudukanRepository) GetAll() ([]models.Penduduk, error) {
	var list []models.Penduduk
	err := r.db.Find(&list).Error
	return list, err
}

func (r *KependudukanRepository) Update(k *models.Penduduk) error {
	return r.db.Save(k).Error
}

func (r *KependudukanRepository) Delete(id int32) error {
	result := r.db.Delete(&models.Penduduk{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("data kependudukan tidak ditemukan")
	}
	return nil
}
