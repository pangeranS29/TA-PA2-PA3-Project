package models

import (
	"time"

	"gorm.io/gorm"
)

type ASI struct {
	ID                int32          `json:"id" gorm:"primaryKey;autoIncrement"`
	KunjunganAnakID   int32          `json:"kunjungan_anak_id" gorm:"not null;index"`
	KunjunganAnak     *KunjunganGizi `json:"kunjungan_anak,omitempty" gorm:"foreignKey:KunjunganAnakID"`
	FrekuensiMenyusui int            `json:"frekuensi" gorm:"not null"`
	PosisiMenyusui    string         `json:"posisi" gorm:"not null"`
	ASIPerah          int            `json:"asiperah" gorm:"type:bool;not null"`
	CreatedAt         time.Time      `json:"created_at"`
	UpdatedAt         time.Time      `json:"updated_at"`
	DeletedAt         gorm.DeletedAt `json:"-" gorm:"index"`
}

func (ASI) TableName() string {
	return "Pelayanan_Asi"
}

// func (A *ASI) BeforeCreate(tx *gorm.DB) error {
// 	if A.ID == "" {
// 		A.ID = uuid.New().String()
// 	}
// 	return nil
// }
