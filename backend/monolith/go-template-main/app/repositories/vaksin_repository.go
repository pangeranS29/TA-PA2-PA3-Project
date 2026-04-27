package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

func (m *Main) GetVaksinByID(vaksinID uint) (*models.Vaksin, error) {
	var vaksin models.Vaksin
	if err := m.postgres.Where("id = ?", vaksinID).First(&vaksin).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("Vaksin tidak ditemukan")
		}
		return nil, err
	}
	return &vaksin, nil
}

func (m *Main) GetAllVaksin() ([]models.Vaksin, error) {
	var vaksins []models.Vaksin
	if err := m.postgres.Find(&vaksins).Error; err != nil {
		return nil, err
	}
	return vaksins, nil
}

func (m *Main) CreateVaksin(vaksin *models.Vaksin) error {
	if err := m.postgres.Create(vaksin).Error; err != nil {
		return err
	}
	return nil
}

func (m *Main) DeleteVaksinByID(id uint) error {
	if err := m.postgres.Where("id = ?", id).Delete(&models.Vaksin{}).Error; err != nil {
		return err
	}
	return nil
}

func (m *Main) UpdateVaksin(vaksin *models.Vaksin) error {
	if err := m.postgres.Save(vaksin).Error; err != nil {
		return err
	}
	return nil
}
