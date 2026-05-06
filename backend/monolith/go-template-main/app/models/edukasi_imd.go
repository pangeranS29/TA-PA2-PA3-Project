package models

import "time"

type EdukasiImd struct {
	ID         int32     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Judul      string    `gorm:"column:judul" json:"judul"`
	GambarURL  string    `gorm:"column:gambar_url" json:"gambar_url"`
	Isi        string    `gorm:"column:isi" json:"isi"`
	CreatedAt  time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt  time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (EdukasiImd) TableName() string {
	return "edukasi_imd"
}