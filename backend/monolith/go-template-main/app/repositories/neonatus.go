package repositories

import (
	"monitoring-service/app/models"
	"time"
)

type PelayananNeonatusRepository interface {
	Create(data *models.Neonatus) error
	GetByAnakID(anakID int32) ([]models.Neonatus, error)
	GetByID(id int32) (*models.Neonatus, error)
	GetAll() ([]models.Neonatus, error)
	Update(id int32, req models.UpdatePelayananNeonatusRequest, tanggal time.Time, now time.Time) error
	Delete(id int32) error
}

// type PelayananNeonatusRepository struct {
// 	db *gorm.DB
// }

// func NewPelayananNeonatusRepository(db *gorm.DB) PelayananNeonatusRepository {
// 	return &PelayananNeonatusRepository{db: db}
// }
