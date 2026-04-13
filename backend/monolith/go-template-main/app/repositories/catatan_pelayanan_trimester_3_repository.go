package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type CatatanPelayananTrimester3Repository struct {
	db *gorm.DB
}

func NewCatatanPelayananTrimester3Repository(db *gorm.DB) *CatatanPelayananTrimester3Repository {
	return &CatatanPelayananTrimester3Repository{db: db}
}

func (r *CatatanPelayananTrimester3Repository) Create(c *models.CatatanPelayananTrimester3) error {
	return r.db.Create(c).Error
}

func (r *CatatanPelayananTrimester3Repository) FindByID(id uint) (*models.CatatanPelayananTrimester3, error) {
	var c models.CatatanPelayananTrimester3
	err := r.db.First(&c, id).Error
	return &c, err
}

func (r *CatatanPelayananTrimester3Repository) FindByIbuID(ibuID uint) ([]models.CatatanPelayananTrimester3, error) {
	var list []models.CatatanPelayananTrimester3
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *CatatanPelayananTrimester3Repository) Update(c *models.CatatanPelayananTrimester3) error {
	return r.db.Save(c).Error
}

func (r *CatatanPelayananTrimester3Repository) Delete(id uint) error {
	return r.db.Delete(&models.CatatanPelayananTrimester3{}, id).Error
}
