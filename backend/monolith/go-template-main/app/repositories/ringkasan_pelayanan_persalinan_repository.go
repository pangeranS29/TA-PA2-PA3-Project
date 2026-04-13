package repositories

import (
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

func (r *RingkasanPelayananPersalinanRepository) FindByID(id uint) (*models.RingkasanPelayananPersalinan, error) {
	var rp models.RingkasanPelayananPersalinan
	err := r.db.First(&rp, id).Error
	return &rp, err
}

func (r *RingkasanPelayananPersalinanRepository) FindByIbuID(ibuID uint) ([]models.RingkasanPelayananPersalinan, error) {
	var list []models.RingkasanPelayananPersalinan
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *RingkasanPelayananPersalinanRepository) Update(rp *models.RingkasanPelayananPersalinan) error {
	return r.db.Save(rp).Error
}

func (r *RingkasanPelayananPersalinanRepository) Delete(id uint) error {
	return r.db.Delete(&models.RingkasanPelayananPersalinan{}, id).Error
}
