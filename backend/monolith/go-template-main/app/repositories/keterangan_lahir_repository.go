package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type KeteranganLahirRepository struct {
	db *gorm.DB
}

func NewKeteranganLahirRepository(db *gorm.DB) *KeteranganLahirRepository {
	return &KeteranganLahirRepository{db: db}
}

func (r *KeteranganLahirRepository) Create(k *models.KeteranganLahir) error {
	return r.db.Create(k).Error
}

func (r *KeteranganLahirRepository) FindByID(id uint) (*models.KeteranganLahir, error) {
	var k models.KeteranganLahir
	err := r.db.First(&k, id).Error
	return &k, err
}

func (r *KeteranganLahirRepository) FindByIbuID(ibuID uint) ([]models.KeteranganLahir, error) {
	var list []models.KeteranganLahir
	err := r.db.Where("id_ibu_relasi = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *KeteranganLahirRepository) Update(k *models.KeteranganLahir) error {
	return r.db.Save(k).Error
}

func (r *KeteranganLahirRepository) Delete(id uint) error {
	return r.db.Delete(&models.KeteranganLahir{}, id).Error
}
