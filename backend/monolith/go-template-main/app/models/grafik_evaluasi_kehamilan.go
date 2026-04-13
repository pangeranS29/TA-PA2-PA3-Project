package models

import "time"

type GrafikEvaluasiKehamilan struct {
	IDGrafik uint      `gorm:"primaryKey" json:"id_grafik"`
	IDIbu    uint      `gorm:"not null;index" json:"id_ibu"`
	Ibu      *IbuHamil `gorm:"foreignKey:IDIbu;references:ID" json:"ibu,omitempty"`

	TanggalBulanTahun *time.Time `gorm:"type:date" json:"tanggal_bulan_tahun"`
	UsiaGestasiMinggu *int       `json:"usia_gestasi_minggu"`

	TinggiFundusUteriCm     *float64 `gorm:"type:decimal(4,1)" json:"tinggi_fundus_uteri_cm"`
	DenyutJantungBayiXMenit *int     `json:"denyut_jantung_bayi_x_menit"`

	TekananDarahSistole  *int `json:"tekanan_darah_sistole"`
	TekananDarahDiastole *int `json:"tekanan_darah_diastole"`
	NadiPerMenit         *int `json:"nadi_per_menit"`

	GerakanBayi       string   `gorm:"type:varchar(50)" json:"gerakan_bayi"`
	UrinProtein       string   `gorm:"type:varchar(50)" json:"urin_protein"`
	UrinReduksi       string   `gorm:"type:varchar(50)" json:"urin_reduksi"`
	Hemoglobin        *float64 `gorm:"type:decimal(4,1)" json:"hemoglobin"`
	TabletTambahDarah *int     `json:"tablet_tambah_darah"`
	Kalsium           string   `gorm:"type:varchar(50)" json:"kalsium"`
	Aspirin           string   `gorm:"type:varchar(50)" json:"aspirin"`

	CreatedAt time.Time `json:"created_at"`
}

func (GrafikEvaluasiKehamilan) TableName() string {
	return "grafik_evaluasi_kehamilan"
}
