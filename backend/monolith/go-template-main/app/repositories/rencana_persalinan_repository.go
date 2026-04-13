package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type RencanaPersalinanRepository struct {
	db *gorm.DB
}

func NewRencanaPersalinanRepository(db *gorm.DB) *RencanaPersalinanRepository {
	return &RencanaPersalinanRepository{db: db}
}

func (r *RencanaPersalinanRepository) Create(rp *models.RencanaPersalinan) error {
	return r.db.Create(rp).Error
}

func (r *RencanaPersalinanRepository) FindByID(id uint) (*models.RencanaPersalinan, error) {
	var rp models.RencanaPersalinan
	err := r.db.First(&rp, id).Error
	return &rp, err
}

func (r *RencanaPersalinanRepository) FindByIbuID(ibuID uint) ([]models.RencanaPersalinan, error) {
	var list []models.RencanaPersalinan
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *RencanaPersalinanRepository) Update(rp *models.RencanaPersalinan) error {
	return r.db.Save(rp).Error
}

func (r *RencanaPersalinanRepository) Delete(id uint) error {
	return r.db.Delete(&models.RencanaPersalinan{}, id).Error
}
