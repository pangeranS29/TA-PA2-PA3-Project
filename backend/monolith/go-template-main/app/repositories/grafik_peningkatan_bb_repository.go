package repositories

import (
	"errors"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type GrafikPeningkatanBBRepository struct {
	db *gorm.DB
}

func NewGrafikPeningkatanBBRepository(db *gorm.DB) *GrafikPeningkatanBBRepository {
	return &GrafikPeningkatanBBRepository{db: db}
}

//
// CREATE
//
func (r *GrafikPeningkatanBBRepository) Create(g *models.GrafikPeningkatanBB) error {
	return r.db.Create(g).Error
}

//
// FIND BY ID
//
func (r *GrafikPeningkatanBBRepository) FindByID(id int32) (*models.GrafikPeningkatanBB, error) {
	var g models.GrafikPeningkatanBB

	err := r.db.
		Preload("Kehamilan").
		First(&g, id).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("data grafik tidak ditemukan")
		}
		return nil, err
	}

	return &g, nil
}

//
// FIND BY KEHAMILAN ID (UNTUK GRAFIK)
//
func (r *GrafikPeningkatanBBRepository) FindByKehamilanID(kehamilanID int32) ([]models.GrafikPeningkatanBB, error) {
	var list []models.GrafikPeningkatanBB

	err := r.db.
		Where("kehamilan_id = ?", kehamilanID).
		Order("minggu_kehamilan ASC").
		Find(&list).Error

	return list, err
}

//
// 🔥 CEK DUPLIKAT MINGGU (PENTING)
//
func (r *GrafikPeningkatanBBRepository) FindByKehamilanIDAndMinggu(kehamilanID int32, minggu int) (*models.GrafikPeningkatanBB, error) {
	var g models.GrafikPeningkatanBB

	err := r.db.
		Where("kehamilan_id = ? AND minggu_kehamilan = ?", kehamilanID, minggu).
		First(&g).Error

	if err != nil {
		return nil, err
	}

	return &g, nil
}

//
// UPDATE
//
func (r *GrafikPeningkatanBBRepository) Update(g *models.GrafikPeningkatanBB) error {
	return r.db.Save(g).Error
}

//
// DELETE
//
func (r *GrafikPeningkatanBBRepository) Delete(id int32) error {
	result := r.db.Delete(&models.GrafikPeningkatanBB{}, id)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("data grafik peningkatan berat badan tidak ditemukan")
	}

	return nil
}