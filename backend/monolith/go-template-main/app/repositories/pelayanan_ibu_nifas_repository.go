package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PelayananIbuNifasRepository struct {
	db *gorm.DB
}

func NewPelayananIbuNifasRepository(db *gorm.DB) *PelayananIbuNifasRepository {
	return &PelayananIbuNifasRepository{db: db}
}

func (r *PelayananIbuNifasRepository) Create(p *models.PelayananIbuNifas) error {
	return r.db.Create(p).Error
}

func (r *PelayananIbuNifasRepository) FindByID(id int32) (*models.PelayananIbuNifas, error) {
	var p models.PelayananIbuNifas
	err := r.db.First(&p, id).Error
	return &p, err
}

func (r *PelayananIbuNifasRepository) FindByIbuID(ibuID int32) ([]models.PelayananIbuNifas, error) {
	var list []models.PelayananIbuNifas
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *PelayananIbuNifasRepository) Update(p *models.PelayananIbuNifas) error {
	return r.db.Save(p).Error
}

func (r *PelayananIbuNifasRepository) Delete(id int32) error {
	return r.db.Delete(&models.PelayananIbuNifas{}, id).Error
}
