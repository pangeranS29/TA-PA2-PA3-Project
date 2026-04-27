package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type EdukasiTandaBahayaTrimesterRepository interface {
	Create(data *models.EdukasiTandaBahayaTrimester) error
	FindAll() ([]models.EdukasiTandaBahayaTrimester, error)
	FindByID(id int32) (*models.EdukasiTandaBahayaTrimester, error)
	Update(data *models.EdukasiTandaBahayaTrimester) error
	Delete(id int32) error
}

type edukasiTandaBahayaTrimesterRepository struct {
	db *gorm.DB
}

func NewEdukasiTandaBahayaTrimesterRepository(db *gorm.DB) EdukasiTandaBahayaTrimesterRepository {
	return &edukasiTandaBahayaTrimesterRepository{db}
}

func (r *edukasiTandaBahayaTrimesterRepository) Create(data *models.EdukasiTandaBahayaTrimester) error {
	return r.db.Create(data).Error
}

func (r *edukasiTandaBahayaTrimesterRepository) FindAll() ([]models.EdukasiTandaBahayaTrimester, error) {
	var result []models.EdukasiTandaBahayaTrimester
	err := r.db.Find(&result).Error
	return result, err
}

func (r *edukasiTandaBahayaTrimesterRepository) FindByID(id int32) (*models.EdukasiTandaBahayaTrimester, error) {
	var data models.EdukasiTandaBahayaTrimester
	err := r.db.First(&data, id).Error
	return &data, err
}

func (r *edukasiTandaBahayaTrimesterRepository) Update(data *models.EdukasiTandaBahayaTrimester) error {
	return r.db.Save(data).Error
}

func (r *edukasiTandaBahayaTrimesterRepository) Delete(id int32) error {
	return r.db.Delete(&models.EdukasiTandaBahayaTrimester{}, id).Error
}
