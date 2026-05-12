package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type ResepMPASIRepository interface {
	Create(data *models.ResepMPASI) error
	GetAll() ([]models.ResepMPASI, error)
	GetByID(id int32) (*models.ResepMPASI, error)
	Update(id int32, data *models.ResepMPASI) error
	Delete(id int32) error
}

type resepMPASIRepository struct {
	db *gorm.DB
}

func NewResepMPASIRepository(db *gorm.DB) ResepMPASIRepository {
	return &resepMPASIRepository{db: db}
}

func (r *resepMPASIRepository) Create(data *models.ResepMPASI) error {
	return r.db.Create(data).Error
}

func (r *resepMPASIRepository) GetAll() ([]models.ResepMPASI, error) {
	var data []models.ResepMPASI
	err := r.db.Find(&data).Error
	return data, err
}

func (r *resepMPASIRepository) GetByID(id int32) (*models.ResepMPASI, error) {
	var data models.ResepMPASI
	err := r.db.First(&data, id).Error
	return &data, err
}

func (r *resepMPASIRepository) Update(id int32, data *models.ResepMPASI) error {
	return r.db.Model(&models.ResepMPASI{}).Where("id = ?", id).Updates(data).Error
}

func (r *resepMPASIRepository) Delete(id int32) error {
	return r.db.Delete(&models.ResepMPASI{}, id).Error
}
