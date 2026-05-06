package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type RiwayatProsesMelahirkanRepository struct {
	db *gorm.DB
}

func NewRiwayatProsesMelahirkanRepository(db *gorm.DB) *RiwayatProsesMelahirkanRepository {
	return &RiwayatProsesMelahirkanRepository{db: db}
}

func (r *RiwayatProsesMelahirkanRepository) Create(rp *models.RiwayatProsesMelahirkan) error {
	return r.db.Create(rp).Error
}

func (r *RiwayatProsesMelahirkanRepository) FindByID(id int32) (*models.RiwayatProsesMelahirkan, error) {
	var rp models.RiwayatProsesMelahirkan
	err := r.db.Preload("Kehamilan.Ibu.Kependudukan").First(&rp, id).Error
	return &rp, err
}

func (r *RiwayatProsesMelahirkanRepository) FindByKehamilanID(kehamilanID int32) ([]models.RiwayatProsesMelahirkan, error) {
	var list []models.RiwayatProsesMelahirkan
	err := r.db.Where("kehamilan_id = ?", kehamilanID).Find(&list).Error
	return list, err
}

func (r *RiwayatProsesMelahirkanRepository) Update(rp *models.RiwayatProsesMelahirkan) error {
	return r.db.Save(rp).Error
}

func (r *RiwayatProsesMelahirkanRepository) Delete(id int32) error {
	result := r.db.Delete(&models.RiwayatProsesMelahirkan{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("data riwayat proses melahirkan tidak ditemukan")
	}
	return nil
}
