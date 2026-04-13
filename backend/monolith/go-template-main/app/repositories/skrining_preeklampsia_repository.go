package repositories

import (
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

func (r *SkriningPreeklampsiaRepository) FindByID(id uint) (*models.SkriningPreeklampsia, error) {
	var s models.SkriningPreeklampsia
	err := r.db.First(&s, id).Error
	return &s, err
}

func (r *SkriningPreeklampsiaRepository) FindByIbuID(ibuID uint) ([]models.SkriningPreeklampsia, error) {
	var list []models.SkriningPreeklampsia
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *SkriningPreeklampsiaRepository) Update(s *models.SkriningPreeklampsia) error {
	return r.db.Save(s).Error
}

func (r *SkriningPreeklampsiaRepository) Delete(id uint) error {
	return r.db.Delete(&models.SkriningPreeklampsia{}, id).Error
}
