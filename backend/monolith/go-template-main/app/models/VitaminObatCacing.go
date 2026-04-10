package models

import (
	"time"

	"gorm.io/gorm"
)

type VitaminAObatCacing struct {
	ID              int32          `json:"id" gorm:"primaryKey;autoIncrement"`
	KunjunganAnakID int32          `json:"kunjungan_anak_id" gorm:"not null;index"`
	KunjunganAnak   *KunjunganGizi `json:"kunjungan_anak,omitempty" gorm:"foreignKey:KunjunganAnakID"`
	VitABiru        bool           `json:"vit_a_biru" gorm:"type:bool;not null"`
	BulanvitABiru   int            `json:"bulan_vita_biru" gorm:"type:int;not null"`
	VitAMerah       bool           `json:"vit_a_merah" gorm:"type:bool;not null"`
	BulanVitAMerah  int            `json:"bulan_vit_a_merah" gorm:"type:int;not null"`
	ObatCacing      bool           `json:"obat_cacing" gorm:"type:bool;not null"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`
}

func (VitaminAObatCacing) TableName() string {
	return "vitamin_a_obat_cacing"
}

// func (V *VitaminAObatCacing) BeforeCreate(tx *gorm.DB) error {
// 	if V.ID == "" {
// 		V.ID = uuid.New().String()
// 	}
// 	return nil
// }
