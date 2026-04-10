package models

import (
	"time"

	"gorm.io/gorm"
)

type KehadiranImunisasi struct {
	ID                int32                    `json:"id" gorm:"primaryKey;autoIncrement"`
	KunjunganAnakID   int32                    `json:"kunjungan_anak_id" gorm:"not null;index"`
	KunjunganAnak     *KunjunganGizi           `json:"kunjungan_anak,omitempty" gorm:"foreignKey:KunjunganAnakID"`
	JenisPelayananID  int32                    `json:"jenis_pelayanan_id" gorm:"not null;index"`
	JenisPelayanan    *JenisPelayananImunisasi `json:"jenis_pelayanan,omitempty" gorm:"foreignKey:JenisPelayananID"`
	Bulanke           int                      `json:"bulan" gorm:"not null"`
	Tanggal           time.Time                `json:"tanggal" gorm:"not null"`
	TenagaKesehatanID int32                    `json:"tenaga_kesehatan_id" gorm:"not null;index"`
	TenagaKesehatan   *User                    `json:"tenaga_kesehatan,omitempty" gorm:"foreignKey:TenagaKesehatanID"`
	Lokasi            string                   `json:"lokasi" gorm:"not null"`
	CreatedAt         time.Time                `json:"created_at"`
	UpdatedAt         time.Time                `json:"updated_at"`
	DeletedAt         gorm.DeletedAt           `json:"-" gorm:"index"`
}

func (KehadiranImunisasi) TableName() string {
	return "kehadiran_imunisasi"
}

// func (k *KehadiranImunisasi) BeforeCreate(tx *gorm.DB) error {
// 	if k.ID == "" {
// 		k.ID = uuid.New().String()
// 	}
// 	return nil
// }
