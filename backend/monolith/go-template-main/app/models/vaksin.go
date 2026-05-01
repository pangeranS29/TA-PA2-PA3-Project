package models

import (
	"time"
	"gorm.io/gorm" 
)
type Vaksin struct {
	ID        		uint      	`gorm:"column:id;primaryKey" json:"id	"`
	JenisVaksin     string      `gorm:"column:jenis_vaksin;type:varchar(50)" json:"jenis_vaksin"`
	Kepanjangan     string      `gorm:"column:kepanjangan;type:varchar(100)" json:"kepanjangan"`
	DitujukanKepada string      `gorm:"column:ditujukan_kepada;type:varchar(50)" json:"ditujukan_kepada"`
	WaktuPemberian  string      `gorm:"column:waktu_pemberian;type:varchar(50)" json:"waktu_pemberian"`
	Deskripsi    	string 		`gorm:"column:deskripsi;type:text;not null" json:"deskripsi"`
	EfekSamping    	string 		`gorm:"column:efek_samping;type:text;not null" json:"efek_samping"`
	Status          string      `gorm:"column:status;type:varchar(10);not null;default:aktif" json:"status"`
	CreatedAt 		time.Time 	`gorm:"column:created_at" json:"created_at"`
	UpdatedAt 		time.Time 	`gorm:"column:updated_at" json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"column:deleted_at;index" json:"deleted_at"`
}

func (Vaksin) TableName() string {
	return "vaksin"
}