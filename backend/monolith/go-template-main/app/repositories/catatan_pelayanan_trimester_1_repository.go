package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type CatatanPelayananTrimester1Repository struct {
	db *gorm.DB
}

func NewCatatanPelayananTrimester1Repository(db *gorm.DB) *CatatanPelayananTrimester1Repository {
	return &CatatanPelayananTrimester1Repository{db: db}
}

func (r *CatatanPelayananTrimester1Repository) Create(c *models.CatatanPelayananTrimester1) error {
	return r.db.Create(c).Error
}

func (r *CatatanPelayananTrimester1Repository) FindByID(id int32) (*models.CatatanPelayananTrimester1, error) {
	var c models.CatatanPelayananTrimester1
	err := r.db.First(&c, id).Error
	return &c, err
}

func (r *CatatanPelayananTrimester1Repository) FindByIbuID(ibuID int32) ([]models.CatatanPelayananTrimester1, error) {
	var list []models.CatatanPelayananTrimester1
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *CatatanPelayananTrimester1Repository) Update(c *models.CatatanPelayananTrimester1) error {
	return r.db.Save(c).Error
}

func (r *CatatanPelayananTrimester1Repository) Delete(id int32) error {
	return r.db.Delete(&models.CatatanPelayananTrimester1{}, id).Error
}
