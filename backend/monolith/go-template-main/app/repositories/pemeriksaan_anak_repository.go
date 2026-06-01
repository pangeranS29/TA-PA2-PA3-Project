package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PemeriksaanAnakRepository interface {
	Create(data *models.PemeriksaanAnak) error
	GetAll() ([]models.PemeriksaanAnak, error)
	GetByID(id int32) (*models.PemeriksaanAnak, error)
	Update(data *models.PemeriksaanAnak) error
	Delete(id int32) error
}

type pemeriksaanAnakRepository struct {
	db *gorm.DB
}

func NewPemeriksaanAnakRepository(db *gorm.DB) PemeriksaanAnakRepository {
	return &pemeriksaanAnakRepository{
		db: db,
	}
}

func (r *pemeriksaanAnakRepository) Create(data *models.PemeriksaanAnak) error {
	return r.db.Create(data).Error
}

func (r *pemeriksaanAnakRepository) GetAll() ([]models.PemeriksaanAnak, error) {

	var data []models.PemeriksaanAnak

	err := r.db.
		Preload("Penduduk").
		Preload("Pemeriksa").
		Find(&data).Error

	return data, err
}

func (r *pemeriksaanAnakRepository) GetByID(id int32) (*models.PemeriksaanAnak, error) {

	var data models.PemeriksaanAnak

	err := r.db.
		Preload("Penduduk").
		Preload("Pemeriksa").
		First(&data, id).Error

	if err != nil {
		return nil, err
	}

	return &data, nil
}

func (r *pemeriksaanAnakRepository) Update(data *models.PemeriksaanAnak) error {
	return r.db.Save(data).Error
}

func (r *pemeriksaanAnakRepository) Delete(id int32) error {
	return r.db.Delete(&models.PemeriksaanAnak{}, id).Error
}