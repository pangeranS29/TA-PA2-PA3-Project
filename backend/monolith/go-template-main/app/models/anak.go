package models

import (
	"time"

	"gorm.io/gorm"
)

type Anak struct {
	ID          int32          `gorm:"primaryKey;autoIncrement" json:"id"`
	KehamilanID int32          `gorm:"not null;index" json:"kehamilan_id"`
	Kehamilan   *Kehamilan     `gorm:"foreignKey:KehamilanID;references:ID" json:"kehamilan,omitempty"`
	BeratLahir  *float64       `json:"berat_lahir,omitempty"`
	TinggiLahir *float64       `json:"tinggi_lahir,omitempty"`
	PendudukID  *int64         `json:"penduduk_id,omitempty"`
	Penduduk    *Penduduk      `gorm:"foreignKey:PendudukID;references:ID" json:"penduduk,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-"`
}

func (Anak) TableName() string { return "anak" }
