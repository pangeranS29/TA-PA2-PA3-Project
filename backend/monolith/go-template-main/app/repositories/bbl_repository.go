package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type BblRepository interface {
	GetByAnakID(anakID int32) (*models.Bbl, error)
	Upsert(bbl *models.Bbl) error
}

type bblRepository struct {
	db *gorm.DB
}

func NewBblRepository(db *gorm.DB) BblRepository {
	return &bblRepository{db: db}
}

func (r *bblRepository) GetByAnakID(anakID int32) (*models.Bbl, error) {
	var bbl models.Bbl
	err := r.db.Where("anak_id = ?", anakID).First(&bbl).Error
	if err != nil {
		return nil, err
	}
	return &bbl, nil
}

func (r *bblRepository) Upsert(bbl *models.Bbl) error {
	var existing models.Bbl
	err := r.db.Where("anak_id = ?", bbl.AnakID).First(&existing).Error
	if err == nil {
		// existing record found, update it
		bbl.ID = existing.ID
		// Prevent reverting true to false based on business logic "tidak bisa lagi diubah"
		if existing.Jam06 {
			bbl.Jam06 = true
		}
		if existing.Jam648 {
			bbl.Jam648 = true
		}
		if existing.Hari37 {
			bbl.Hari37 = true
		}
		if existing.Hari828 {
			bbl.Hari828 = true
		}
		return r.db.Save(bbl).Error
	}
	return r.db.Create(bbl).Error
}
