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

// CREATE
func (r *IbuRepository) Create(ibu *models.Ibu) error {
	return r.db.Create(ibu).Error
}

// FIND BY ID
func (r *IbuRepository) FindByID(id int32) (*models.Ibu, error) {
	var ibu models.Ibu

	err := r.db.
		Preload("Penduduk").
		First(&ibu, id).Error

	if err != nil {
		return nil, err
	}

	return &ibu, nil
}

// FIND ALL
func (r *IbuRepository) FindAll() ([]models.Ibu, error) {
	var list []models.Ibu

	err := r.db.
		Preload("Penduduk").
		Find(&list).Error

	return list, err
}

// UPDATE
func (r *IbuRepository) Update(ibu *models.Ibu) error {
	return r.db.Save(ibu).Error
}

// DELETE
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