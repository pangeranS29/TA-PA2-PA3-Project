package repositories

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/pkg/customerror"

	"gorm.io/gorm"
)

func (m *Main) GetSkriningByKehamilanId(kehamilanId uint) (*models.SkriningPreeklampsiaDanDiabetes, error) {
	var skrining models.SkriningPreeklampsiaDanDiabetes

	err := m.postgres.
		Preload("Kehamilan").
		Preload("Kehamilan.Ibu").
		Preload("Kehamilan.Ibu.Kependudukan").
		Where("id_kehamilan = ?", kehamilanId).
		First(&skrining).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, customerror.NewNotFoundError("data skrining belum tersedia")
		}
		return nil, err
	}
	return &skrining, nil
}

func (m *Main) CreateSkrining(skrining *models.SkriningPreeklampsiaDanDiabetes) error {
	return m.postgres.Create(skrining).Error
}

func (m *Main) UpdateSkrining(skrining *models.SkriningPreeklampsiaDanDiabetes) error {
	return m.postgres.Save(skrining).Error
}