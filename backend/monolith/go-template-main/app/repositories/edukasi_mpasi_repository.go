package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type EdukasiMPASIRepository interface {
	Create(data *models.EdukasiMPASI) error
	GetAll() ([]models.EdukasiMPASI, error)
	GetByID(id int32) (*models.EdukasiMPASI, error)
	Update(id int32, data *models.EdukasiMPASI) error
	Delete(id int32) error
}

type edukasiMPASIRepository struct {
	db *gorm.DB
}

func NewEdukasiMPASIRepository(db *gorm.DB) EdukasiMPASIRepository {
	return &edukasiMPASIRepository{db}
}

func (r *edukasiMPASIRepository) Create(data *models.EdukasiMPASI) error {
	return r.db.Create(data).Error
}

func (r *edukasiMPASIRepository) GetAll() ([]models.EdukasiMPASI, error) {
	var data []models.EdukasiMPASI
	err := r.db.Find(&data).Error
	return data, err
}

func (r *edukasiMPASIRepository) GetByID(id int32) (*models.EdukasiMPASI, error) {
	var data models.EdukasiMPASI
	err := r.db.First(&data, id).Error
	return &data, err
}

func (r *edukasiMPASIRepository) Update(id int32, data *models.EdukasiMPASI) error {
	return r.db.Model(&models.EdukasiMPASI{}).Where("id = ?", id).Updates(data).Error
}

func (r *edukasiMPASIRepository) Delete(id int32) error {
	return r.db.Delete(&models.EdukasiMPASI{}, id).Error
}
