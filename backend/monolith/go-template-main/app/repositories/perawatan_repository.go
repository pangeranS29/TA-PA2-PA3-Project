package repositories

import (
	"monitoring-service/app/models"
	"strconv"

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
	err := r.db.Preload("RentangUsia").Order("rentang_usia_id, id").Find(&data).Error
	if err == nil {
		for i := range data {
			if data[i].RentangUsia != nil {
				data[i].RentangUsiaStr = data[i].RentangUsia.NamaRentang
			}
		}
	}
	return data, err
}

func (r *kategoriCapaianRepository) FindByID(id uint) (*models.KategoriCapaian, error) {
	var data models.KategoriCapaian
	err := r.db.Preload("RentangUsia").First(&data, id).Error
	if err != nil {
		return nil, err
	}
	if data.RentangUsia != nil {
		data.RentangUsiaStr = data.RentangUsia.NamaRentang
	}
	return &data, nil
}

func (r *kategoriCapaianRepository) FindByRentangUsia(rentang string) ([]models.KategoriCapaian, error) {
	var data []models.KategoriCapaian
	query := r.db.
		Joins("JOIN rentang_usia ON rentang_usia.id = kategori_capaian.rentang_usia_id").
		Preload("RentangUsia").
		Order("kategori_capaian.id")

	if id, err := strconv.Atoi(rentang); err == nil {
		query = query.Where("rentang_usia.id = ? OR rentang_usia.nama_rentang = ? OR CAST(kategori_capaian.rentang_usia_id AS VARCHAR) = ?", id, rentang, rentang)
	} else {
		query = query.Where("rentang_usia.nama_rentang = ? OR CAST(kategori_capaian.rentang_usia_id AS VARCHAR) = ?", rentang, rentang)
	}

	err := query.Find(&data).Error
	if err == nil {
		for i := range data {
			if data[i].RentangUsia != nil {
				data[i].RentangUsiaStr = data[i].RentangUsia.NamaRentang
			}
		}
	}
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
