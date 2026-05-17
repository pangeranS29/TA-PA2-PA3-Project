package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

// ─────────────────────────────────────────────────────────
// KATEGORI CAPAIAN REPOSITORY
// ─────────────────────────────────────────────────────────

type KategoriCapaianRepository interface {
	FindAll() ([]models.KategoriCapaian, error)
	FindByID(id uint) (*models.KategoriCapaian, error)
	FindByRentangUsia(rentang string) ([]models.KategoriCapaian, error)
	Create(data *models.KategoriCapaian) error
	Update(data *models.KategoriCapaian) error
	Delete(id uint) error
}

type kategoriCapaianRepository struct {
	db *gorm.DB
}

func NewKategoriCapaianRepository(db *gorm.DB) KategoriCapaianRepository {
	return &kategoriCapaianRepository{db}
}

func (r *kategoriCapaianRepository) FindAll() ([]models.KategoriCapaian, error) {
	var data []models.KategoriCapaian
	err := r.db.Order("rentang_usia, id").Find(&data).Error
	return data, err
}

func (r *kategoriCapaianRepository) FindByID(id uint) (*models.KategoriCapaian, error) {
	var data models.KategoriCapaian
	err := r.db.First(&data, id).Error
	if err != nil {
		return nil, err
	}
	return &data, nil
}

func (r *kategoriCapaianRepository) FindByRentangUsia(rentang string) ([]models.KategoriCapaian, error) {
	var data []models.KategoriCapaian
	err := r.db.Where("rentang_usia = ?", rentang).Order("id").Find(&data).Error
	return data, err
}

func (r *kategoriCapaianRepository) Create(data *models.KategoriCapaian) error {
	return r.db.Create(data).Error
}

func (r *kategoriCapaianRepository) Update(data *models.KategoriCapaian) error {
	return r.db.Save(data).Error
}

func (r *kategoriCapaianRepository) Delete(id uint) error {
	return r.db.Delete(&models.KategoriCapaian{}, id).Error
}

// ─────────────────────────────────────────────────────────
// PERAWATAN REPOSITORY
// ─────────────────────────────────────────────────────────

type PerawatanRepository interface {
	FindByAnakID(anakID int32) ([]models.Perawatan, error)
	FindByID(id uint) (*models.Perawatan, error)
	Create(data *models.Perawatan) error
	Update(data *models.Perawatan) error
	Delete(id uint) error
}

type perawatanRepository struct {
	db *gorm.DB
}

func NewPerawatanRepository(db *gorm.DB) PerawatanRepository {
	return &perawatanRepository{db}
}

func (r *perawatanRepository) FindByAnakID(anakID int32) ([]models.Perawatan, error) {
	var data []models.Perawatan
	err := r.db.
		Preload("KategoriCapaian").
		Where("anak_id = ?", anakID).
		Order("kategori_capaian_id").
		Find(&data).Error
	return data, err
}

func (r *perawatanRepository) FindByID(id uint) (*models.Perawatan, error) {
	var data models.Perawatan
	err := r.db.Preload("KategoriCapaian").First(&data, id).Error
	if err != nil {
		return nil, err
	}
	return &data, nil
}

func (r *perawatanRepository) Create(data *models.Perawatan) error {
	return r.db.Create(data).Error
}

func (r *perawatanRepository) Update(data *models.Perawatan) error {
	return r.db.Save(data).Error
}

func (r *perawatanRepository) Delete(id uint) error {
	return r.db.Delete(&models.Perawatan{}, id).Error
}
