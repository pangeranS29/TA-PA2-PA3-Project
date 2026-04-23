package models

import (
	"time"

	"gorm.io/gorm"
)

type Anak struct {
	ID int32 `gorm:"primaryKey" json:"id"`

	KehamilanID int32      `gorm:"not null;index" json:"kehamilan_id"`
	Kehamilan   *Kehamilan `gorm:"constraint:OnDelete:CASCADE;" json:"kehamilan,omitempty"`

	PendudukID int32     `gorm:"not null;index" json:"penduduk_id"`
	Penduduk   *Penduduk `gorm:"foreignKey:PendudukID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;" json:"penduduk,omitempty"`

	BeratLahir  float64 `gorm:"type:numeric(5,2);not null;check:berat_lahir > 0"`
	TinggiLahir float64 `gorm:"type:numeric(5,2);not null;check:tinggi_lahir > 0"`

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

func (Anak) TableName() string {
	return "anak"
}
