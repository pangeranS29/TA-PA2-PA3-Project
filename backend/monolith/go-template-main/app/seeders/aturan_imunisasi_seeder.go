package seeders

import (
	// "log"
	// "time"

	// "monitoring-service/app/models"

	"gorm.io/gorm"
)

type AturanImunisasiSeeder struct {
	db *gorm.DB
}

func NewAturanImunisasiSeeder(db *gorm.DB) *AturanImunisasiSeeder {
	return &AturanImunisasiSeeder{db: db}
}

