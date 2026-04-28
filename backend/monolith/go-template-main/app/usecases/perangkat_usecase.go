package usecases

import (
	"errors"
	"monitoring-service/app/models"
)

func (m *Main) CreatePerangkat(req *models.CreatePerangkatRequest) error {
	if req.PenggunaID == 0 || req.FcmToken == "" {
		return errors.New("Isi data perangkat dengan lengkap")
	}

	perangkat := &models.Perangkat{
		PenggunaID: req.PenggunaID,
		FcmToken:   req.FcmToken,
	}

	if err := m.repository.CreatePerangkat(perangkat); err != nil {
		return errors.New("Gagal menyimpan data perangkat")
	}

	return nil
}

func (m *Main) GetAllPerangkat() ([]models.Perangkat, error) {
	perangkats, err := m.repository.GetAllPerangkat()
	if err != nil {
		return nil, errors.New("Gagal mendapatkan data perangkat")
	}
	return perangkats, nil
}

func (m *Main) DeletePerangkat(id uint) error {
	_, err := m.repository.GetPerangkatByID(id)
	if err != nil {
		return errors.New("Data perangkat tidak ditemukan")
	}

	if err := m.repository.DeletePerangkatByID(id); err != nil {
		return errors.New("Terjadi kesalahan saat menghapus data")
	}

	return nil
}

func (m *Main) UpdatePerangkat(penggunaID uint, req *models.UpdatePerangkatRequest) error {
	perangkat, err := m.repository.GetPerangkatByPenggunaID(penggunaID)
	if err != nil {
		return errors.New("Data perangkat tidak ditemukan")
	}

	perangkat.FcmToken = req.FcmToken

	if err := m.repository.UpdatePerangkat(perangkat); err != nil {
		return errors.New("Gagal memperbarui data perangkat")
	}

	return nil
}
