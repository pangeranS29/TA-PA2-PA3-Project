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


//
// ====================== MODUL IBU ======================
//

func (r *GrafikEvaluasiKehamilanRepository) IsOwnedByUser(grafikID int32, userID int32) (bool, error) {
    var count int64

    err := r.db.
        Model(&models.GrafikEvaluasiKehamilan{}).
        Joins("JOIN kehamilan k ON k.id = grafik_evaluasi_kehamilan.kehamilan_id").
        Joins("JOIN ibu i ON i.id = k.ibu_id").
        Joins("JOIN penduduk pd ON pd.id = i.penduduk_id").
        Joins("JOIN pengguna u ON u.penduduk_id = pd.id").
        Where("grafik_evaluasi_kehamilan.id = ? AND u.id = ?", grafikID, userID).
        Count(&count).Error

    return count > 0, err
}

func (r *GrafikEvaluasiKehamilanRepository) FindMineByUserID(userID int32) ([]models.GrafikEvaluasiKehamilan, error) {
    var list []models.GrafikEvaluasiKehamilan

    err := r.db.
        Model(&models.GrafikEvaluasiKehamilan{}).
        Joins("JOIN kehamilan k ON k.id = grafik_evaluasi_kehamilan.kehamilan_id").
        Joins("JOIN ibu i ON i.id = k.ibu_id").
        Joins("JOIN penduduk pd ON pd.id = i.penduduk_id").
        Joins("JOIN pengguna u ON u.id = pd.id").
        Where("u.id = ?", userID).
        Order("grafik_evaluasi_kehamilan.usia_gestasi_minggu ASC, grafik_evaluasi_kehamilan.tanggal_bulan_tahun ASC").
        Find(&list).Error

    return list, err
}

func (r *GrafikEvaluasiKehamilanRepository) FindGrafikTFUByUserID(userID int32) ([]models.GrafikEvaluasiKehamilan, error) {
    var list []models.GrafikEvaluasiKehamilan

    err := r.db.
        Model(&models.GrafikEvaluasiKehamilan{}).
        Select("grafik_evaluasi_kehamilan.usia_gestasi_minggu, grafik_evaluasi_kehamilan.tinggi_fundus_uteri_cm").
        Joins("JOIN kehamilan k ON k.id = grafik_evaluasi_kehamilan.kehamilan_id").
        Joins("JOIN ibu i ON i.id = k.ibu_id").
        Joins("JOIN penduduk pd ON pd.id = i.penduduk_id").
        Joins("JOIN pengguna u ON u.id = pd.id").
        Where("u.id = ?", userID).
        Where("grafik_evaluasi_kehamilan.usia_gestasi_minggu IS NOT NULL").
        Where("grafik_evaluasi_kehamilan.tinggi_fundus_uteri_cm IS NOT NULL").
        Order("grafik_evaluasi_kehamilan.usia_gestasi_minggu ASC").
        Find(&list).Error

    return list, err
}

func (r *GrafikEvaluasiKehamilanRepository) FindGrafikDJJByUserID(userID int32) ([]models.GrafikEvaluasiKehamilan, error) {
    var list []models.GrafikEvaluasiKehamilan

    err := r.db.
        Model(&models.GrafikEvaluasiKehamilan{}).
        Select("grafik_evaluasi_kehamilan.usia_gestasi_minggu, grafik_evaluasi_kehamilan.denyut_jantung_bayi_x_menit").
        Joins("JOIN kehamilan k ON k.id = grafik_evaluasi_kehamilan.kehamilan_id").
        Joins("JOIN ibu i ON i.id = k.ibu_id").
        Joins("JOIN penduduk pd ON pd.id = i.penduduk_id").
        Joins("JOIN pengguna u ON u.id = pd.id").
        Where("u.id = ?", userID).
        Where("grafik_evaluasi_kehamilan.usia_gestasi_minggu IS NOT NULL").
        Where("grafik_evaluasi_kehamilan.denyut_jantung_bayi_x_menit IS NOT NULL").
        Order("grafik_evaluasi_kehamilan.usia_gestasi_minggu ASC").
        Find(&list).Error

    return list, err
}