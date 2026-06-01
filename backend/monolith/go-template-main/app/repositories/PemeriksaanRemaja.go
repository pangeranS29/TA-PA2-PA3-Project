package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PemeriksaanRemajaRepository interface {
	Create(data *models.PemeriksaanRemaja) error
	GetAll() ([]models.PemeriksaanRemaja, error)
	GetByID(id int32) (*models.PemeriksaanRemaja, error)
	Update(data *models.PemeriksaanRemaja) error
	Delete(id int32) error
}

type pemeriksaanRemajaRepository struct {
	db *gorm.DB
}

func NewPemeriksaanRemajaRepository(db *gorm.DB) PemeriksaanRemajaRepository {
	return &pemeriksaanRemajaRepository{db: db}
}

func (r *pemeriksaanRemajaRepository) Create(data *models.PemeriksaanRemaja) error {
	return r.db.Create(data).Error
}

func (r *pemeriksaanRemajaRepository) GetAll() ([]models.PemeriksaanRemaja, error) {
	var data []models.PemeriksaanRemaja

	err := r.db.
		Preload("Penduduk").
		Preload("Pemeriksa").
		Find(&data).Error

	return data, err
}

func (r *pemeriksaanRemajaRepository) GetByID(id int32) (*models.PemeriksaanRemaja, error) {
	var data models.PemeriksaanRemaja

	err := r.db.
		Preload("Penduduk").
		Preload("Pemeriksa").
		First(&data, id).Error

	if err != nil {
		return nil, err
	}

	return &data, nil
}

func (r *pemeriksaanRemajaRepository) Update(data *models.PemeriksaanRemaja) error {
	return r.db.Save(data).Error
}

func (r *pemeriksaanRemajaRepository) Delete(id int32) error {
	return r.db.Delete(&models.PemeriksaanRemaja{}, id).Error
}