package repositories

import (
	"strings"

	"monitoring-service/app/constants"
	"monitoring-service/app/models"
	"monitoring-service/pkg/customerror"
)

func (m *Main) GetAllKategoriCapaian() ([]models.KategoriCapaian, error) {
	var data []models.KategoriCapaian
	err := m.postgres.
		Where("deleted_at IS NULL").
		Order("id ASC").
		Find(&data).Error
	if err != nil {
		return nil, customerror.NewInternalServiceError("gagal mengambil data kategori capaian")
	}

	return data, nil
}

func (m *Main) GetKategoriCapaianByID(kategoriCapaianID uint) (*models.KategoriCapaian, error) {
	var data models.KategoriCapaian
	err := m.postgres.
		Where("id = ? AND deleted_at IS NULL", kategoriCapaianID).
		First(&data).Error
	if err != nil {
		if err.Error() == constants.GORM_ERR_NOT_FOUND {
			return nil, customerror.NewNotFoundError("data kategori capaian tidak ditemukan")
		}
		return nil, customerror.NewInternalServiceError("gagal mengambil data kategori capaian")
	}

	return &data, nil
}

func (m *Main) CreateKategoriCapaian(kategoriCapaian *models.KategoriCapaian) error {
	if kategoriCapaian == nil {
		return customerror.NewBadRequestError("data kategori capaian tidak boleh kosong")
	}

	err := m.postgres.Create(kategoriCapaian).Error
	if err != nil {
		return customerror.NewInternalServiceError("gagal membuat data kategori capaian")
	}

	return nil
}

func (m *Main) UpdateKategoriCapaian(kategoriCapaian *models.KategoriCapaian) error {
	if kategoriCapaian == nil {
		return customerror.NewBadRequestError("data kategori capaian tidak boleh kosong")
	}

	err := m.postgres.
		Model(kategoriCapaian).
		Where("id = ? AND deleted_at IS NULL", kategoriCapaian.ID).
		Updates(kategoriCapaian).Error
	if err != nil {
		return customerror.NewInternalServiceError("gagal memperbarui data kategori capaian")
	}

	return nil
}

func (m *Main) DeleteKategoriCapaian(kategoriCapaianID uint) error {
	err := m.postgres.
		Model(&models.KategoriCapaian{}).
		Where("id = ?", kategoriCapaianID).
		Delete(&models.KategoriCapaian{}).Error
	if err != nil {
		return customerror.NewInternalServiceError("gagal menghapus data kategori capaian")
	}

	return nil
}

// Perkembangan Repository Functions
func (m *Main) GetAllPerkembangan() ([]models.Perkembangan, error) {
	var data []models.Perkembangan
	err := m.postgres.
		Preload("Anak").
		Preload("KategoriCapaian").
		Where("is_deleted IS NULL").
		Order("created_at DESC").
		Find(&data).Error
	if err != nil {
		return nil, customerror.NewInternalServiceError("gagal mengambil data perkembangan")
	}

	return data, nil
}

func (m *Main) GetPerkembanganByID(perkembanganID uint) (*models.Perkembangan, error) {
	var data models.Perkembangan
	err := m.postgres.
		Preload("Anak").
		Preload("KategoriCapaian").
		Where("id = ? AND is_deleted IS NULL", perkembanganID).
		First(&data).Error
	if err != nil {
		if err.Error() == constants.GORM_ERR_NOT_FOUND {
			return nil, customerror.NewNotFoundError("data perkembangan tidak ditemukan")
		}
		return nil, customerror.NewInternalServiceError("gagal mengambil data perkembangan")
	}

	return &data, nil
}

func (m *Main) GetPerkembanganByAnakID(anakID uint) ([]models.Perkembangan, error) {
	var data []models.Perkembangan
	err := m.postgres.
		Preload("KategoriCapaian").
		Where("anak_id = ? AND is_deleted IS NULL", anakID).
		Order("tanggal_periksa DESC").
		Find(&data).Error
	if err != nil {
		return nil, customerror.NewInternalServiceError("gagal mengambil data perkembangan anak")
	}

	return data, nil
}

