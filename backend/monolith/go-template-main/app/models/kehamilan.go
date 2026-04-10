package models

import (
	"time"

	"gorm.io/gorm"
)

type Kehamilan struct {
	ID                       int32          `json:"id" gorm:"primaryKey;autoIncrement"`
	IbuID                    int32          `json:"ibu_id" gorm:"not null;index"`
	Gravida                  int32          `json:"gravida,omitempty"`
	Paritas                  int32          `json:"paritas,omitempty"`
	Abortus                  int32          `json:"abortus,omitempty"`
	HPHT                     time.Time      `json:"hpht,omitempty"`
	TaksiranPersalinan       time.Time      `json:"taksiran_persalinan,omitempty"`
	UKKehamilanSaatIni       int32          `json:"uk_kehamilan_saat_ini,omitempty"`
	JarakKehamilanSebelumnya int32          `json:"jarak_kehamilan_sebelumnya,omitempty"`
	StatusKehamilan          string         `json:"status_kehamilan,omitempty"`
	CreatedAt                time.Time      `json:"created_at"`
	UpdatedAt                time.Time      `json:"updated_at"`
	DeletedAt                gorm.DeletedAt `json:"-" gorm:"index"`

	// relasi
	Anak []Anak `json:"anak,omitempty" gorm:"foreignKey:KehamilanID"`
}

func (Kehamilan) TableName() string { return "kehamilan" }

// func (k *Kehamilan) BeforeCreate(tx *gorm.DB) error {
// 	if k.IDKehamilan == "" {
// 		k.IDKehamilan = uuid.New().String()
// 	}
// 	return nil
// }
