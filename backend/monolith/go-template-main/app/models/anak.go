package models

import "time"

type Anak struct {
	ID           uint       `gorm:"primaryKey;column:id" db:"id" json:"id"`
	ParentID     int        `gorm:"column:parent_id" db:"parent_id" json:"parent_id"`
	Nama         string     `gorm:"column:nama" db:"nama" json:"nama"`
	JenisKelamin GenderType `gorm:"column:jenis_kelamin" db:"jenis_kelamin" json:"jenis_kelamin"`
	TanggalLahir time.Time  `gorm:"column:tanggal_lahir" db:"tanggal_lahir" json:"tanggal_lahir"`
	BeratLahir   float64    `gorm:"column:berat_lahir" db:"berat_lahir" json:"berat_lahir"`
	TinggiLahir  float64    `gorm:"column:tinggi_lahir" db:"tinggi_lahir" json:"tinggi_lahir"`
	CreatedAt    time.Time  `gorm:"column:created_at" db:"created_at" json:"created_at"`

	// Foreign key constraint
	Ibu *Ibu `gorm:"foreignKey:ParentID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT" json:"-"`
}

func (Anak) TableName() string {
	return "anak"
}