func (m *Main) GetPerkembanganByAnakIDAndKategoriID(anakID, kategoriCapaianID uint) ([]models.Perkembangan, error) {
	var data []models.Perkembangan
	err := m.postgres.
		Preload("KategoriCapaian").
		Where("anak_id = ? AND kategori_capaian_id = ? AND is_deleted IS NULL", anakID, kategoriCapaianID).
		Order("tanggal_periksa DESC").
		Find(&data).Error
	if err != nil {
		return nil, customerror.NewInternalServiceError("gagal mengambil data perkembangan anak")
	}

	return data, nil
}

func (m *Main) CreatePerkembangan(perkembangan *models.Perkembangan) error {
	if perkembangan == nil {
		return customerror.NewBadRequestError("data perkembangan tidak boleh kosong")
	}

	// Verify anak exists
	var anak models.Anak
	if err := m.postgres.Where("id = ?", perkembangan.AnakID).First(&anak).Error; err != nil {
		return customerror.NewNotFoundError("data anak tidak ditemukan")
	}

	// Verify kategori capaian exists
	var kategori models.KategoriCapaian
	if err := m.postgres.Where("id = ? AND deleted_at IS NULL", perkembangan.KategoriCapaianID).First(&kategori).Error; err != nil {
		return customerror.NewNotFoundError("data kategori capaian tidak ditemukan")
	}

	err := m.postgres.Create(perkembangan).Error
	if err != nil {
		return customerror.NewInternalServiceError("gagal membuat data perkembangan")
	}

	return nil
}

func (m *Main) UpdatePerkembangan(perkembangan *models.Perkembangan) error {
	if perkembangan == nil {
		return customerror.NewBadRequestError("data perkembangan tidak boleh kosong")
	}

	// Check if perkembangan exists
	var existing models.Perkembangan
	if err := m.postgres.Where("id = ? AND is_deleted IS NULL", perkembangan.ID).First(&existing).Error; err != nil {
		return customerror.NewNotFoundError("data perkembangan tidak ditemukan")
	}

	err := m.postgres.
		Model(perkembangan).
		Where("id = ? AND is_deleted IS NULL", perkembangan.ID).
		Updates(perkembangan).Error
	if err != nil {
		return customerror.NewInternalServiceError("gagal memperbarui data perkembangan")
	}

	return nil
}

func (m *Main) DeletePerkembangan(perkembanganID uint) error {
	err := m.postgres.
		Model(&models.Perkembangan{}).
		Where("id = ?", perkembanganID).
		Update("is_deleted", "NOW()").Error
	if err != nil {
		return customerror.NewInternalServiceError("gagal menghapus data perkembangan")
	}

	return nil
}

func (m *Main) SearchPerkembangan(anakID uint, kategoriCapaianID uint) ([]models.Perkembangan, error) {
	var data []models.Perkembangan
	query := m.postgres.
		Preload("Anak").
		Preload("KategoriCapaian").
		Where("is_deleted IS NULL")

	if anakID > 0 {
		query = query.Where("anak_id = ?", anakID)
	}

	if kategoriCapaianID > 0 {
		query = query.Where("kategori_capaian_id = ?", kategoriCapaianID)
	}

	err := query.Order("created_at DESC").Find(&data).Error
	if err != nil {
		return nil, customerror.NewInternalServiceError("gagal mencari data perkembangan")
	}

	return data, nil
}

func (m *Main) GetKategoriCapaianByRentangUsia(rentangUsia string) ([]models.KategoriCapaian, error) {
	var data []models.KategoriCapaian
	rentangUsia = strings.TrimSpace(rentangUsia)

	query := m.postgres.Where("deleted_at IS NULL")
	if rentangUsia != "" {
		query = query.Where("rentang_usia = ?", rentangUsia)
	}

	err := query.Order("id ASC").Find(&data).Error
	if err != nil {
		return nil, customerror.NewInternalServiceError("gagal mengambil data kategori capaian")
	}

	return data, nil
}
