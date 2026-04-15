package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type IbuHamilRepository struct {
	db *gorm.DB
}

func NewIbuHamilRepository(db *gorm.DB) *IbuHamilRepository {
	return &IbuHamilRepository{db: db}
}

func (r *IbuHamilRepository) Create(ibu *models.IbuHamil) error {
	return r.db.Create(ibu).Error
}

func (r *IbuHamilRepository) FindByID(id int32) (*models.IbuHamil, error) {
	var ibu models.IbuHamil
	err := r.db.First(&ibu, id).Error
	return &ibu, err
}

func (r *IbuHamilRepository) FindAll() ([]models.IbuHamil, error) {
	var list []models.IbuHamil
	err := r.db.Find(&list).Error
	return list, err
}

func (r *IbuHamilRepository) Update(ibu *models.IbuHamil) error {
	return r.db.Save(ibu).Error
}

func (r *IbuHamilRepository) Delete(id int32) error {
	return r.db.Delete(&models.IbuHamil{}, id).Error
}
