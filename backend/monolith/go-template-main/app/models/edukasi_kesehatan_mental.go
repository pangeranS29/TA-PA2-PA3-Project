package models

import "time"

type EdukasiKesehatanMental struct {
	ID        int32     `json:"id" gorm:"primaryKey;autoIncrement"`
	Judul     string    `json:"judul" gorm:"type:varchar(255);not null"`
	GambarURL string    `json:"gambar_url" gorm:"type:text"`
	Deskripsi string    `json:"deskripsi" gorm:"type:text"`
	Isi       string    `json:"isi" gorm:"type:text"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (EdukasiKesehatanMental) TableName() string {
	return "edukasi_kesehatan_mental"
}
