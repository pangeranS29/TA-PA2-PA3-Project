package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type RingkasanPelayananPersalinanRepository struct {
	db *gorm.DB
}

func NewRingkasanPelayananPersalinanRepository(db *gorm.DB) *RingkasanPelayananPersalinanRepository {
	return &RingkasanPelayananPersalinanRepository{db: db}
}

func (r *RingkasanPelayananPersalinanRepository) Create(rp *models.RingkasanPelayananPersalinan) error {
	return r.db.Create(rp).Error
}

func (r *RingkasanPelayananPersalinanRepository) FindByID(id int32) (*models.RingkasanPelayananPersalinan, error) {
	var rp models.RingkasanPelayananPersalinan
	err := r.db.Preload("Kehamilan.Ibu.Kependudukan").First(&rp, id).Error
	return &rp, err
}

func (r *RingkasanPelayananPersalinanRepository) FindByKehamilanID(kehamilanID int32) ([]models.RingkasanPelayananPersalinan, error) {
	var list []models.RingkasanPelayananPersalinan
	err := r.db.Where("kehamilan_id = ?", kehamilanID).Find(&list).Error
	return list, err
}

func (r *RingkasanPelayananPersalinanRepository) Update(rp *models.RingkasanPelayananPersalinan) error {
	return r.db.Save(rp).Error
}

func (r *RingkasanPelayananPersalinanRepository) Delete(id int32) error {
	result := r.db.Delete(&models.RingkasanPelayananPersalinan{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("data ringkasan pelayanan persalinan tidak ditemukan")
	}
	return nil
}
