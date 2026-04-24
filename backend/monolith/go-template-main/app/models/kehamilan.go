package models

import (
	"time"

	"gorm.io/gorm"
)

type Kehamilan struct {
	ID                       int32          `gorm:"primaryKey;autoIncrement" json:"id"`
	IbuID                    int32          `gorm:"not null;index" json:"ibu_id"`
	Ibu                      *Ibu           `gorm:"foreignKey:IbuID;references:ID" json:"ibu,omitempty"`
	HPHT                     *time.Time     `gorm:"type:date" json:"hpht,omitempty"`
	TaksiranPersalinan       *time.Time     `gorm:"type:date" json:"taksiran_persalinan,omitempty"`
	UKKehamilanSaatIni       *int32         `json:"uk_kehamilan_saat_ini,omitempty"`
	JarakKehamilanSebelumnya *int32         `json:"jarak_kehamilan_sebelumnya,omitempty"`
	StatusKehamilan          string         `json:"status_kehamilan,omitempty"`
	CreatedAt                time.Time      `json:"created_at"`
	UpdatedAt                time.Time      `json:"updated_at"`
	DeletedAt                gorm.DeletedAt `json:"-"`
}

func (Kehamilan) TableName() string { return "kehamilan" }
