package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PemeriksaanKehamilanRepository struct {
	db *gorm.DB
}

func NewPemeriksaanKehamilanRepository(db *gorm.DB) *PemeriksaanKehamilanRepository {
	return &PemeriksaanKehamilanRepository{db: db}
}

func (r *PemeriksaanKehamilanRepository) Create(p *models.PemeriksaanKehamilan) error {
	return r.db.Create(p).Error
}

func (r *PemeriksaanKehamilanRepository) FindByID(id uint) (*models.PemeriksaanKehamilan, error) {
	var p models.PemeriksaanKehamilan
	err := r.db.First(&p, id).Error
	return &p, err
}

func (r *PemeriksaanKehamilanRepository) FindByIbuID(ibuID uint) ([]models.PemeriksaanKehamilan, error) {
	var list []models.PemeriksaanKehamilan
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *PemeriksaanKehamilanRepository) Update(p *models.PemeriksaanKehamilan) error {
	return r.db.Save(p).Error
}

func (r *PemeriksaanKehamilanRepository) Delete(id uint) error {
	return r.db.Delete(&models.PemeriksaanKehamilan{}, id).Error
}
