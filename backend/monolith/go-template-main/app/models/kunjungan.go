package models

import (
	"time"
)

type Kunjungan struct {
	ID               uint       `gorm:"primaryKey" json:"id"`
	AnakID           uint       `gorm:"column:id_anak;"json:"anak_id"`
	Status           string     `gorm:"column:status;"json:"status"`
	TanggalKunjungan *time.Time `gorm:"column:tanggal_kunjungan;" json:"tanggal_kunjungan"`
	Anak             *Anak      `json:"anak,omitempty" gorm:"foreignKey:AnakID"`
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

func (Kunjungan) TableName() string {
	return "kunjungan"
}

type UpdateKunjunganRequest struct {
	Status string `json:"status" binding:"required"`
}
