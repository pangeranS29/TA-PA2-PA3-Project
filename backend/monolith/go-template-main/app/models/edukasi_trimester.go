package models

import "time"

type EdukasiTrimester struct {
	ID         int32     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Judul      string    `gorm:"column:judul" json:"judul"`
	GambarURL  string    `gorm:"column:gambar_url" json:"gambar_url"`
	IsiKonten  string    `gorm:"column:isi_konten" json:"isi_konten"`
	CreatedAt  time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (EdukasiTrimester) TableName() string {
	return "edukasi_trimester"
}