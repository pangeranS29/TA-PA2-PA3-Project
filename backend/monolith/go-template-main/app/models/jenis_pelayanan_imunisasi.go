package models

import (
	"time"

	"gorm.io/gorm"
)

type JenisPelayananImunisasi struct {
	ID               int32           `json:"id" gorm:"primaryKey;autoIncrement"`
	JenisPelayananID int32           `json:"jenis_pelayanan_id" gorm:"not null;index"`
	JenisPelayanan   *JenisPelayanan `json:"jenis_pelayanan,omitempty" gorm:"foreignKey:JenisPelayananID"`
	BulanKe          int             `json:"bulan_ke" gorm:"not null"`
	CreatedAt        time.Time       `json:"created_at"`
	UpdatedAt        time.Time       `json:"updated_at"`
	DeletedAt        gorm.DeletedAt  `json:"-" gorm:"index"`
}

func (JenisPelayananImunisasi) TableName() string {
	return "jenis_pelayanan_imunisasi"
}

// func (k *JenisPelayananImunisasi) BeforeCreate(tx *gorm.DB) error {
// 	if k.ID == "" {
// 		k.ID = uuid.New().String()
// 	}
// 	return nil
// }
