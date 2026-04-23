package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type KartuKeluargaRepository struct {
	db *gorm.DB
}

func NewKartuKeluargaRepository(db *gorm.DB) *KartuKeluargaRepository {
	return &KartuKeluargaRepository{db: db}
}

func (r *KartuKeluargaRepository) Create(kk *models.KartuKeluarga) error {
	return r.db.Create(kk).Error
}

func (r *KartuKeluargaRepository) FindByNoKK(noKK string) (*models.KartuKeluarga, error) {
	var kk models.KartuKeluarga
	err := r.db.Preload("User.Role").Where("no_kk = ?", noKK).First(&kk).Error
	return &kk, err
}

func (r *KartuKeluargaRepository) FindByUserID(userID int32) (*models.KartuKeluarga, error) {
	var kk models.KartuKeluarga
	err := r.db.Where("id_user = ?", userID).First(&kk).Error
	return &kk, err
}
