package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type SkriningDMGestasionalRepository struct {
	db *gorm.DB
}

func NewSkriningDMGestasionalRepository(db *gorm.DB) *SkriningDMGestasionalRepository {
	return &SkriningDMGestasionalRepository{db: db}
}

func (r *SkriningDMGestasionalRepository) Create(s *models.SkriningDMGestasional) error {
	return r.db.Create(s).Error
}

func (r *SkriningDMGestasionalRepository) FindByID(id int32) (*models.SkriningDMGestasional, error) {
	var s models.SkriningDMGestasional
	err := r.db.First(&s, id).Error
	return &s, err
}

func (r *SkriningDMGestasionalRepository) FindByIbuID(ibuID int32) ([]models.SkriningDMGestasional, error) {
	var list []models.SkriningDMGestasional
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *SkriningDMGestasionalRepository) Update(s *models.SkriningDMGestasional) error {
	return r.db.Save(s).Error
}

func (r *SkriningDMGestasionalRepository) Delete(id int32) error {
	return r.db.Delete(&models.SkriningDMGestasional{}, id).Error
}
