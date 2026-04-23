package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PendudukRepository struct {
	db *gorm.DB
}

func NewPendudukRepository(db *gorm.DB) *PendudukRepository {
	return &PendudukRepository{db: db}
}

func (r *PendudukRepository) Create(p *models.Penduduk) error {
	return r.db.Create(p).Error
}

func (r *PendudukRepository) FindByID(id int64) (*models.Penduduk, error) {
	var p models.Penduduk
	err := r.db.First(&p, id).Error
	return &p, err
}

func (r *PendudukRepository) FindByNIK(nik string) (*models.Penduduk, error) {
	var p models.Penduduk
	err := r.db.Where("nik = ?", nik).First(&p).Error
	return &p, err
}

func (r *PendudukRepository) GetAll() ([]models.Penduduk, error) {
	var list []models.Penduduk
	err := r.db.Find(&list).Error
	return list, err
}

func (r *PendudukRepository) Update(p *models.Penduduk) error {
	return r.db.Save(p).Error
}

func (r *PendudukRepository) Delete(id int64) error {
	result := r.db.Delete(&models.Penduduk{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("data penduduk tidak ditemukan")
	}
	return nil
}
