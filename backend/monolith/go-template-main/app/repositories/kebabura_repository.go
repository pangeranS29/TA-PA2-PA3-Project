package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type KebaburaRepository struct {
	db *gorm.DB
}

func NewKebaburaRepository(db *gorm.DB) *KebaburaRepository {
	return &KebaburaRepository{db: db}
}

func (r *KebaburaRepository) Create(kk *models.Kebabura) error {
	return r.db.Create(kk).Error
}

func (r *KebaburaRepository) FindByNoKK(noKK string) (*models.Kebabura, error) {
	var kk models.Kebabura
	err := r.db.Preload("User.Role").Where("no_kk = ?", noKK).First(&kk).Error
	return &kk, err
}

func (r *KebaburaRepository) FindByUserID(userID int32) (*models.Kebabura, error) {
	var kk models.Kebabura
	err := r.db.Where("id_user = ?", userID).First(&kk).Error
	return &kk, err
}
