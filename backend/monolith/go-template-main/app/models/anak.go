package models

import (
	"time"

	"gorm.io/gorm"
)

type Anak struct {
	ID            int32          `gorm:"primaryKey;autoIncrement" json:"id"`
	KehamilanID   int32          `json:"kehamilan_id" gorm:"not null;index;constraint:OnDelete:CASCADE"`
	Kehamilan     *Kehamilan     `json:"kehamilan,omitempty" gorm:"foreignKey:KehamilanID;constraint:OnDelete:CASCADE"`
	Nama          string         `json:"nama" gorm:"not null"`
	TanggalLahir  time.Time      `json:"tanggal_lahir" gorm:"not null"`
	JenisKelamin  string         `json:"jenis_kelamin" gorm:"not null"`
	BeratLahirKg  *float64       `json:"berat_lahir_kg,omitempty"`
	GolonganDarah *string        `json:"golongan_darah,omitempty"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
}

func (Anak) TableName() string { return "anak" }
