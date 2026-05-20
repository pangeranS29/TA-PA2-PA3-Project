package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PemeriksaanLansiaRepository interface {
	Create(data *models.PemeriksaanLansia) error
	GetAll() ([]models.PemeriksaanLansia, error)
	GetByID(id int32) (*models.PemeriksaanLansia, error)
	Update(data *models.PemeriksaanLansia) error
	Delete(id int32) error
}

type pemeriksaanLansiaRepository struct {
	db *gorm.DB
}

func NewPemeriksaanLansiaRepository(db *gorm.DB) PemeriksaanLansiaRepository {
	return &pemeriksaanLansiaRepository{
		db: db,
	}
}

func (r *pemeriksaanLansiaRepository) Create(data *models.PemeriksaanLansia) error {
	return r.db.Create(data).Error
}

func (r *pemeriksaanLansiaRepository) GetAll() ([]models.PemeriksaanLansia, error) {

	var data []models.PemeriksaanLansia

	err := r.db.
		Preload("Penduduk").
		Preload("Pemeriksa").
		Find(&data).Error

	return data, err
}

func (r *pemeriksaanLansiaRepository) GetByID(id int32) (*models.PemeriksaanLansia, error) {

	var data models.PemeriksaanLansia

	err := r.db.
		Preload("Penduduk").
		Preload("Pemeriksa").
		First(&data, id).Error

	if err != nil {
		return nil, err
	}

	return &data, nil
}

func (r *pemeriksaanLansiaRepository) Update(data *models.PemeriksaanLansia) error {
	return r.db.Save(data).Error
}

func (r *pemeriksaanLansiaRepository) Delete(id int32) error {
	return r.db.Delete(&models.PemeriksaanLansia{}, id).Error
}