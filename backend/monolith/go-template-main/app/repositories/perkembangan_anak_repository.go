package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PerkembanganAnakRepository interface {
	GetRentangUsia() ([]models.RentangUsia, error)
	GetKategoriByRentangId(rentangID int64) ([]models.KategoriTandaSakit, error)
	CreateKategori(kategori *models.KategoriTandaSakit) error
	UpdateKategori(id int64, kategori *models.KategoriTandaSakit) error
	DeleteKategori(id int64) error
}

type perkembanganAnakRepository struct {
	db *gorm.DB
}

func NewPerkembanganAnakRepository(db *gorm.DB) PerkembanganAnakRepository {
	return &perkembanganAnakRepository{db: db}
}

func (r *perkembanganAnakRepository) GetRentangUsia() ([]models.RentangUsia, error) {
	var data []models.RentangUsia
	if err := r.db.Find(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}

func (r *perkembanganAnakRepository) GetKategoriByRentangId(rentangID int64) ([]models.KategoriTandaSakit, error) {
	var data []models.KategoriTandaSakit
	if err := r.db.Where("rentang_usia_id = ?", rentangID).Find(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}

func (r *perkembanganAnakRepository) CreateKategori(kategori *models.KategoriTandaSakit) error {
	return r.db.Create(kategori).Error
}

func (r *perkembanganAnakRepository) UpdateKategori(id int64, kategori *models.KategoriTandaSakit) error {
	return r.db.Model(&models.KategoriTandaSakit{}).Where("id = ?", id).Updates(kategori).Error
}

func (r *perkembanganAnakRepository) DeleteKategori(id int64) error {
	return r.db.Delete(&models.KategoriTandaSakit{}, id).Error
}
