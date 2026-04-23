package repositories

import (
	"strings"

	"monitoring-service/app/constants"
	"monitoring-service/app/models"
	"monitoring-service/pkg/customerror"
)

// 1. GET ALL ANAK (Menggunakan Join + Select + Scan) -> Hanya 1 Query!
func (m *Main) GetAllAnak() ([]models.AnakListResponse, error) {
	var data []models.AnakListResponse

	err := m.postgres.Table("anak").
		Select(`
			anak.id, 
			p_anak.nama_lengkap AS nama_anak, 
			p_ibu.nama_lengkap AS nama_ibu, 
			kk_anak.no_kk, 
			anak.created_at
		`).
		Joins("LEFT JOIN penduduk p_anak ON p_anak.id = anak.penduduk_id").
		Joins("LEFT JOIN kartu_keluarga kk_anak ON kk_anak.id = p_anak.kartu_keluarga_id").
		Joins("LEFT JOIN kehamilan k ON k.id = anak.kehamilan_id").
		Joins("LEFT JOIN ibu i ON i.id = k.ibu_id").
		Joins("LEFT JOIN penduduk p_ibu ON p_ibu.id = i.penduduk_id").
		Order("anak.created_at DESC").
		Scan(&data).Error

	if err != nil {
		return nil, customerror.NewInternalServiceError("gagal mengambil data anak")
	}

	return data, nil
}

// 2. SEARCH ANAK (Menggunakan Join + Select + Scan) -> Hanya 1 Query!
func (m *Main) SearchAnak(namaAnak, namaIbu, noKK string) ([]models.AnakListResponse, error) {
	var data []models.AnakListResponse

	query := m.postgres.Table("anak").
		Select(`
			anak.id, 
			p_anak.nama_lengkap AS nama_anak, 
			p_ibu.nama_lengkap AS nama_ibu, 
			kk_anak.no_kk, 
			anak.created_at
		`).
		Joins("LEFT JOIN penduduk p_anak ON p_anak.id = anak.penduduk_id").
		Joins("LEFT JOIN kartu_keluarga kk_anak ON kk_anak.id = p_anak.kartu_keluarga_id").
		Joins("LEFT JOIN kehamilan k ON k.id = anak.kehamilan_id").
		Joins("LEFT JOIN ibu i ON i.id = k.ibu_id").
		Joins("LEFT JOIN penduduk p_ibu ON p_ibu.id = i.penduduk_id")

	// Filter data
	if strings.TrimSpace(namaAnak) != "" {
		query = query.Where("p_anak.nama_lengkap ILIKE ?", "%"+strings.TrimSpace(namaAnak)+"%")
	}
	if strings.TrimSpace(namaIbu) != "" {
		query = query.Where("p_ibu.nama_lengkap ILIKE ?", "%"+strings.TrimSpace(namaIbu)+"%")
	}
	if strings.TrimSpace(noKK) != "" {
		searchNoKK := "%" + strings.TrimSpace(noKK) + "%"
		query = query.Where("CAST(kk_anak.no_kk AS TEXT) ILIKE ?", searchNoKK)
	}

	err := query.Order("anak.created_at DESC").Scan(&data).Error

	if err != nil {
		return nil, customerror.NewInternalServiceError("gagal mencari data anak")
	}

	return data, nil
}

// 3. GET ANAK BY ID (Boleh pakai Preload karena hanya 1 record, lalu di-mapping ke DTO)
func (m *Main) GetAnakByID(anakID uint) (*models.AnakDetailResponse, error) {
	var anak models.Anak

	err := m.postgres.
		Preload("Penduduk.KartuKeluarga"). // Preload berantai langsung
		Preload("Kehamilan.Ibu.Penduduk").
		Where("id = ?", anakID).
		First(&anak).Error

	if err != nil {
		if err.Error() == constants.GORM_ERR_NOT_FOUND {
			return nil, customerror.NewNotFoundError("data anak tidak ditemukan")
		}
		return nil, customerror.NewInternalServiceError("gagal mengambil data detail anak")
	}

	// Mapping dari Model GORM ke DTO Flat secara manual
	response := &models.AnakDetailResponse{
		ID:        anak.ID,
		CreatedAt: anak.CreatedAt,
	}

	// Ekstrak data Anak
	if anak.Penduduk != nil {
		response.NamaAnak = anak.Penduduk.NamaLengkap
		response.NIKAnak = anak.Penduduk.NIK
		response.TanggalLahirAnak = anak.Penduduk.TanggalLahir
		response.JenisKelamin = anak.Penduduk.JenisKelamin
		response.Dusun = anak.Penduduk.Dusun

		if anak.Penduduk.KartuKeluarga != nil {
			response.NoKK = anak.Penduduk.KartuKeluarga.NoKK
		}
	}

	// Ekstrak data Ibu
	if anak.Kehamilan != nil && anak.Kehamilan.Ibu != nil && anak.Kehamilan.Ibu.Penduduk != nil {
		response.NamaIbu = anak.Kehamilan.Ibu.Penduduk.NamaLengkap
		response.NIKIbu = anak.Kehamilan.Ibu.Penduduk.NIK
	}

	return response, nil
}
