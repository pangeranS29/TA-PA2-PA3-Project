package models

import "time"

type EdukasiMPASI struct {
	ID        int32     `json:"id" gorm:"primaryKey;autoIncrement"`
	Judul     string    `json:"judul" gorm:"type:varchar(255);not null"`
	GambarURL string    `json:"gambar_url" gorm:"type:text"`
	Isi       string    `json:"isi" gorm:"type:text"`
	Resep     string    `json:"resep" gorm:"type:text"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (EdukasiMPASI) TableName() string {
	return "edukasi_mpasi"
}
