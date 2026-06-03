package repositories

import (
	"strings"

	"monitoring-service/app/constants"
	"monitoring-service/app/models"
	"monitoring-service/pkg/customerror"
)

func (m *Main) GetAllAnak() ([]models.Anak, error) {
	var data []models.Anak
	err := m.postgres.
		Preload("Penduduk").
		Preload("Kehamilan").
		Preload("Kehamilan.Ibu").
		Preload("Kehamilan.Ibu.Kependudukan").
		Find(&data).Error
	if err != nil {
		return nil, customerror.NewInternalServiceError("gagal mengambil data anak")
	}
	m.populateStatusPrediksiSlice(data)
	return data, nil
}

func (m *Main) SearchAnak(namaAnak, namaIbu, noKK string) ([]models.Anak, error) {
	var data []models.Anak

	query := m.postgres.Model(&models.Anak{}).
		Joins("LEFT JOIN penduduk p ON p.id = anak.penduduk_id").
		Joins("LEFT JOIN kehamilan k ON k.id = anak.kehamilan_id").
		Joins("LEFT JOIN ibu i ON i.id = k.ibu_id").
		Joins("LEFT JOIN penduduk pi ON pi.id = i.penduduk_id").
		Joins("LEFT JOIN kartu_keluarga kk ON kk.id = p.kartu_keluarga_id")

	namaAnak = strings.TrimSpace(namaAnak)
	namaIbu = strings.TrimSpace(namaIbu)
	noKK = strings.TrimSpace(noKK)

	if namaAnak != "" {
		query = query.Where("p.nama_lengkap ILIKE ?", "%"+namaAnak+"%")
	}

	if namaIbu != "" {
		query = query.Where("pi.nama_lengkap ILIKE ?", "%"+namaIbu+"%")
	}

	if noKK != "" {
		searchNoKK := "%" + noKK + "%"
		query = query.Where("kk.no_kartu_keluarga ILIKE ?", searchNoKK)
	}

	err := query.
		Preload("Penduduk").
		Preload("Kehamilan").
		Preload("Kehamilan.Ibu").
		Preload("Kehamilan.Ibu.Kependudukan").
		Order("anak.created_at DESC").
		Find(&data).Error

	if err != nil {
		return nil, customerror.NewInternalServiceError("gagal mencari data anak")
	}
	m.populateStatusPrediksiSlice(data)
	return data, nil
}

func (m *Main) GetAnakByID(anakID uint) (*models.Anak, error) {
	var data models.Anak
	err := m.postgres.
		Preload("Penduduk").
		Preload("Kehamilan").
		Preload("Kehamilan.Ibu").
		Preload("Kehamilan.Ibu.Kependudukan").
		Where("id = ?", anakID).
		First(&data).Error
	if err != nil {
		if err.Error() == constants.GORM_ERR_NOT_FOUND {
			return nil, customerror.NewNotFoundError("data anak tidak ditemukan")
		}
		// Fallback: coba load hanya dengan Preload Penduduk
		var simpleData models.Anak
		simpleErr := m.postgres.
			Preload("Penduduk").
			Where("id = ?", anakID).
			First(&simpleData).Error
		if simpleErr != nil {
			if simpleErr.Error() == constants.GORM_ERR_NOT_FOUND {
				return nil, customerror.NewNotFoundError("data anak tidak ditemukan")
			}
			return nil, customerror.NewInternalServiceError("gagal mengambil data anak")
		}
		m.populateStatusPrediksi(&simpleData)
		return &simpleData, nil
	}
	m.populateStatusPrediksi(&data)
	return &data, nil
}

func (m *Main) populateStatusPrediksi(anak *models.Anak) {
	if anak == nil {
		return
	}
	var status string
	err := m.postgres.Table("prediksi_stunting").
		Where("anak_id = ? AND deleted_at IS NULL", anak.ID).
		Order("created_at DESC, id DESC").
		Limit(1).
		Pluck("status_prediksi", &status).Error
	if err == nil && status != "" {
		anak.StatusPrediksi = status
	} else {
		anak.StatusPrediksi = "Normal"
	}
}

func (m *Main) populateStatusPrediksiSlice(list []models.Anak) {
	if len(list) == 0 {
		return
	}
	var anakIDs []int32
	for _, a := range list {
		anakIDs = append(anakIDs, a.ID)
	}

	type Result struct {
		AnakID         int32
		StatusPrediksi string
	}
	var results []Result

	err := m.postgres.Table("prediksi_stunting").
		Select("DISTINCT ON (anak_id) anak_id, status_prediksi").
		Where("anak_id IN ? AND deleted_at IS NULL", anakIDs).
		Order("anak_id, created_at DESC, id DESC").
		Scan(&results).Error

	if err == nil {
		statusMap := make(map[int32]string)
		for _, res := range results {
			statusMap[res.AnakID] = res.StatusPrediksi
		}
		for i := range list {
			if status, ok := statusMap[list[i].ID]; ok {
				list[i].StatusPrediksi = status
			} else {
				list[i].StatusPrediksi = "Normal"
			}
		}
	} else {
		for i := range list {
			list[i].StatusPrediksi = "Normal"
		}
	}
}
