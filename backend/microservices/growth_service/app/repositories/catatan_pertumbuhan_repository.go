package repositories

import (
	"context"
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

type CatatanPertumbuhanRepository struct {
	db *gorm.DB
}

func NewCatatanPertumbuhanRepository(db *gorm.DB) *CatatanPertumbuhanRepository {
	return &CatatanPertumbuhanRepository{db: db}
}

func (r *CatatanPertumbuhanRepository) Create(ctx context.Context, catatan *models.CatatanPertumbuhan) error {
	return r.db.WithContext(ctx).Create(catatan).Error
}

func (r *CatatanPertumbuhanRepository) FindByID(ctx context.Context, id int) (*models.CatatanPertumbuhan, error) {
	var catatan models.CatatanPertumbuhan
	err := r.db.WithContext(ctx).First(&catatan, id).Error
	if err != nil {
		return nil, err
	}
	return &catatan, nil
}

func (r *CatatanPertumbuhanRepository) FindByAnakID(ctx context.Context, anakID int, page, pageSize int) ([]models.CatatanPertumbuhan, int64, error) {
	var catatanList []models.CatatanPertumbuhan
	var total int64

	query := r.db.WithContext(ctx).Model(&models.CatatanPertumbuhan{}).Where("anak_id = ?", anakID)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	err := query.
		Offset(offset).
		Limit(pageSize).
		Order("tgl_ukur DESC").
		Find(&catatanList).Error

	return catatanList, total, err
}

func (r *CatatanPertumbuhanRepository) FindByAnakIDAndDateRange(ctx context.Context, anakID int, startDate, endDate time.Time) ([]models.CatatanPertumbuhan, error) {
	var catatanList []models.CatatanPertumbuhan
	err := r.db.WithContext(ctx).
		Where("anak_id = ? AND tgl_ukur BETWEEN ? AND ?", anakID, startDate, endDate).
		Order("tgl_ukur ASC").
		Find(&catatanList).Error
	return catatanList, err
}

func (r *CatatanPertumbuhanRepository) FindLatestByAnakID(ctx context.Context, anakID int) (*models.CatatanPertumbuhan, error) {
	var catatan models.CatatanPertumbuhan
	err := r.db.WithContext(ctx).
		Where("anak_id = ?", anakID).
		Order("tgl_ukur DESC").
		First(&catatan).Error
	if err != nil {
		return nil, err
	}
	return &catatan, nil
}

func (r *CatatanPertumbuhanRepository) Update(ctx context.Context, catatan *models.CatatanPertumbuhan) error {
	return r.db.WithContext(ctx).Save(catatan).Error
}

func (r *CatatanPertumbuhanRepository) Delete(ctx context.Context, id int) error {
	return r.db.WithContext(ctx).Delete(&models.CatatanPertumbuhan{}, id).Error
}
