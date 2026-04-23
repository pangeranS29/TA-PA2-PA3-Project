package models

import (
	"time"
)

type PemeriksaanKehamilan struct {
	ID                     int64      `gorm:"column:id;primaryKey" json:"id"`
	KehamilanID            int64      `gorm:"column:kehamilan_id" json:"kehamilan_id"`
	Trimester              string     `gorm:"column:trimester" json:"trimester"`
	KunjunganKe            int        `gorm:"column:kunjungan_ke" json:"kunjungan_ke"`
	TanggalPeriksa         time.Time  `gorm:"column:tanggal_periksa" json:"tanggal_periksa"`
	TempatPeriksa          string     `gorm:"column:tempat_periksa" json:"tempat_periksa"`
	
	// Pengukuran Fisik Ibu
	BeratBadan            float64    `gorm:"column:berat_badan" json:"berat_badan"`
	TinggiBadan           float64    `gorm:"column:tinggi_badan" json:"tinggi_badan"`
	LingkarLenganAtas     float64    `gorm:"column:lingkar_lengan_atas" json:"lingkar_lengan_atas"`
	TekananDarah          string     `gorm:"column:tekanan_darah" json:"tekanan_darah"`
	TinggiRahim           float64    `gorm:"column:tinggi_rahim" json:"tinggi_rahim"`
	LetakDenyutJantungBayi string     `gorm:"column:letak_denyut_jantung_bayi" json:"letak_denyut_jantung_bayi"`
	
	// Imunisasi & Tindakan
	StatusImunisasiTetanus string     `gorm:"column:status_imunisasi_tetanus" json:"status_imunisasi_tetanus"`
	Konseling             string     `gorm:"column:konseling" json:"konseling"`
	SkriningDokter        string     `gorm:"column:skrining_dokter" json:"skrining_dokter"`
	TabletTambahDarah     int        `gorm:"column:tablet_tambah_darah" json:"tablet_tambah_darah"`
	
	// Hasil Laboratorium
	TesLabHb            float64    `gorm:"column:tes_lab_hb" json:"tes_lab_hb"`
	TesGolonganDarah    string     `gorm:"column:tes_golongan_darah" json:"tes_golongan_darah"`
	TesLabProteinUrine  string     `gorm:"column:tes_lab_protein_urine" json:"tes_lab_protein_urine"`
	TesLabGulaDarah     int        `gorm:"column:tes_lab_gula_darah" json:"tes_lab_gula_darah"`
	
	// Catatan Tambahan
	Usg               string     `gorm:"column:usg" json:"usg"`
	TripelEliminasi   string     `gorm:"column:tripel_eliminasi" json:"tripel_eliminasi"`
	TataLaksanaKasus  string     `gorm:"column:tata_laksana_kasus" json:"tata_laksana_kasus"`
	
	CreatedAt         time.Time  `gorm:"column:created_at" json:"created_at"`
	
	// UpdatedAt         time.Time  `gorm:"column:updated_at" json:"updated_at"`
	// DeletedAt         *time.Time `gorm:"column:deleted_at" json:"deleted_at,omitempty"`
}

func (PemeriksaanKehamilan) TableName() string {
	return "pemeriksaan_kehamilan"
}