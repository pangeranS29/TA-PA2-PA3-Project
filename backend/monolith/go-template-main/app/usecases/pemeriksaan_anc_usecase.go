package usecases

import (
	"monitoring-service/app/models"
)

func (m *Main) GetRiwayatANC(kehamilanId uint) ([]models.PemeriksaanANC, error) {
	return m.repository.GetANCByKehamilanId(kehamilanId)
}

func (m *Main) CreatePemeriksaanANC(req *models.PemeriksaanANC) error {
	if req.UsiaKehamilan == 0 {
		// return customerror.NewBadRequestError("usia kehamilan tidak valid")
	}

	return m.repository.CreateANC(req)
}