package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PemeriksaanLaboratoriumJiwaRepository struct {
	db *gorm.DB
}

func NewPemeriksaanLaboratoriumJiwaRepository(db *gorm.DB) *PemeriksaanLaboratoriumJiwaRepository {
	return &PemeriksaanLaboratoriumJiwaRepository{db: db}
}

func (r *PemeriksaanLaboratoriumJiwaRepository) Create(p *models.PemeriksaanLaboratoriumJiwa) error {
	return r.db.Create(p).Error
}

func (r *PemeriksaanLaboratoriumJiwaRepository) FindByID(id int32) (*models.PemeriksaanLaboratoriumJiwa, error) {
	var p models.PemeriksaanLaboratoriumJiwa
	err := r.db.First(&p, id).Error
	return &p, err
}

func (r *PemeriksaanLaboratoriumJiwaRepository) FindByIbuID(ibuID int32) ([]models.PemeriksaanLaboratoriumJiwa, error) {
	var list []models.PemeriksaanLaboratoriumJiwa
	err := r.db.Where("id_ibu = ?", ibuID).Find(&list).Error
	return list, err
}

func (r *PemeriksaanLaboratoriumJiwaRepository) Update(p *models.PemeriksaanLaboratoriumJiwa) error {
	return r.db.Save(p).Error
}

func (r *PemeriksaanLaboratoriumJiwaRepository) Delete(id int32) error {
	return r.db.Delete(&models.PemeriksaanLaboratoriumJiwa{}, id).Error
}
