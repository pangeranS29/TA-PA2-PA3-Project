package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type KartuKeluargaRepository struct {
	db *gorm.DB
}

func NewKartuKeluargaRepository(db *gorm.DB) *KartuKeluargaRepository {
	return &KartuKeluargaRepository{db: db}
}

func (r *KartuKeluargaRepository) Create(kk *models.KartuKeluarga) error {
	return r.db.Create(kk).Error
}

func (r *KartuKeluargaRepository) FindByID(id int32) (*models.KartuKeluarga, error) {
	var kk models.KartuKeluarga
	err := r.db.Preload("Kependudukan").First(&kk, id).Error
	return &kk, err
}

func (r *KartuKeluargaRepository) FindByNoKartuKeluarga(noKK string) (*models.KartuKeluarga, error) {
	var kk models.KartuKeluarga
	err := r.db.Preload("Kependudukan").Where("no_kartu_keluarga = ?", noKK).First(&kk).Error
	return &kk, err
}

func (r *KartuKeluargaRepository) GetAll() ([]models.KartuKeluarga, error) {
	var list []models.KartuKeluarga
	err := r.db.Preload("Kependudukan").Find(&list).Error
	return list, err
}

func (r *KartuKeluargaRepository) Update(kk *models.KartuKeluarga) error {
	return r.db.Save(kk).Error
}

func (r *KartuKeluargaRepository) Delete(id int32) error {
	result := r.db.Delete(&models.KartuKeluarga{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("kartu keluarga tidak ditemukan")
	}
	return nil
}

func (r *KartuKeluargaRepository) GetByNoKartuKeluargaWithMembers(noKK string) (*models.KartuKeluarga, error) {
	var kk models.KartuKeluarga
	err := r.db.Preload("Kependudukan").Where("no_kartu_keluarga = ?", noKK).First(&kk).Error
	return &kk, err
}
