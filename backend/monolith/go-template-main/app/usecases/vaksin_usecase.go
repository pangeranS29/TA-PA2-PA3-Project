package usecases

import (
	"errors"
	"monitoring-service/app/models"
)

func (m *Main) CreateVaksin(req *models.CreateVaksinRequest) error {
	if req.JenisVaksin == "" || req.Kepanjangan == "" || req.Deskripsi == "" || req.EfekSamping == "" {
		return errors.New("Isi data vaksin dengan lengkap")
	}

	vaksin := &models.Vaksin{
		JenisVaksin: req.JenisVaksin,
		Kepanjangan: req.Kepanjangan,
		DitujukanKepada: req.DitujukanKepada,
		WaktuPemberian: req.WaktuPemberian,
		Deskripsi:   req.Deskripsi,
		EfekSamping: req.EfekSamping,
		Status:      "aktif",
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

	if err := m.repository.UpdateVaksinStatus(id, "nonaktif"); err != nil {
		return errors.New("Terjadi kesalahan saat menonaktifkan data")
	}

	return nil
}

func (m *Main) UpdateVaksin(id uint, req *models.UpdateVaksinRequest) error {
	vaksin, err := m.repository.GetVaksinByID(id)
	if err != nil {
		return errors.New("Data vaksin tidak ditemukan")
	}

	vaksin.JenisVaksin = req.JenisVaksin
	vaksin.Kepanjangan = req.Kepanjangan
	vaksin.DitujukanKepada = req.DitujukanKepada
	vaksin.WaktuPemberian = req.WaktuPemberian
	vaksin.Deskripsi = req.Deskripsi
	vaksin.EfekSamping = req.EfekSamping
	if req.Status != "" {
		vaksin.Status = req.Status
	}

	if err := m.repository.UpdateVaksin(vaksin); err != nil {
		return errors.New("Gagal memperbarui data vaksin: " + err.Error())
	}

	return nil
}

func (m *Main) GetVaksinByID(id uint) (*models.Vaksin, error) {
	data, err := m.repository.GetVaksinByID(id)
	if err != nil {
		return nil, errors.New("Data vaksin tidak ditemukan")
	}
	return data, nil
}

func (m *Main) UpdateVaksinStatus(id uint, status string) error {
	if status != "aktif" && status != "nonaktif" {
		return errors.New("Status vaksin tidak valid")
	}

	_, err := m.repository.GetVaksinByID(id)
	if err != nil {
		return errors.New("Data vaksin tidak ditemukan")
	}

	if err := m.repository.UpdateVaksinStatus(id, status); err != nil {
		return errors.New("Gagal memperbarui status vaksin: " + err.Error())
	}

	return nil
}
