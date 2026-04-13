package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type CatatanPelayananTrimester2Repository struct {
	db *gorm.DB
}

func NewCatatanPelayananTrimester2Repository(db *gorm.DB) *CatatanPelayananTrimester2Repository {
	return &CatatanPelayananTrimester2Repository{db: db}
}

func (r *CatatanPelayananTrimester2Repository) Create(c *models.CatatanPelayananTrimester2) error {
	return r.db.Create(c).Error
}

func (r *CatatanPelayananTrimester2Repository) FindByID(id uint) (*models.CatatanPelayananTrimester2, error) {
	var c models.CatatanPelayananTrimester2
	err := r.db.First(&c, id).Error
	return &c, err
}

func (r *CatatanPelayananTrimester2Repository) FindByIbuID(ibuID uint) ([]models.CatatanPelayananTrimester2, error) {
	var list []models.CatatanPelayananTrimester2
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *CatatanPelayananTrimester2Repository) Update(c *models.CatatanPelayananTrimester2) error {
	return r.db.Save(c).Error
}

func (r *CatatanPelayananTrimester2Repository) Delete(id uint) error {
	return r.db.Delete(&models.CatatanPelayananTrimester2{}, id).Error
}
