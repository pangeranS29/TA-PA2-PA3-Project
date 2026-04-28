package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PuskesmasRepository struct {
	db *gorm.DB
}

func NewPuskesmasRepository(db *gorm.DB) *PuskesmasRepository {
	return &PuskesmasRepository{db: db}
}

func (r *PuskesmasRepository) FindByUserID(userID uint) (*models.Puskesmas, error) {
	var puskesmas models.Puskesmas
	err := r.db.Where("id_pengguna = ?", userID).First(&puskesmas).Error
	return &puskesmas, err
}
