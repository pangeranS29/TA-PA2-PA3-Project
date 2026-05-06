package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type EvaluasiKesehatanIbuRepository struct {
	db *gorm.DB
}

func NewEvaluasiKesehatanIbuRepository(db *gorm.DB) *EvaluasiKesehatanIbuRepository {
	return &EvaluasiKesehatanIbuRepository{db: db}
}

func (r *EvaluasiKesehatanIbuRepository) Create(e *models.EvaluasiKesehatanIbu) error {
	return r.db.Create(e).Error
}

func (r *EvaluasiKesehatanIbuRepository) FindByID(id int32) (*models.EvaluasiKesehatanIbu, error) {
	var e models.EvaluasiKesehatanIbu
	err := r.db.Preload("Kehamilan.Ibu.Kependudukan").First(&e, id).Error
	return &e, err
}

func (r *EvaluasiKesehatanIbuRepository) FindByKehamilanID(kehamilanID int32) ([]models.EvaluasiKesehatanIbu, error) {
	var list []models.EvaluasiKesehatanIbu
	err := r.db.Where("kehamilan_id = ?", kehamilanID).Find(&list).Error
	return list, err
}

func (r *EvaluasiKesehatanIbuRepository) Update(e *models.EvaluasiKesehatanIbu) error {
	return r.db.Save(e).Error
}

func (r *EvaluasiKesehatanIbuRepository) Delete(id int32) error {
	result := r.db.Delete(&models.EvaluasiKesehatanIbu{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("data evaluasi kesehatan ibu tidak ditemukan")
	}
	return nil
}
