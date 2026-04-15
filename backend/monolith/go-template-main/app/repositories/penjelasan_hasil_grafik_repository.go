package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PenjelasanHasilGrafikRepository struct {
	db *gorm.DB
}

func NewPenjelasanHasilGrafikRepository(db *gorm.DB) *PenjelasanHasilGrafikRepository {
	return &PenjelasanHasilGrafikRepository{db: db}
}

func (r *PenjelasanHasilGrafikRepository) Create(p *models.PenjelasanHasilGrafik) error {
	return r.db.Create(p).Error
}

func (r *PenjelasanHasilGrafikRepository) FindByID(id int32) (*models.PenjelasanHasilGrafik, error) {
	var p models.PenjelasanHasilGrafik
	err := r.db.First(&p, id).Error
	return &p, err
}

func (r *PenjelasanHasilGrafikRepository) FindByIbuID(ibuID int32) ([]models.PenjelasanHasilGrafik, error) {
	var list []models.PenjelasanHasilGrafik
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *PenjelasanHasilGrafikRepository) Update(p *models.PenjelasanHasilGrafik) error {
	return r.db.Save(p).Error
}

func (r *PenjelasanHasilGrafikRepository) Delete(id int32) error {
	return r.db.Delete(&models.PenjelasanHasilGrafik{}, id).Error
}
