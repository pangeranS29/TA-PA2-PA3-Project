package usecases

import (
	"strconv"
	"strings"

	"monitoring-service/app/models"
	"monitoring-service/pkg/customerror"
)

// Fungsi GetAllAnak sekarang langsung mengembalikan DTO
func (m *Main) GetAllAnak() ([]models.AnakListResponse, error) {
	return m.repository.GetAllAnak()
}

// GetAnakById langsung mengembalikan DTO Detail
func (m *Main) GetAnakById(anakID string) (*models.AnakDetailResponse, error) {
	id, err := strconv.ParseUint(strings.TrimSpace(anakID), 10, 64)
	if err != nil || id == 0 {
		return nil, customerror.NewBadRequestError("anak_id tidak valid")
	}

	return m.repository.GetAnakByID(uint(id))
}

// GetAnak (Search) juga langsung memakai DTO
func (m *Main) GetAnak(namaAnak, namaIbu, noKK string) ([]models.AnakListResponse, *models.Pagination, error) {
	namaAnak = strings.TrimSpace(namaAnak)
	namaIbu = strings.TrimSpace(namaIbu)
	noKK = strings.TrimSpace(noKK)

	if namaAnak == "" && namaIbu == "" && noKK == "" {
		return nil, nil, customerror.NewBadRequestError("minimal satu parameter pencarian wajib diisi: nama, nama_ibu, atau no_kk")
	}

	data, err := m.repository.SearchAnak(namaAnak, namaIbu, noKK)
	if err != nil {
		return nil, nil, err
	}

	meta := &models.Pagination{
		Total: len(data),
	}

	return data, meta, nil
}
