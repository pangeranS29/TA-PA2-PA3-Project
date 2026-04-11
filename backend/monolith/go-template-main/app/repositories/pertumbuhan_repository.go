package repositories

import (
	"strings"
	"time"

	"monitoring-service/app/constants"
	"monitoring-service/app/models"
	"monitoring-service/pkg/customerror"
)

func normalizeGender(gender string) string {
	v := strings.TrimSpace(strings.ToLower(gender))
	if v == "m" || v == "male" || v == "l" || strings.Contains(v, "laki") {
		return "Laki-laki"
	}
	if v == "f" || v == "female" || v == "p" || strings.Contains(v, "perem") {
		return "Perempuan"
	}
	return gender
}

func (m *Main) GetAnakByID(anakID uint) (*models.Anak, error) {
	var data models.Anak
	err := m.postgres.Preload("Kependudukan").Where("id = ?", anakID).First(&data).Error
	if err != nil {
		if err.Error() == constants.GORM_ERR_NOT_FOUND {
			return nil, customerror.NewNotFoundError("data anak tidak ditemukan")
		}
		return nil, customerror.NewInternalServiceError("gagal mengambil data anak")
	}

	if data.Kependudukan == nil {
		return nil, customerror.NewNotFoundError("data kependudukan anak tidak ditemukan")
	}

	return &data, nil
}

func (m *Main) GetStandarAntropometri(parameter, jenisKelamin string, nilaiSumbuX float64) (*models.MasterStandarAntropometri, error) {
	gender := normalizeGender(jenisKelamin)

	var exact models.MasterStandarAntropometri
	err := m.postgres.Where("parameter = ? AND jenis_kelamin = ? AND nilai_sumbu_x = ?", parameter, gender, nilaiSumbuX).First(&exact).Error
	if err == nil {
		return &exact, nil
	}

	var lower models.MasterStandarAntropometri
	lowerErr := m.postgres.Where("parameter = ? AND jenis_kelamin = ? AND nilai_sumbu_x <= ?", parameter, gender, nilaiSumbuX).
		Order("nilai_sumbu_x DESC").First(&lower).Error

	var upper models.MasterStandarAntropometri
	upperErr := m.postgres.Where("parameter = ? AND jenis_kelamin = ? AND nilai_sumbu_x >= ?", parameter, gender, nilaiSumbuX).
		Order("nilai_sumbu_x ASC").First(&upper).Error

	if lowerErr != nil && upperErr != nil {
		return nil, customerror.NewNotFoundError("master standar antropometri tidak ditemukan")
	}

	if lowerErr != nil {
		return &upper, nil
	}
	if upperErr != nil {
		return &lower, nil
	}

	if upper.NilaiSumbuX == lower.NilaiSumbuX {
		return &lower, nil
	}

	ratio := (nilaiSumbuX - lower.NilaiSumbuX) / (upper.NilaiSumbuX - lower.NilaiSumbuX)
	interpolate := func(a, b float64) float64 {
		return a + ratio*(b-a)
	}

	interpolated := models.MasterStandarAntropometri{
		Parameter:    parameter,
		JenisKelamin: lower.JenisKelamin,
		NilaiSumbuX:  nilaiSumbuX,
		SD3Neg:       interpolate(lower.SD3Neg, upper.SD3Neg),
		SD2Neg:       interpolate(lower.SD2Neg, upper.SD2Neg),
		SD1Neg:       interpolate(lower.SD1Neg, upper.SD1Neg),
		Median:       interpolate(lower.Median, upper.Median),
		SD1Pos:       interpolate(lower.SD1Pos, upper.SD1Pos),
		SD2Pos:       interpolate(lower.SD2Pos, upper.SD2Pos),
		SD3Pos:       interpolate(lower.SD3Pos, upper.SD3Pos),
	}

	return &interpolated, nil
}

func (m *Main) CreateCatatanPertumbuhan(data *models.CatatanPertumbuhan) error {
	if err := m.postgres.Create(data).Error; err != nil {
		return customerror.NewInternalServiceError("gagal membuat catatan pertumbuhan")
	}
	return nil
}

func (m *Main) GetRiwayatPertumbuhanByAnakID(anakID uint) ([]models.CatatanPertumbuhan, error) {
	var result []models.CatatanPertumbuhan
	if err := m.postgres.Where("anak_id = ?", anakID).Order("tgl_ukur ASC").Find(&result).Error; err != nil {
		return nil, customerror.NewInternalServiceError("gagal mengambil riwayat pertumbuhan")
	}
	return result, nil
}

func (m *Main) GetCatatanPertumbuhanByID(id uint) (*models.CatatanPertumbuhan, error) {
	var result models.CatatanPertumbuhan
	err := m.postgres.Where("id = ?", id).First(&result).Error
	if err != nil {
		if err.Error() == constants.GORM_ERR_NOT_FOUND {
			return nil, customerror.NewNotFoundError("catatan pertumbuhan tidak ditemukan")
		}
		return nil, customerror.NewInternalServiceError("gagal mengambil catatan pertumbuhan")
	}
	return &result, nil
}

func (m *Main) UpdateCatatanPertumbuhan(data *models.CatatanPertumbuhan) error {
	if err := m.postgres.Save(data).Error; err != nil {
		return customerror.NewInternalServiceError("gagal mengubah catatan pertumbuhan")
	}
	return nil
}

func (m *Main) DeleteCatatanPertumbuhan(id uint) error {
	if err := m.postgres.Model(&models.CatatanPertumbuhan{}).Where("id = ?", id).Update("deleted_at", time.Now()).Error; err != nil {
		return customerror.NewInternalServiceError("gagal menghapus catatan pertumbuhan")
	}
	return nil
}

func (m *Main) GetMasterStandarByFilter(parameter, jenisKelamin string) ([]models.MasterStandarAntropometri, error) {
	var result []models.MasterStandarAntropometri
	q := m.postgres.Model(&models.MasterStandarAntropometri{})
	if parameter != "" {
		q = q.Where("parameter = ?", parameter)
	}
	if jenisKelamin != "" {
		q = q.Where("jenis_kelamin = ?", normalizeGender(jenisKelamin))
	}

	if err := q.Order("parameter ASC, jenis_kelamin ASC, nilai_sumbu_x ASC").Find(&result).Error; err != nil {
		return nil, customerror.NewInternalServiceError("gagal mengambil master standar antropometri")
	}

	return result, nil
}

func (m *Main) CreateMasterStandar(data *models.MasterStandarAntropometri) error {
	if err := m.postgres.Create(data).Error; err != nil {
		return customerror.NewInternalServiceError("gagal membuat master standar antropometri")
	}
	return nil
}
