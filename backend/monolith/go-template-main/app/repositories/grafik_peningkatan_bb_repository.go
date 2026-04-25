package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type GrafikPeningkatanBBRepository struct {
	db *gorm.DB
}

func NewGrafikPeningkatanBBRepository(db *gorm.DB) *GrafikPeningkatanBBRepository {
	return &GrafikPeningkatanBBRepository{db: db}
}

func (r *GrafikPeningkatanBBRepository) Create(g *models.GrafikPeningkatanBB) error {
	return r.db.Create(g).Error
}

func (r *GrafikPeningkatanBBRepository) FindByID(id int32) (*models.GrafikPeningkatanBB, error) {
	var g models.GrafikPeningkatanBB
	err := r.db.Preload("Kehamilan.Ibu.Kependudukan").First(&g, id).Error
	return &g, err
}

func (r *GrafikPeningkatanBBRepository) FindByKehamilanID(kehamilanID int32) ([]models.GrafikPeningkatanBB, error) {
	var list []models.GrafikPeningkatanBB
	err := r.db.Where("kehamilan_id = ?", kehamilanID).Find(&list).Error
	return list, err
}

func (r *GrafikPeningkatanBBRepository) Update(g *models.GrafikPeningkatanBB) error {
	return r.db.Save(g).Error
}

func (r *GrafikPeningkatanBBRepository) Delete(id int32) error {
	result := r.db.Delete(&models.GrafikPeningkatanBB{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("data grafik peningkatan berat badan tidak ditemukan")
	}
	return nil
}
