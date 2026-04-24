package models

import "time"

type KartuKeluarga struct {
	ID            int64      `gorm:"primaryKey;autoIncrement" json:"id"`
	NoKK          string     `gorm:"uniqueIndex;size:20;not null" json:"no_kk"`
	IDUser        *int32     `gorm:"index" json:"id_user,omitempty"`
	User          *User      `gorm:"foreignKey:IDUser;references:ID" json:"user,omitempty"`
	TanggalTerbit *time.Time `json:"tanggal_terbit"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
	IsDeleted     *time.Time `json:"is_deleted,omitempty"`
}

func (KartuKeluarga) TableName() string { return "kartu_keluarga" }
