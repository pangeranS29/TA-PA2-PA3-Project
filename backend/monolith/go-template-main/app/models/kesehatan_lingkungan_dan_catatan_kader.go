package models

import "time"

type KesehatanLingkunganDanCatatanKader struct {
	ID         uint   `gorm:"primaryKey;column:id" json:"id"`
	IbuID      int32  `gorm:"column:ibu_id;not null;index" json:"ibu_id"`
	Sanitasi   []string `gorm:"type:jsonb;serializer:json" json:"sanitasi"`
	CuciTangan []string `gorm:"type:jsonb;serializer:json" json:"cuci_tangan"`
	AirMakanan []string `gorm:"type:jsonb;serializer:json" json:"air_makanan"`
	Sampah     []string `gorm:"type:jsonb;serializer:json" json:"sampah"`
	Limbah     []string `gorm:"type:jsonb;serializer:json" json:"limbah"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	CatatanKader []CatatanKaderKesehatanLingkungan `gorm:"foreignKey:KesehatanLingkunganID;references:ID" json:"catatan_kader,omitempty"`
}

func (KesehatanLingkunganDanCatatanKader) TableName() string {
	return "kesehatan_lingkungan"
}

type CatatanKaderKesehatanLingkungan struct {
	ID                   uint      `gorm:"primaryKey;column:id" json:"id"`
	KesehatanLingkunganID uint      `gorm:"column:kesehatan_lingkungan_id;index;not null" json:"kesehatan_lingkungan_id"`
	Catatan              string    `gorm:"type:text;not null" json:"catatan"`
	IsSentToMobile       bool      `gorm:"column:is_sent_to_mobile;not null;default:false" json:"is_sent_to_mobile"`
	SentToMobileAt       *time.Time `gorm:"column:sent_to_mobile_at" json:"sent_to_mobile_at,omitempty"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}

func (CatatanKaderKesehatanLingkungan) TableName() string {
	return "catatan_kader_kesehatan_lingkungan"
}

type CreateKesehatanLingkunganDanCatatanKaderRequest struct {
	IbuID      int32    `json:"ibu_id"`
	Sanitasi   []string `json:"sanitasi"`
	CuciTangan []string `json:"cuci_tangan"`
	AirMakanan []string `json:"air_makanan"`
	Sampah     []string `json:"sampah"`
	Limbah     []string `json:"limbah"`
}

type CreateCatatanKaderKesehatanLingkunganRequest struct {
	Catatan string `json:"catatan"`
}
