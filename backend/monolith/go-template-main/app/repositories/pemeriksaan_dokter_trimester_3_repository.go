package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PemeriksaanDokterTrimester3Repository struct {
	db *gorm.DB
}

func NewPemeriksaanDokterTrimester3Repository(db *gorm.DB) *PemeriksaanDokterTrimester3Repository {
	return &PemeriksaanDokterTrimester3Repository{db: db}
}

func (r *PemeriksaanDokterTrimester3Repository) Create(p *models.PemeriksaanDokterTrimester3) error {
	return r.db.Create(p).Error
}

func (r *PemeriksaanDokterTrimester3Repository) FindByID(id int32) (*models.PemeriksaanDokterTrimester3, error) {
	var p models.PemeriksaanDokterTrimester3
	err := r.db.First(&p, id).Error
	return &p, err
}

func (r *PemeriksaanDokterTrimester3Repository) FindByIbuID(ibuID int32) ([]models.PemeriksaanDokterTrimester3, error) {
	var list []models.PemeriksaanDokterTrimester3
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *PemeriksaanDokterTrimester3Repository) Update(p *models.PemeriksaanDokterTrimester3) error {
	return r.db.Save(p).Error
}

func (r *PemeriksaanDokterTrimester3Repository) Delete(id int32) error {
	return r.db.Delete(&models.PemeriksaanDokterTrimester3{}, id).Error
}
