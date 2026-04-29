package models

import "time"

// Ibu represents mother/pregnant woman data in the system
// IMPORTANT: Removed uniqueIndex from IDKependudukan to allow multiple pregnancies per person
// (One person can have multiple pregnancies in different years)
type Ibu struct {
	IDIbu        int32         `gorm:"primaryKey;column:id;autoIncrement" json:"id_ibu"`
	PendudukID   int32         `gorm:"column:penduduk_id;not null;uniqueIndex" json:"penduduk_id"`
	Kependudukan *Kependudukan `gorm:"foreignKey:PendudukID;references:IDKependudukan" json:"kependudukan"`

	StatusKehamilan string    `json:"status_kehamilan"`
	RisikoTinggi    bool      `gorm:"column:risiko_tinggi;default:false" json:"risiko_tinggi"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

func (Ibu) TableName() string { return "ibu" }
