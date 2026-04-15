package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type EvaluasiKesehatanIbuRepository struct {
	db *gorm.DB
}

func NewEvaluasiKesehatanIbuRepository(db *gorm.DB) *EvaluasiKesehatanIbuRepository {
	return &EvaluasiKesehatanIbuRepository{db: db}
}

func (r *EvaluasiKesehatanIbuRepository) Create(e *models.EvaluasiKesehatanIbu) error {
	return r.db.Create(e).Error
}

func (r *EvaluasiKesehatanIbuRepository) FindByID(id int32) (*models.EvaluasiKesehatanIbu, error) {
	var e models.EvaluasiKesehatanIbu
	err := r.db.First(&e, id).Error
	return &e, err
}

func (r *EvaluasiKesehatanIbuRepository) FindByIbuID(ibuID int32) ([]models.EvaluasiKesehatanIbu, error) {
	var list []models.EvaluasiKesehatanIbu
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *EvaluasiKesehatanIbuRepository) Update(e *models.EvaluasiKesehatanIbu) error {
	return r.db.Save(e).Error
}

func (r *EvaluasiKesehatanIbuRepository) Delete(id int32) error {
	return r.db.Delete(&models.EvaluasiKesehatanIbu{}, id).Error
}
