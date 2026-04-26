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

func (r *KependudukanRepository) Create(k *models.Kependudukan) error {
	return r.db.Create(k).Error
}

func (r *KependudukanRepository) FindByID(id int32) (*models.Kependudukan, error) {
	var k models.Kependudukan
	err := r.db.Preload("KartuKeluarga").First(&k, id).Error
	return &k, err
}

func (r *KependudukanRepository) FindByNIK(nik string) (*models.Kependudukan, error) {
	var k models.Kependudukan
	err := r.db.Preload("KartuKeluarga").Where("nik = ?", nik).First(&k).Error
	return &k, err
}

func (r *KependudukanRepository) FindByKartuKeluargaID(kkID int32) ([]models.Kependudukan, error) {
	var list []models.Kependudukan
	err := r.db.Preload("KartuKeluarga").Where("kartu_keluarga_id = ?", kkID).Find(&list).Error
	return list, err
}

func (r *KependudukanRepository) GetAll() ([]models.Kependudukan, error) {
	var list []models.Kependudukan
	err := r.db.Preload("KartuKeluarga").Find(&list).Error
	return list, err
}

func (r *KependudukanRepository) Update(k *models.Kependudukan) error {
	return r.db.Save(k).Error
}

func (r *KependudukanRepository) Delete(id int32) error {
	result := r.db.Delete(&models.Kependudukan{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("data kependudukan tidak ditemukan")
	}
	return nil
}

func (r *KependudukanRepository) CheckKartuKeluargaExists(kkID int32) (bool, error) {
	var count int64
	err := r.db.Model(&models.KartuKeluarga{}).Where("id = ?", kkID).Count(&count).Error
	return count > 0, err
}
