package models

import "time"

type EdukasiTandaBahayaTrimester struct {
	ID        int32     `json:"id" gorm:"primaryKey;autoIncrement"`
	Judul     string    `json:"judul" gorm:"type:varchar(255);not null"`
	GambarURL string    `json:"gambar_url" gorm:"type:text"`
	Isi       string    `json:"isi" gorm:"type:text"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (EdukasiTandaBahayaTrimester) TableName() string {
	return "edukasi_tanda_bahaya_trimester"
}
