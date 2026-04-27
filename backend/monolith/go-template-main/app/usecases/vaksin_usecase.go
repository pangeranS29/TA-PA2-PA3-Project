package usecases

import (
	"errors"
	"monitoring-service/app/models"
)

func (m *Main) CreateVaksin(req *models.CreateVaksinRequest) error {
	if req.Name == "" || req.Deskripsi == "" || req.EfekSamping == "" {
		return errors.New("Isi data vaksin dengan lengkap")
	}

	vaksin := &models.Vaksin{
		Name:        req.Name,
		Deskripsi:   req.Deskripsi,
		EfekSamping: req.EfekSamping,
	}

	if err := m.repository.CreateVaksin(vaksin); err != nil {
		return errors.New("Gagal menyimpan data vaksin")
	}

	return nil
}

func (m *Main) GetAllVaksin() ([]models.Vaksin, error) {
	vaksins, err := m.repository.GetAllVaksin()
	if err != nil {
		return nil, errors.New("Gagal mendapatkan data vaksin")
	}
	return vaksins, nil
}

func (m *Main) DeleteVaksin(id uint) error {
	_, err := m.repository.GetVaksinByID(id)
	if err != nil {
		return errors.New("Data vaksin tidak ditemukan")
	}

	if err := m.repository.DeleteVaksinByID(id); err != nil {
		return errors.New("Terjadi kesalahan saat menghapus data")
	}

	return nil
}

func (m *Main) UpdateVaksin(id uint, req *models.UpdateVaksinRequest) error {
	vaksin, err := m.repository.GetVaksinByID(id)
	if err != nil {
		return errors.New("Data vaksin tidak ditemukan")
	}

	vaksin.Name = req.Nama
	vaksin.Deskripsi = req.Deskripsi
	vaksin.EfekSamping = req.EfekSamping

	if err := m.repository.UpdateVaksin(vaksin); err != nil {
		return errors.New("Gagal memperbarui data vaksin")
	}

	return nil
}
