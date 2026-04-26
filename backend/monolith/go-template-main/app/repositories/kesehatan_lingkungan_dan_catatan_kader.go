package repositories

import (
	"errors"
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

type KesehatanLingkunganDanCatatanKaderRepository struct {
	db *gorm.DB
}

func NewKesehatanLingkunganDanCatatanKaderRepository(db *gorm.DB) *KesehatanLingkunganDanCatatanKaderRepository {
	return &KesehatanLingkunganDanCatatanKaderRepository{db: db}
}

func (r *KesehatanLingkunganDanCatatanKaderRepository) Create(data *models.KesehatanLingkunganDanCatatanKader) error {
	return r.db.Create(data).Error
}

func (r *KesehatanLingkunganDanCatatanKaderRepository) GetAll() ([]models.KesehatanLingkunganDanCatatanKader, error) {
	var list []models.KesehatanLingkunganDanCatatanKader
	err := r.db.Order("created_at desc").Find(&list).Error
	return list, err
}

func (r *KesehatanLingkunganDanCatatanKaderRepository) GetAllByIbuID(ibuID int32) ([]models.KesehatanLingkunganDanCatatanKader, error) {
	var list []models.KesehatanLingkunganDanCatatanKader
	err := r.db.Where("ibu_id = ?", ibuID).Order("created_at desc").Find(&list).Error
	return list, err
}

func (r *KesehatanLingkunganDanCatatanKaderRepository) GetByID(id uint) (*models.KesehatanLingkunganDanCatatanKader, error) {
	var item models.KesehatanLingkunganDanCatatanKader
	err := r.db.First(&item, id).Error
	if err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *KesehatanLingkunganDanCatatanKaderRepository) CreateCatatan(catatan *models.CatatanKaderKesehatanLingkungan) error {
	return r.db.Create(catatan).Error
}

func (r *KesehatanLingkunganDanCatatanKaderRepository) GetCatatanByKesehatanID(kesehatanID uint) ([]models.CatatanKaderKesehatanLingkungan, error) {
	var list []models.CatatanKaderKesehatanLingkungan
	err := r.db.Where("kesehatan_lingkungan_id = ?", kesehatanID).Order("created_at desc").Find(&list).Error
	return list, err
}

func (r *KesehatanLingkunganDanCatatanKaderRepository) EnsureKesehatanExists(id uint) error {
	var count int64
	if err := r.db.Model(&models.KesehatanLingkunganDanCatatanKader{}).Where("id = ?", id).Count(&count).Error; err != nil {
		return err
	}
	if count == 0 {
		return errors.New("data kesehatan lingkungan tidak ditemukan")
	}
	return nil
}

func (r *KesehatanLingkunganDanCatatanKaderRepository) UpdateCatatan(kesehatanID uint, catatanID uint, catatanText string) (*models.CatatanKaderKesehatanLingkungan, error) {
	var catatan models.CatatanKaderKesehatanLingkungan
	err := r.db.Where("id = ? AND kesehatan_lingkungan_id = ?", catatanID, kesehatanID).First(&catatan).Error
	if err != nil {
		return nil, err
	}
	catatan.Catatan = catatanText
	if err := r.db.Save(&catatan).Error; err != nil {
		return nil, err
	}
	return &catatan, nil
}

func (r *KesehatanLingkunganDanCatatanKaderRepository) DeleteCatatan(kesehatanID uint, catatanID uint) error {
	result := r.db.Where("id = ? AND kesehatan_lingkungan_id = ?", catatanID, kesehatanID).Delete(&models.CatatanKaderKesehatanLingkungan{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("catatan tidak ditemukan")
	}
	return nil
}

func (r *KesehatanLingkunganDanCatatanKaderRepository) MarkCatatanSentToMobile(kesehatanID uint, catatanID uint) (*models.CatatanKaderKesehatanLingkungan, error) {
	var catatan models.CatatanKaderKesehatanLingkungan
	err := r.db.Where("id = ? AND kesehatan_lingkungan_id = ?", catatanID, kesehatanID).First(&catatan).Error
	if err != nil {
		return nil, err
	}

	now := time.Now()
	catatan.IsSentToMobile = true
	catatan.SentToMobileAt = &now

	if err := r.db.Save(&catatan).Error; err != nil {
		return nil, err
	}

	return &catatan, nil
}

func (r *KesehatanLingkunganDanCatatanKaderRepository) Update(id uint, req *models.CreateKesehatanLingkunganDanCatatanKaderRequest) (*models.KesehatanLingkunganDanCatatanKader, error) {
	var item models.KesehatanLingkunganDanCatatanKader
	if err := r.db.First(&item, id).Error; err != nil {
		return nil, err
	}

	item.Sanitasi = req.Sanitasi
	item.CuciTangan = req.CuciTangan
	item.AirMakanan = req.AirMakanan
	item.Sampah = req.Sampah
	item.Limbah = req.Limbah

	if err := r.db.Save(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}
