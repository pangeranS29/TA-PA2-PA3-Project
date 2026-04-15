package repositories

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/pkg/customerror"

	"gorm.io/gorm"
)

func (m *Main) GetActiveKehamilanByUserId(userId uint) (*models.Kehamilan, error) {
	var kehamilan models.Kehamilan
	
	//Join Ibu - Kehamilan - Kependudukan
	err := m.postgres.
	Preload("Ibu").
		// Isi data
		Preload("Ibu.Kependudukan").
		Preload("Ibu.Kependudukan.User").
		Preload("Ibu.Kependudukan.User.Role").
		// Penghubungan data
		Joins("JOIN ibu ON ibu.id_ibu = kehamilan.id_ibu").
		Joins("JOIN kependudukan ON kependudukan.id_kependudukan = ibu.id_kependudukan").
		Where("kependudukan.id_user = ? AND kehamilan.status_kehamilan = ?", userId, models.StatusAktif).
		First(&kehamilan).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, customerror.NewNotFoundError("anda belum memiliki rekam kehamilan aktif")
		}
		return nil, err
	}
	return &kehamilan, nil
}