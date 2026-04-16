package repositories

import (
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

type KehamilanRepository struct {
	db *gorm.DB
}

func NewKehamilanRepository(db *gorm.DB) *KehamilanRepository {
	return &KehamilanRepository{db: db}
}

func (r *KehamilanRepository) FindActiveHPHT() ([]models.Kehamilan, error) {
	var data []models.Kehamilan

	oneYearAgo := time.Now().UTC().AddDate(-1, 0, 0)

	err := r.db.
	Preload("Ibu").
		Where("hpht IS NOT NULL AND status_kehamilan != ? AND hpht >= ?", "Selesai", oneYearAgo).
		Find(&data).Error

	return data, err

}
