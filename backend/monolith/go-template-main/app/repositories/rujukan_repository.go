package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type RujukanRepository struct {
	db *gorm.DB
}

func NewRujukanRepository(db *gorm.DB) *RujukanRepository {
	return &RujukanRepository{db: db}
}

func (r *RujukanRepository) Create(rj *models.Rujukan) error {
	return r.db.Create(rj).Error
}

func (r *RujukanRepository) FindByID(id int32) (*models.Rujukan, error) {
	var rj models.Rujukan
	err := r.db.First(&rj, id).Error
	return &rj, err
}

func (r *RujukanRepository) FindByIbuID(ibuID int32) ([]models.Rujukan, error) {
	var list []models.Rujukan
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *RujukanRepository) Update(rj *models.Rujukan) error {
	return r.db.Save(rj).Error
}

func (r *RujukanRepository) Delete(id int32) error {
	return r.db.Delete(&models.Rujukan{}, id).Error
}
