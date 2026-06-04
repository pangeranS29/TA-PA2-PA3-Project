package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

// AnakRepository menangani operasi database untuk entitas Anak.
type AnakRepository struct {
	db *gorm.DB
}

func NewAnakRepository(db *gorm.DB) *AnakRepository {
	return &AnakRepository{db: db}
}

func (r *AnakRepository) Create(anak *models.Anak) error {
	return r.db.Create(anak).Error
}

func (r *AnakRepository) FindByKehamilanID(kehamilanID int32) ([]models.Anak, error) {
	var list []models.Anak
	err := r.db.
		Preload("Penduduk").
		Preload("Kehamilan.Ibu.Kependudukan").
		Where("kehamilan_id = ?", kehamilanID).
		Order("created_at ASC").
		Find(&list).Error
	if err == nil {
		r.populateStatusPrediksiSlice(list)
	}
	return list, err
}
func (r *AnakRepository) FindAll() ([]models.Anak, error) {
	var list []models.Anak

	err := r.db.
		Preload("Penduduk").
		Preload("Kehamilan.Ibu.Kependudukan").
		Find(&list).Error
	if err != nil {
		return nil, err
	}
	r.populateStatusPrediksiSlice(list)
	return list, nil
}

// FindAllByDesaID mengambil data anak yang penduduknya berada di desa tertentu.
// Menggunakan JOIN ke tabel penduduk agar query efisien (filter di level DB, bukan di Go).
func (r *AnakRepository) FindAllByDesaID(desaID int32) ([]models.Anak, error) {
	var list []models.Anak

	err := r.db.
		Joins("JOIN penduduk ON penduduk.id = anak.penduduk_id").
		Where("penduduk.desa_id = ?", desaID).
		Preload("Penduduk").
		Preload("Kehamilan.Ibu.Kependudukan").
		Find(&list).Error
	if err != nil {
		return nil, err
	}
	r.populateStatusPrediksiSlice(list)
	return list, nil
}

func (r *AnakRepository) FindByID(id int32) (*models.Anak, error) {
	var anak models.Anak
	err := r.db.
		Preload("Penduduk").
		Preload("Kehamilan.Ibu.Kependudukan").
		Where("id = ?", id).
		First(&anak).Error
	if err != nil {
		return nil, err
	}
	r.populateStatusPrediksi(&anak)
	return &anak, nil
}

func (r *AnakRepository) FindByIDAndPenggunaID(id, penggunaID int32) (*models.Anak, error) {
	var anak models.Anak
	err := r.db.
		Preload("Penduduk").
		Preload("Kehamilan.Ibu.Kependudukan").
		Where("id = ? AND pengguna_id = ?", id, penggunaID).
		First(&anak).Error
	if err != nil {
		return nil, err
	}
	r.populateStatusPrediksi(&anak)
	return &anak, nil
}

func (r *AnakRepository) populateStatusPrediksi(anak *models.Anak) {
	if anak == nil {
		return
	}
	var status string
	err := r.db.Table("prediksi_stunting").
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

func (r *AnakRepository) populateStatusPrediksiSlice(list []models.Anak) {
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

	err := r.db.Table("prediksi_stunting").
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

func (r *AnakRepository) Update(anak *models.Anak) error {
	return r.db.Save(anak).Error
}

func (r *AnakRepository) Delete(id int32) error {
	result := r.db.Where("id = ?", id).Delete(&models.Anak{})

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("Data Anak tidak ditemukan ")
	}
	return nil
}
