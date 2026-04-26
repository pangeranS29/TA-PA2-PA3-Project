package models

import (
	"time"

	"gorm.io/gorm"
)

type KartuKeluarga struct {
	ID              int32          `json:"id" gorm:"primaryKey;autoIncrement"`
	NoKartuKeluarga string         `json:"no_kk" gorm:"type:varchar(20);not null;uniqueIndex"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`
	Kependudukan    []Kependudukan `json:"kependudukan,omitempty" gorm:"foreignKey:KartuKeluargaID;references:ID"`
}

func (KartuKeluarga) TableName() string {
	return "kartu_keluarga"
}
