package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type GrafikEvaluasiKehamilanRepository struct {
	db *gorm.DB
}

func NewGrafikEvaluasiKehamilanRepository(db *gorm.DB) *GrafikEvaluasiKehamilanRepository {
	return &GrafikEvaluasiKehamilanRepository{db: db}
}

func (r *GrafikEvaluasiKehamilanRepository) Create(g *models.GrafikEvaluasiKehamilan) error {
	return r.db.Create(g).Error
}

func (r *GrafikEvaluasiKehamilanRepository) FindByID(id int32) (*models.GrafikEvaluasiKehamilan, error) {
	var g models.GrafikEvaluasiKehamilan
	err := r.db.Preload("Kehamilan.Ibu.Kependudukan").First(&g, id).Error
	return &g, err
}

func (r *GrafikEvaluasiKehamilanRepository) FindByKehamilanID(kehamilanID int32) ([]models.GrafikEvaluasiKehamilan, error) {
	var list []models.GrafikEvaluasiKehamilan
	err := r.db.Where("kehamilan_id = ?", kehamilanID).Find(&list).Error
	return list, err
}

func (r *GrafikEvaluasiKehamilanRepository) Update(g *models.GrafikEvaluasiKehamilan) error {
	return r.db.Save(g).Error
}

func (r *GrafikEvaluasiKehamilanRepository) Delete(id int32) error {
	result := r.db.Delete(&models.GrafikEvaluasiKehamilan{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("data grafik evaluasi kehamilan tidak ditemukan")
	}
	return nil
}
