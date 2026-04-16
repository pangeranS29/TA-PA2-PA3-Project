package models

import "time"

type Ibu struct {
	IDIbu          int32 `gorm:"primaryKey;autoIncrement" json:"id_ibu"`
	IDKependudukan int32 `gorm:"not null;uniqueIndex" json:"id_kependudukan"`
	// Kependudukan   *Kependudukan `gorm:"foreignKey:IDKependudukan;references:IDKependudukan" json:"kependudukan"`
	// tambahan field khusus ibu jika ada
	StatusKehamilan string     `json:"status_kehamilan"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
	IsDeleted       *time.Time `json:"is_deleted,omitempty"`
}

func (Ibu) TableName() string { return "ibu" }
