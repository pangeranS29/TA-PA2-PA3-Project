package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PemeriksaanKehamilanRepository struct {
	db *gorm.DB
}

func NewPemeriksaanKehamilanRepository(db *gorm.DB) *PemeriksaanKehamilanRepository {
	return &PemeriksaanKehamilanRepository{db: db}
}

// ================= CREATE ==================== //

func (r *PemeriksaanKehamilanRepository) Create(p *models.PemeriksaanKehamilan) error {
	return r.db.Create(p).Error
}

// ================= READ ====================== //

func (r *PemeriksaanKehamilanRepository) FindByID(id int32) (*models.PemeriksaanKehamilan, error) {
	var p models.PemeriksaanKehamilan

	err := r.db.
		Preload("Kehamilan").
		Preload("Kehamilan.Ibu").
		Preload("Kehamilan.Ibu.Kependudukan").
		First(&p, id).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("data pemeriksaan tidak ditemukan")
		}
		return nil, err
	}

	return &p, nil
}

func (r *PemeriksaanKehamilanRepository) FindByKehamilanID(kehamilanID int32) ([]models.PemeriksaanKehamilan, error) {
	var list []models.PemeriksaanKehamilan

	err := r.db.
		Where("kehamilan_id = ?", kehamilanID).
		Order("tanggal_periksa ASC").
		Find(&list).Error

	if err != nil {
		return nil, err
	}

	return list, nil
}
// ================= UPDATE ==================== //

func (r *PemeriksaanKehamilanRepository) Update(p *models.PemeriksaanKehamilan) error {
	result := r.db.Save(p)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("gagal update, data tidak ditemukan")
	}

	return nil
}

// ================= DELETE ==================== //

func (r *PemeriksaanKehamilanRepository) Delete(id int32) error {
	result := r.db.Delete(&models.PemeriksaanKehamilan{}, id)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("data pemeriksaan kehamilan tidak ditemukan")
	}

	return nil
}

// ============ OPTIONAL (ADVANCED) ============ //

// Ambil kunjungan terakhir (penting untuk dashboard & risk terbaru)
func (r *PemeriksaanKehamilanRepository) FindLatestByKehamilanID(kehamilanID int32) (*models.PemeriksaanKehamilan, error) {
	var p models.PemeriksaanKehamilan

	err := r.db.
		Where("kehamilan_id = ?", kehamilanID).
		Order("tanggal_periksa DESC").
		First(&p).Error

	if err != nil {
		return nil, err
	}

	return &p, nil
}
