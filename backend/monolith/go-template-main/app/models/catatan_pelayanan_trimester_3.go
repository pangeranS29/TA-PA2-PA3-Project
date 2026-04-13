package models

import "time"

type CatatanPelayananTrimester3 struct {
	IDCatatanT3                     uint       `gorm:"primaryKey" json:"id_catatan_t3"`
	IDIbu                           uint       `gorm:"not null;index" json:"id_ibu"`
	Ibu                             *IbuHamil  `gorm:"foreignKey:IDIbu;references:ID" json:"ibu,omitempty"`
	TanggalPeriksaStampParaf        *time.Time `gorm:"type:date" json:"tanggal_periksa_stamp_paraf"`
	KeluhanPemeriksaanTindakanSaran string     `json:"keluhan_pemeriksaan_tindakan_saran"`
	TanggalKembali                  *time.Time `gorm:"type:date" json:"tanggal_kembali"`
}

func (CatatanPelayananTrimester3) TableName() string {
	return "catatan_pelayanan_trimester_3"
}
