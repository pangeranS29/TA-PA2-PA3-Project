package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type GrafikEvaluasiKehamilanRepository struct {
	db *gorm.DB
}

func NewGrafikEvaluasiKehamilanRepository(db *gorm.DB) *GrafikEvaluasiKehamilanRepository {
	return &GrafikEvaluasiKehamilanRepository{db: db}
}

//
// ====================== CREATE ======================
//
func (r *GrafikEvaluasiKehamilanRepository) Create(g *models.GrafikEvaluasiKehamilan) error {
	return r.db.Create(g).Error
}

//
// ====================== FIND BY ID ======================
//
func (r *GrafikEvaluasiKehamilanRepository) FindByID(id int32) (*models.GrafikEvaluasiKehamilan, error) {
	var g models.GrafikEvaluasiKehamilan

	err := r.db.
		Preload("Kehamilan.Ibu.Kependudukan").
		First(&g, id).Error

	if err != nil {
		return nil, err
	}

	return &g, nil
}

//
// ====================== FIND BY KEHAMILAN ======================
//
func (r *GrafikEvaluasiKehamilanRepository) FindByKehamilanID(kehamilanID int32) ([]models.GrafikEvaluasiKehamilan, error) {
	var list []models.GrafikEvaluasiKehamilan

	err := r.db.
		Where("kehamilan_id = ?", kehamilanID).
		Order("usia_gestasi_minggu ASC, tanggal_bulan_tahun ASC").
		Find(&list).Error

	return list, err
}

//
// ====================== UPDATE ======================
//
func (r *GrafikEvaluasiKehamilanRepository) Update(g *models.GrafikEvaluasiKehamilan) error {

	result := r.db.Model(&models.GrafikEvaluasiKehamilan{}).
		Where("id = ?", g.ID).
		Updates(g)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("data grafik evaluasi kehamilan tidak ditemukan")
	}

	return nil
}

//
// ====================== DELETE ======================
//
func (r *GrafikEvaluasiKehamilanRepository) Delete(id int32) error {

	result := r.db.Delete(&models.GrafikEvaluasiKehamilan{}, id)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("data grafik evaluasi kehamilan tidak ditemukan")
	}

	return nil
}

//
// ====================== TFU GRAPH DATA ======================
//
func (r *GrafikEvaluasiKehamilanRepository) FindGrafikTFU(kehamilanID int32) ([]models.GrafikEvaluasiKehamilan, error) {
	var list []models.GrafikEvaluasiKehamilan

	err := r.db.
		Select("usia_gestasi_minggu, tinggi_fundus_uteri_cm").
		Where("kehamilan_id = ?", kehamilanID).
		Where("usia_gestasi_minggu IS NOT NULL").
		Where("tinggi_fundus_uteri_cm IS NOT NULL").
		Order("usia_gestasi_minggu ASC").
		Find(&list).Error

	return list, err
}

//
// ====================== DJJ GRAPH DATA (FIXED) ======================
//
func (r *GrafikEvaluasiKehamilanRepository) FindGrafikDJJ(kehamilanID int32) ([]models.GrafikEvaluasiKehamilan, error) {
	var list []models.GrafikEvaluasiKehamilan

	err := r.db.
		Select("usia_gestasi_minggu, denyut_jantung_bayi_x_menit").
		Where("kehamilan_id = ?", kehamilanID).
		Where("usia_gestasi_minggu IS NOT NULL").
		Where("denyut_jantung_bayi_x_menit IS NOT NULL").
		Order("usia_gestasi_minggu ASC").
		Find(&list).Error

	return list, err
}