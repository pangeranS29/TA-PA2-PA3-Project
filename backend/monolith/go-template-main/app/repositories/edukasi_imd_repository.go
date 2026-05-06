package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type EdukasiImdRepository interface {
	Create(data *models.EdukasiImd) error
	FindAll() ([]models.EdukasiImd, error)
	FindByID(id int32) (*models.EdukasiImd, error)
	Update(data *models.EdukasiImd) error
	Delete(id int32) error
}

type edukasiImdRepository struct {
	db *gorm.DB
}

func NewEdukasiImdRepository(db *gorm.DB) EdukasiImdRepository {
	return &edukasiImdRepository{db}
}

func (r *edukasiImdRepository) Create(data *models.EdukasiImd) error {
	return r.db.Create(data).Error
}

func (r *edukasiImdRepository) FindAll() ([]models.EdukasiImd, error) {
	var result []models.EdukasiImd
	err := r.db.Find(&result).Error
	return result, err
}

func (r *edukasiImdRepository) FindByID(id int32) (*models.EdukasiImd, error) {
	var data models.EdukasiImd
	err := r.db.First(&data, id).Error
	return &data, err
}

func (r *edukasiImdRepository) Update(data *models.EdukasiImd) error {
	return r.db.Save(data).Error
}

func (r *edukasiImdRepository) Delete(id int32) error {
	return r.db.Delete(&models.EdukasiImd{}, id).Error
}
