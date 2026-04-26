package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type IbuRepository struct {
	db *gorm.DB
}

func NewIbuRepository(db *gorm.DB) *IbuRepository {
	return &IbuRepository{db: db}
}

func (r *IbuRepository) Create(ibu *models.Ibu) error {
	return r.db.Create(ibu).Error
}

func (r *IbuRepository) FindByID(id int32) (*models.Ibu, error) {
	var ibu models.Ibu
	err := r.db.Preload("Kependudukan").First(&ibu, id).Error
	return &ibu, err
}

func (r *IbuRepository) FindAll() ([]models.Ibu, error) {
	var list []models.Ibu
	err := r.db.Preload("Kependudukan").Find(&list).Error
	return list, err
}

func (r *IbuRepository) Update(ibu *models.Ibu) error {
	return r.db.Save(ibu).Error
}

func (r *IbuRepository) Delete(id int32) error {
	result := r.db.Delete(&models.Ibu{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("data ibu tidak ditemukan")
	}
	return nil
}

// FindByUserID mencari data ibu berdasarkan ID user (pengguna)
// Relasi: ibu -> penduduk (id) -> kebabura (no_kk) -> user (id_user)
func (r *IbuRepository) FindByUserID(userID int32) (*models.Ibu, error) {
	var ibu models.Ibu

	err := r.db.Joins("JOIN penduduk ON penduduk.id = ibu.penduduk_id").
		Joins("JOIN kebabura ON kebabura.no_kk = penduduk.no_kk AND kebabura.id_user = ?", userID).
		First(&ibu).Error

	if err != nil {
		return nil, err
	}
	return &ibu, nil
}
