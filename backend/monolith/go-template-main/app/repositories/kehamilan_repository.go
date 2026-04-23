package repositories

import (
	"errors"
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

type KehamilanRepository struct {
	db *gorm.DB
}

func NewKehamilanRepository(db *gorm.DB) *KehamilanRepository {
	return &KehamilanRepository{db: db}
}

func (r *KehamilanRepository) Create(kehamilan *models.Kehamilan) error {
	return r.db.Create(kehamilan).Error
}

func (r *KehamilanRepository) FindByID(id int32) (*models.Kehamilan, error) {
	var kehamilan models.Kehamilan
	err := r.db.Preload("Ibu.Penduduk").First(&kehamilan, id).Error
	return &kehamilan, err
}

func (r *KehamilanRepository) FindByIbuID(ibuID int32) ([]models.Kehamilan, error) {
	var list []models.Kehamilan
	err := r.db.Where("ibu_id = ?", ibuID).Order("created_at DESC").Find(&list).Error
	return list, err
}

func (r *KehamilanRepository) GetAll() ([]models.Kehamilan, error) {
	var list []models.Kehamilan
	err := r.db.Preload("Ibu.Penduduk").Find(&list).Error
	return list, err
}

func (r *KehamilanRepository) Update(kehamilan *models.Kehamilan) error {
	return r.db.Save(kehamilan).Error
}

func (r *KehamilanRepository) Delete(id int32) error {
	result := r.db.Delete(&models.Kehamilan{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("data kehamilan tidak ditemukan")
	}
	return nil
}

func (r *KehamilanRepository) GetKehamilanAktifWithIbu() ([]models.Kehamilan, error) {
	var kehamilan []models.Kehamilan
	oneYearAgo := time.Now().AddDate(-1, 0, 0)
	err := r.db.
		Where("hpht >= ?", oneYearAgo).
		Where("status_kehamilan = ?", "Aktif").
		Preload("Ibu").
		Preload("Ibu.Penduduk").
		Find(&kehamilan).Error
	return kehamilan, err
}
