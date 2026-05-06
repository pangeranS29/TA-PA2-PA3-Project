package models

import (
	"time"

	"gorm.io/gorm"
)

type KategoriCapaian struct {
	ID          uint   `gorm:"primaryKey;column:id" db:"id" json:"id"`
	RentangUsia string `gorm:"column:rentang_usia" db:"rentang_usia" json:"rentang_usia,omitempty"`
	// TipeLembarCapaian  string         `gorm:"column:tipe_lembar_capaian" db:"tipe_lembar_capaian" json:"tipe_lembar_capaian,omitempty"`
	PertanyaaanCeklist string         `gorm:"column:pertanyaan_ceklist" db:"pertanyaan_ceklist" json:"pertanyaan_ceklist,omitempty"`
	Aspek              string         `gorm:"column:aspek" db:"aspek" json:"aspek,omitempty"`
	CreatedAt          time.Time      `gorm:"column:created_at" db:"created_at" json:"created_at"`
	UpdatedAt          time.Time      `gorm:"column:updated_at" db:"updated_at" json:"updated_at"`
	DeletedAt          gorm.DeletedAt `gorm:"column:deleted_at;index" json:"-"`
}

func (KategoriCapaian) TableName() string {
	return "kategori_capaian"
}
