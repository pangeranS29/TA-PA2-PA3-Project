package models

import "time"

// Ibu represents mother/pregnant woman data in the system
// IMPORTANT: Removed uniqueIndex from IDKependudukan to allow multiple pregnancies per person
// (One person can have multiple pregnancies in different years)
type Ibu struct {
	IDIbu           int32         `gorm:"primaryKey;column:id;autoIncrement" json:"id_ibu"`
	IDKependudukan  int32         `gorm:"column:penduduk_id;not null;index:idx_ibu_penduduk" json:"id_kependudukan"`
	Kependudukan    *Kependudukan `gorm:"foreignKey:IDKependudukan;references:IDKependudukan" json:"kependudukan"`
	StatusKehamilan string        `json:"status_kehamilan"`
	CreatedAt       time.Time     `json:"created_at"`
	UpdatedAt       time.Time     `json:"updated_at"`
	IsDeleted       *time.Time    `json:"is_deleted,omitempty"`
}

func (Ibu) TableName() string { return "ibu" }
