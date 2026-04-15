package models

import "time"

type PenjelasanHasilGrafik struct {
	IDPenjelasan            int32     `gorm:"primaryKey" json:"id_penjelasan"`
	IDIbu                   int32     `gorm:"not null;index" json:"id_ibu"`
	Ibu                     *IbuHamil `gorm:"foreignKey:IDIbu;references:ID" json:"ibu,omitempty"`
	CatatanPenjelasanGrafik string    `json:"catatan_penjelasan_grafik"`
	CreatedAt               time.Time `json:"created_at"`
}

func (PenjelasanHasilGrafik) TableName() string {
	return "penjelasan_hasil_grafik"
}
