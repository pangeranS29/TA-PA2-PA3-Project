package repositories

import (
	"monitoring-service/app/models"
)

// Ambil list riwayat ANC 
func (m *Main) GetANCByKehamilanId(kehamilanId uint) ([]models.PemeriksaanANC, error) {
	var ancList []models.PemeriksaanANC
	
	err := m.postgres.
		// Isi data
		Preload("Kehamilan").
		Preload("Kehamilan.Ibu").
		Preload("Kehamilan.Ibu.Kependudukan").
		Preload("Kehamilan.Ibu.Kependudukan.User").
		Preload("Kehamilan.Ibu.Kependudukan.User.Role").
		Where("id_kehamilan = ?", kehamilanId).
		Order("kunjungan_ke ASC").
		Find(&ancList).Error

	return ancList, err
}

// Buat data ANC baru
func (m *Main) CreateANC(anc *models.PemeriksaanANC) error {
	return m.postgres.Create(anc).Error
}