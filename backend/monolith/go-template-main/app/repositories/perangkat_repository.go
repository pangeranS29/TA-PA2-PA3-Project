package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

func (m *Main) GetPerangkatByID(PerangkatID uint) (*models.Perangkat, error) {
	var perangkat models.Perangkat
	if err := m.postgres.Where("id = ?", PerangkatID).First(&perangkat).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("Perangkat tidak ditemukan")
		}
		return nil, err
	}
	return &perangkat, nil
}

func (m *Main) GetPerangkatByPenggunaID(penggunaID uint) (*models.Perangkat, error) {
	var perangkat models.Perangkat
	if err := m.postgres.Where("id_pengguna = ?", penggunaID).First(&perangkat).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("Perangkat tidak ditemukan")
		}
		return nil, err
	}
	return &perangkat, nil
}

func (m *Main) GetAllPerangkat() ([]models.Perangkat, error) {
	var perangkats []models.Perangkat
	if err := m.postgres.Find(&perangkats).Error; err != nil {
		return nil, err
	}
	return perangkats, nil
}

func (m *Main) CreatePerangkat(perangkat *models.Perangkat) error {
	if err := m.postgres.Create(perangkat).Error; err != nil {
		return err
	}
	return nil
}

func (m *Main) DeletePerangkatByID(id uint) error {
	if err := m.postgres.Where("id = ?", id).Delete(&models.Perangkat{}).Error; err != nil {
		return err
	}
	return nil
}

func (m *Main) UpdatePerangkat(perangkat *models.Perangkat) error {
	if err := m.postgres.Save(perangkat).Error; err != nil {
		return err
	}
	return nil
}
