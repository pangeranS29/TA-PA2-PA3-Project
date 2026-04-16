package models

import (
	"time"
)

type RiwayatKehamilan struct {
	IdRiwayatKehamilan       uint      `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	FKIdIbu                  uint      `gorm:"column:id_ibu" json:"id_ibu"`
	Tahun                    uint16    `gorm:"column:tahun" json:"tahun"`
	ProsesMelahirkan         string    `gorm:"column:proses_melahirkan;type:text;not null" json:"proses_melahirkan"`
	PenolongProsesMelahirkan string    `gorm:"column:penolong_proses_melahirkan;type:varchar(255);not null" json:"penolong_proses_melahirkan"`
	Masalah                  string    `gorm:"column:masalah;type:text" json:"masalah"`
	CreatedAt                time.Time `gorm:"column:created_at;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt                time.Time `gorm:"column:updated_at" json:"updated_at"`

	// Relationship
	Ibu Ibu `gorm:"foreignKey:FKIdIbu ;references:IdIbu" json:"ibu,omitempty"`
}

func (RiwayatKehamilan) TableName() string {
	return "riwayat_kehamilan"
}
