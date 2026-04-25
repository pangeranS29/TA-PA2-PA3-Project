package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PemeriksaanDokterTrimester1Repository struct {
	db *gorm.DB
}

func NewPemeriksaanDokterTrimester1Repository(db *gorm.DB) *PemeriksaanDokterTrimester1Repository {
	return &PemeriksaanDokterTrimester1Repository{db: db}
}

func (r *PemeriksaanDokterTrimester1Repository) Create(p *models.PemeriksaanDokterTrimester1) error {
	return r.db.Create(p).Error
}

func (r *PemeriksaanDokterTrimester1Repository) FindByID(id int32) (*models.PemeriksaanDokterTrimester1, error) {
	var p models.PemeriksaanDokterTrimester1
	err := r.db.Preload("Kehamilan.Ibu.Kependudukan").First(&p, id).Error
	return &p, err
}

func (r *PemeriksaanDokterTrimester1Repository) FindByKehamilanID(kehamilanID int32) ([]models.PemeriksaanDokterTrimester1, error) {
	var list []models.PemeriksaanDokterTrimester1
	err := r.db.Where("kehamilan_id = ?", kehamilanID).Find(&list).Error
	return list, err
}

func (r *PemeriksaanDokterTrimester1Repository) Update(p *models.PemeriksaanDokterTrimester1) error {
	return r.db.Save(p).Error
}

func (r *PemeriksaanDokterTrimester1Repository) Delete(id int32) error {
	result := r.db.Delete(&models.PemeriksaanDokterTrimester1{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("data pemeriksaan dokter trimester 1 tidak ditemukan")
	}
	return nil
}
