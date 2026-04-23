package models

import (
	"time"

	"gorm.io/gorm"
)

type KartuKeluarga struct {
	ID int32 `gorm:"primaryKey"`

	NoKK string `gorm:"type:varchar(16);uniqueIndex;not null"`

	CreatedAt time.Time      `gorm:"not null" json:"created_at"`
	UpdatedAt *time.Time     `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	// Relasi ke Penduduk (1 KK banyak anggota)
	Penduduk []Penduduk `gorm:"foreignKey:KartuKeluargaID"`
}

func (KartuKeluarga) TableName() string {
	return "kartu_keluarga"
}
