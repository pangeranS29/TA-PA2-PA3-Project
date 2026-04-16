package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type KependudukanRepository struct {
	db *gorm.DB
}

func NewKependudukanRepository(db *gorm.DB) *KependudukanRepository {
	return &KependudukanRepository{db: db}
}

func (r *KependudukanRepository) Create(k *models.Kependudukan) error {
	return r.db.Create(k).Error
}

func (r *KependudukanRepository) FindByNIK(nik string) (*models.Kependudukan, error) {
	var k models.Kependudukan
	err := r.db.Where("nik = ?", nik).First(&k).Error
	return &k, err
}

func (r *KependudukanRepository) FindByNoKK(noKK string) ([]models.Kependudukan, error) {
	var list []models.Kependudukan
	err := r.db.Where("no_kk = ?", noKK).Find(&list).Error
	return list, err
}

func (r *KependudukanRepository) Update(k *models.Kependudukan) error {
	return r.db.Save(k).Error
}
