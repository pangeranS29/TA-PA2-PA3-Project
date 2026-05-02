package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type KeluhanAnakRepository interface {
	Create(data *models.KeluhanAnak) error
	Update(data *models.KeluhanAnak) error
	Delete(id uint) error
	FindAllByAnakID(anakID uint) ([]models.KeluhanAnak, error)
	FindByID(id uint) (*models.KeluhanAnak, error)
}

type keluhanAnakRepository struct {
	db *gorm.DB
}

func NewKeluhanAnakRepository(db *gorm.DB) KeluhanAnakRepository {
	return &keluhanAnakRepository{db}
}

func (r *keluhanAnakRepository) Create(data *models.KeluhanAnak) error {
	return r.db.Create(data).Error
}

func (r *keluhanAnakRepository) Update(data *models.KeluhanAnak) error {
	return r.db.Save(data).Error
}

func (r *keluhanAnakRepository) Delete(id uint) error {
	return r.db.Delete(&models.KeluhanAnak{}, id).Error
}

func (r *keluhanAnakRepository) FindAllByAnakID(anakID uint) ([]models.KeluhanAnak, error) {
	var data []models.KeluhanAnak
	err := r.db.Where("anak_id = ?", anakID).Order("tanggal desc").Find(&data).Error
	return data, err
}

func (r *keluhanAnakRepository) FindByID(id uint) (*models.KeluhanAnak, error) {
	var data models.KeluhanAnak
	err := r.db.First(&data, id).Error
	if err != nil {
		return nil, err
	}
	return &data, nil
}
