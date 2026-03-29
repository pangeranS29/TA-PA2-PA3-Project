package repositories

import (
	"context"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type MasterStandarRepository struct {
	db *gorm.DB
}

func NewMasterStandarRepository(db *gorm.DB) *MasterStandarRepository {
	return &MasterStandarRepository{db: db}
}

func (r *MasterStandarRepository) FindAll(ctx context.Context) ([]models.MasterStandarAntropometri, error) {
	var standards []models.MasterStandarAntropometri
	err := r.db.WithContext(ctx).Find(&standards).Error
	return standards, err
}

func (r *MasterStandarRepository) FindByParameter(ctx context.Context, parameter string, jenisKelamin models.GenderType, nilaiSumbuX float64) (*models.MasterStandarAntropometri, error) {
	var standard models.MasterStandarAntropometri
	err := r.db.WithContext(ctx).
		Where("parameter = ? AND jenis_kelamin = ? AND nilai_sumbu_x = ?", parameter, jenisKelamin, nilaiSumbuX).
		First(&standard).Error
	if err != nil {
		return nil, err
	}
	return &standard, nil
}

func (r *MasterStandarRepository) FindByParameterRange(ctx context.Context, parameter string, jenisKelamin models.GenderType, minX, maxX float64) ([]models.MasterStandarAntropometri, error) {
	var standards []models.MasterStandarAntropometri
	err := r.db.WithContext(ctx).
		Where("parameter = ? AND jenis_kelamin = ? AND nilai_sumbu_x BETWEEN ? AND ?", parameter, jenisKelamin, minX, maxX).
		Order("nilai_sumbu_x ASC").
		Find(&standards).Error
	return standards, err
}
