package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type CatatanPelayananNifasRepository struct {
	db *gorm.DB
}

func NewCatatanPelayananNifasRepository(db *gorm.DB) *CatatanPelayananNifasRepository {
	return &CatatanPelayananNifasRepository{db: db}
}

func (r *CatatanPelayananNifasRepository) Create(c *models.CatatanPelayananNifas) error {
	return r.db.Create(c).Error
}

func (r *CatatanPelayananNifasRepository) FindByID(id uint) (*models.CatatanPelayananNifas, error) {
	var c models.CatatanPelayananNifas
	err := r.db.First(&c, id).Error
	return &c, err
}

func (r *CatatanPelayananNifasRepository) FindByIbuID(ibuID uint) ([]models.CatatanPelayananNifas, error) {
	var list []models.CatatanPelayananNifas
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *CatatanPelayananNifasRepository) Update(c *models.CatatanPelayananNifas) error {
	return r.db.Save(c).Error
}

func (r *CatatanPelayananNifasRepository) Delete(id uint) error {
	return r.db.Delete(&models.CatatanPelayananNifas{}, id).Error
}
