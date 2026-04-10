package models

import (
	"time"

	"gorm.io/gorm"
)

type MPASI struct {
	ID                  int32          `json:"id" gorm:"primaryKey;type:autoIncrement"`
	KunjunganAnakID     int32          `json:"kunjungan_anak_id" gorm:"not null;index"`
	KunjunganAnak       *KunjunganGizi `json:"kunjungan_anak,omitempty" gorm:"foreignKey:KunjunganAnakID"`
	DiberikanMPASI      bool           `json:"diberikan_mp_asi" gorm:"type:bool;not null"`
	VariasiBeras        bool           `json:"variasi_beras" gorm:"type:bool;not null"`
	LaukProtein         bool           `json:"lauk_protein" gorm:"type:bool;not null"`
	Minyak              bool           `json:"minyak" gorm:"type:bool;not null"`
	Sayur               bool           `json:"sayur" gorm:"type:bool;not null"`
	Buah                bool           `json:"buah" gorm:"type:bool;not null"`
	Lainnya             string         `json:"lainnya"`
	JumlahmakanPerporsi string         `json:"jumlah_makan_perporsi" gorm:"not null"`   //misal "1 mangkuk / 2 sdm"
	FrekuensiMakan      string         `json:"frekuensi_makan_perhari" gorm:"not null"` // misal "3x utama, 2x selingan"
	CreatedAt           time.Time      `json:"created_at"`
	UpdatedAt           time.Time      `json:"updated_at"`
	DeletedAt           gorm.DeletedAt `json:"-" gorm:"index"`
}

func (MPASI) TableName() string {
	return "mp_asi"
}

// func (M *MPASI) BeforeCreate(tx *gorm.DB) error {
// 	if M.ID == "" {
// 		M.ID = uuid.New().String()
// 	}
// 	return nil
// }
