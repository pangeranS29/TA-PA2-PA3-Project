package models

import (
	"time"

	"gorm.io/gorm"
)

// Anak merepresentasikan data anak yang terdaftar oleh pengguna.
type Anak struct {
	ID            int32          `json:"id" gorm:"primaryKey;autoIncrement"`
	KehamilanID   int32          `json:"kehamilan_id" gorm:"not null;index"`
	Kehamilan     *Kehamilan     `json:"kehamilan,omitempty" gorm:"foreignKey:KehamilanID"`
	Nama          string         `json:"nama" gorm:"not null"`
	TanggalLahir  time.Time      `json:"tanggal_lahir" gorm:"not null"`
	JenisKelamin  string         `json:"jenis_kelamin" gorm:"not null"` // "laki-laki" | "perempuan"
	BeratLahirKg  *float64       `json:"berat_lahir_kg,omitempty"`
	GolonganDarah *string        `json:"golongan_darah,omitempty"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
}

func (Anak) TableName() string { return "anak" }

// func (a *Anak) BeforeCreate(tx *gorm.DB) error {
// 	if a.ID == "" {
// 		a.ID = uuid.New().String()
// 	}
// 	return nil
// }
