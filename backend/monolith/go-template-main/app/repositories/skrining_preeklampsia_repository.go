package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type SkriningPreeklampsiaRepository struct {
	db *gorm.DB
}

func NewSkriningPreeklampsiaRepository(db *gorm.DB) *SkriningPreeklampsiaRepository {
	return &SkriningPreeklampsiaRepository{db: db}
}

func (r *SkriningPreeklampsiaRepository) Create(s *models.SkriningPreeklampsia) error {
	return r.db.Create(s).Error
}

func (r *SkriningPreeklampsiaRepository) FindByID(id int32) (*models.SkriningPreeklampsia, error) {
	var s models.SkriningPreeklampsia
	err := r.db.Preload("Kehamilan.Ibu.Kependudukan").First(&s, id).Error
	return &s, err
}

func (r *SkriningPreeklampsiaRepository) FindByKehamilanID(kehamilanID int32) ([]models.SkriningPreeklampsia, error) {
	var list []models.SkriningPreeklampsia
	err := r.db.Where("kehamilan_id = ?", kehamilanID).Find(&list).Error
	return list, err
}

func (r *SkriningPreeklampsiaRepository) Update(s *models.SkriningPreeklampsia) error {
	return r.db.Save(s).Error
}

func (r *SkriningPreeklampsiaRepository) Delete(id int32) error {
	result := r.db.Delete(&models.SkriningPreeklampsia{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("data skrining preeklampsia tidak ditemukan")
	}
	return nil
}
