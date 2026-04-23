package models

import (
	"time"

	"gorm.io/gorm"
)

type Penimbangan struct {
	ID            int32          `gorm:"primaryKey;autoIncrement"`
	AnakID        int32          `gorm:"not null;index"`
	Anak          Anak           `gorm:"foreignKey:AnakID"`
	Tanggal       time.Time      `gorm:"type:date;not null"`
	UmurBulan     int            `gorm:"not null"`
	BeratBadan    float64        `gorm:"type:decimal(5,2)"`
	TinggiBadan   float64        `gorm:"type:decimal(5,2)"`
	LingkarKepala float64        `gorm:"type:decimal(5,2)"`
	LILA          float64        `gorm:"type:decimal(5,2)"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
}
