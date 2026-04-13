package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PemeriksaanLanjutanTrimester3Repository struct {
	db *gorm.DB
}

func NewPemeriksaanLanjutanTrimester3Repository(db *gorm.DB) *PemeriksaanLanjutanTrimester3Repository {
	return &PemeriksaanLanjutanTrimester3Repository{db: db}
}

func (r *PemeriksaanLanjutanTrimester3Repository) Create(p *models.PemeriksaanLanjutanTrimester3) error {
	return r.db.Create(p).Error
}

func (r *PemeriksaanLanjutanTrimester3Repository) FindByID(id uint) (*models.PemeriksaanLanjutanTrimester3, error) {
	var p models.PemeriksaanLanjutanTrimester3
	err := r.db.First(&p, id).Error
	return &p, err
}

func (r *PemeriksaanLanjutanTrimester3Repository) FindByIbuID(ibuID uint) ([]models.PemeriksaanLanjutanTrimester3, error) {
	var list []models.PemeriksaanLanjutanTrimester3
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *PemeriksaanLanjutanTrimester3Repository) Update(p *models.PemeriksaanLanjutanTrimester3) error {
	return r.db.Save(p).Error
}

func (r *PemeriksaanLanjutanTrimester3Repository) Delete(id uint) error {
	return r.db.Delete(&models.PemeriksaanLanjutanTrimester3{}, id).Error
}
