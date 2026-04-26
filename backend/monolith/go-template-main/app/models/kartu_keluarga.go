package models

import (
	"time"

	"gorm.io/gorm"
)

type KartuKeluarga struct {
	ID        int32          `json:"id" gorm:"primaryKey;autoIncrement"`
	NoKK      string         `json:"no_kartu_keluarga" gorm:"type:varchar(16);uniqueIndex;not null"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt *time.Time     `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
	// Relasi ke Penduduk (1 KK banyak anggota)
	Penduduk []Kependudukan `json:"penduduk,omitempty" gorm:"foreignKey:KartuKeluargaID"`
}

func (KartuKeluarga) TableName() string {
	return "kartu_keluarga"
}
