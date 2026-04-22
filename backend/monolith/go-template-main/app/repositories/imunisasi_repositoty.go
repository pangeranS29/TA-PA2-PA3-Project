package repositories

import (
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

type ImunisasiRepository interface {
	Create(imunisasi *models.JadwalImunisasi) error
	FindAllByAnakID(anakID int) ([]models.JadwalImunisasi, error)
	FindByID(id uint) (*models.JadwalImunisasi, error)
	Update(imunisasi *models.JadwalImunisasi) error
	Delete(id uint) error
}

type imunisasiRepository struct {
	db *gorm.DB
}

func NewImunisasiRepository(db *gorm.DB) ImunisasiRepository {
	return &imunisasiRepository{db}
}

func (r *imunisasiRepository) Create(imunisasi *models.JadwalImunisasi) error {
	return r.db.Create(imunisasi).Error
}

func (r *imunisasiRepository) FindAllByAnakID(anakID int) ([]models.JadwalImunisasi, error) {
	var jadwalImunisasis []models.JadwalImunisasi
	// Menggunakan Preload untuk mengambil data Master Vaksinnya juga
	err := r.db.Where("anak_id = ? AND is_deleted IS NULL", anakID).
		Preload("Imunisasi").
		Find(&jadwalImunisasis).Error
	return jadwalImunisasis, err
}

func (r *imunisasiRepository) FindByID(id uint) (*models.JadwalImunisasi, error) {
	var jadwalImunisasi models.JadwalImunisasi
	err := r.db.Where("id = ? AND is_deleted IS NULL", id).
		Preload("Imunisasi").
		Preload("Anak.Kependudukan"). // Mengambil data anak beserta data kependudukannya
		First(&jadwalImunisasi).Error
	return &jadwalImunisasi, err
}

func (r *imunisasiRepository) Update(imunisasi *models.JadwalImunisasi) error {
	return r.db.Save(imunisasi).Error
}

func (r *imunisasiRepository) Delete(id uint) error {
	// Karena di model Anda Isdeleted menggunakan time.Time, kita lakukan soft delete manual
	return r.db.Model(&models.JadwalImunisasi{}).Where("id = ?", id).Update("is_deleted", time.Now()).Error
}
