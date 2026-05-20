package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PemeriksaanDewasaRepository interface {
	Create(data *models.PemeriksaanDewasa) error
	GetAll() ([]models.PemeriksaanDewasa, error)
	GetByID(id int32) (*models.PemeriksaanDewasa, error)
	Update(data *models.PemeriksaanDewasa) error
	Delete(id int32) error
}

type pemeriksaanDewasaRepository struct {
	db *gorm.DB
}

func NewPemeriksaanDewasaRepository(db *gorm.DB) PemeriksaanDewasaRepository {
	return &pemeriksaanDewasaRepository{
		db: db,
	}
}

func (r *pemeriksaanDewasaRepository) Create(data *models.PemeriksaanDewasa) error {
	return r.db.Create(data).Error
}

func (r *pemeriksaanDewasaRepository) GetAll() ([]models.PemeriksaanDewasa, error) {

	var data []models.PemeriksaanDewasa

	err := r.db.
		// Preload("Penduduk").
		// Preload("Pemeriksa").
		Find(&data).Error

	return data, err
}

func (r *pemeriksaanDewasaRepository) GetByID(id int32) (*models.PemeriksaanDewasa, error) {

	var data models.PemeriksaanDewasa

	err := r.db.
		// Preload("Penduduk").
		// Preload("Pemeriksa").
		First(&data, id).Error

	if err != nil {
		return nil, err
	}

	return &data, nil
}

func (r *pemeriksaanDewasaRepository) Update(data *models.PemeriksaanDewasa) error {
	return r.db.Save(data).Error
}

func (r *pemeriksaanDewasaRepository) Delete(id int32) error {
	return r.db.Delete(&models.PemeriksaanDewasa{}, id).Error
}