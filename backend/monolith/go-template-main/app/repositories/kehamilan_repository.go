package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type KehamilanRepository struct {
	db *gorm.DB
}

func NewKehamilanRepository(db *gorm.DB) *KehamilanRepository {
	return &KehamilanRepository{db: db}
}

func (r *KehamilanRepository) Create(kehamilan *models.Kehamilan) error {
	return r.db.Create(kehamilan).Error
}

func (r *KehamilanRepository) FindByID(id int32) (*models.Kehamilan, error) {
	var kehamilan models.Kehamilan
	err := r.db.Preload("Ibu.Kependudukan").
	Preload("Anak").
	First(&kehamilan, id).Error
	
	if err != nil {
		return nil, err
	}

	return &kehamilan, nil
}

func (r *KehamilanRepository) FindByIbuID(ibuID int32) ([]models.Kehamilan, error) {
	var list []models.Kehamilan
	err := r.db.Where("ibu_id = ?", ibuID).Order("created_at DESC").Find(&list).Error
	return list, err
}

func (r *KehamilanRepository) GetAll() ([]models.Kehamilan, error) {
	var list []models.Kehamilan
	err := r.db.Preload("Ibu.Kependudukan").
	Preload("Anak"). 
	Find(&list).Error
	return list, err
}

func (r *KehamilanRepository) Update(kehamilan *models.Kehamilan) error {
	return r.db.Save(kehamilan).Error
}

func (r *KehamilanRepository) Delete(id int32) error {
	result := r.db.Delete(&models.Kehamilan{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("data kehamilan tidak ditemukan")
	}
	return nil
}
