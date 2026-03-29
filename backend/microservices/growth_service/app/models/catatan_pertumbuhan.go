package models

import (
	"time"
)

// CatatanPertumbuhan menyimpan data pengukuran anak
type CatatanPertumbuhan struct {
	ID            uint      `gorm:"primaryKey;column:id" db:"id" json:"id"`
	AnakID        int       `gorm:"column:anak_id;type:int;not null;index" db:"anak_id" json:"anak_id"` // Referensi ke anak di service lain
	TglUkur       time.Time `gorm:"column:tgl_ukur;type:date;not null;index" db:"tgl_ukur" json:"tgl_ukur"`
	BeratBadan    float64   `gorm:"column:berat_badan;type:decimal" db:"berat_badan" json:"berat_badan"`
	TinggiBadan   float64   `gorm:"column:tinggi_badan;type:decimal" db:"tinggi_badan" json:"tinggi_badan"`
	LingkarKepala float64   `gorm:"column:lingkar_kepala;type:decimal" db:"lingkar_kepala" json:"lingkar_kepala,omitempty"`
	IMT           float64   `gorm:"column:imt;type:decimal" db:"imt" json:"imt,omitempty"`

	// Data anak (replikasi minimal untuk perhitungan)
	JenisKelamin GenderType `gorm:"column:jenis_kelamin;type:gender_type;not null" db:"jenis_kelamin" json:"jenis_kelamin"`
	TanggalLahir time.Time  `gorm:"column:tanggal_lahir;type:date;not null" db:"tanggal_lahir" json:"tanggal_lahir"`

	// Status gizi (hasil perhitungan)
	StatusBBU  string  `gorm:"column:status_bb_u;type:varchar" db:"status_bb_u" json:"status_bb_u,omitempty"`
	StatusTBU  string  `gorm:"column:status_tb_u;type:varchar" db:"status_tb_u" json:"status_tb_u,omitempty"`
	StatusIMTU string  `gorm:"column:status_imt_u;type:varchar" db:"status_imt_u" json:"status_imt_u,omitempty"`
	ZScoreBBU  float64 `gorm:"column:z_score_bb_u;type:decimal" db:"z_score_bb_u" json:"z_score_bb_u,omitempty"`
	ZScoreTBU  float64 `gorm:"column:z_score_tb_u;type:decimal" db:"z_score_tb_u" json:"z_score_tb_u,omitempty"`
	ZScoreIMTU float64 `gorm:"column:z_score_imt_u;type:decimal" db:"z_score_imt_u" json:"z_score_imt_u,omitempty"`

	CatatanNakes string    `gorm:"column:catatan_nakes;type:text" db:"catatan_nakes" json:"catatan_nakes,omitempty"`
	CreatedAt    time.Time `gorm:"column:created_at" db:"created_at" json:"created_at"`

	// Field yang dihitung, tidak disimpan di DB
	UsiaUkurBulan int `gorm:"-" json:"usia_ukur_bulan,omitempty"`
}

func (CatatanPertumbuhan) TableName() string {
	return "catatan_pertumbuhan"
}

// Hitung usia dalam bulan pada saat pengukuran
func (c *CatatanPertumbuhan) HitungUsiaBulan() int {
	if c.TanggalLahir.After(c.TglUkur) {
		return 0
	}
	years := c.TglUkur.Year() - c.TanggalLahir.Year()
	months := int(c.TglUkur.Month() - c.TanggalLahir.Month())
	if months < 0 {
		years--
		months += 12
	}
	return years*12 + months
}

// Hitung IMT
func (c *CatatanPertumbuhan) HitungIMT() float64 {
	if c.TinggiBadan <= 0 {
		return 0
	}
	tinggiMeter := c.TinggiBadan / 100
	return c.BeratBadan / (tinggiMeter * tinggiMeter)
}
