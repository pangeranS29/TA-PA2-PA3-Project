package models

import "time"

type Kebabura struct {
	NoKKID        int32          `gorm:"primaryKey;not null" json:"no_kk_id"` // satu KK punya satu data kependudukan
	KartuKeluarga *KartuKeluarga `gorm:"foreignKey:NoKKID;references:ID" json:"kartu_keluarga"`
	NoKK          string         `gorm:"primaryKey;type:varchar(20)" json:"no_kk"`
	IDUser        int32          `gorm:"not null;uniqueIndex" json:"id_user"` // satu user punya satu KK
	User          User           `gorm:"foreignKey:IDUser;references:ID" json:"user"`
	TanggalTerbit *time.Time     `gorm:"type:date" json:"tanggal_terbit"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	IsDeleted     *time.Time     `json:"is_deleted,omitempty"`
}

func (Kebabura) TableName() string { return "kebabura" }
