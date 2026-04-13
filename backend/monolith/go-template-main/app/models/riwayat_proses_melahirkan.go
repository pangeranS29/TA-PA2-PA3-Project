package models

import "time"

type RiwayatProsesMelahirkan struct {
	IDRiwayatMelahirkan uint      `gorm:"primaryKey" json:"id_riwayat_melahirkan"`
	IDIbu               uint      `gorm:"not null;index" json:"id_ibu"`
	Ibu                 *IbuHamil `gorm:"foreignKey:IDIbu;references:ID" json:"ibu,omitempty"`

	GGravida int `json:"g_gravida"`
	PPartus  int `json:"p_partus"`
	AAbortus int `json:"a_abortus"`

	HariMelahirkan    string     `gorm:"type:varchar(20)" json:"hari_melahirkan"`
	TanggalMelahirkan *time.Time `gorm:"type:date" json:"tanggal_melahirkan"`
	PukulMelahirkan   *time.Time `json:"pukul_melahirkan"`

	CaraMelahirkanSpontan   bool `json:"cara_melahirkan_spontan"`
	CaraMelahirkanSungsang  bool `json:"cara_melahirkan_sungsang"`
	TindakanEkstraksiVakum  bool `json:"tindakan_ekstraksi_vakum"`
	TindakanEkstraksiForsep bool `json:"tindakan_ekstraksi_forsep"`
	TindakanSC              bool `json:"tindakan_sc"`

	PenolongDokterSpesialis bool `json:"penolong_dokter_spesialis"`
	PenolongDokter          bool `json:"penolong_dokter"`
	PenolongBidan           bool `json:"penolong_bidan"`

	TaksiranMelahirkan            string `json:"taksiran_melahirkan"`
	FasyankesTempatMelahirkan     string `json:"fasyankes_tempat_melahirkan"`
	RujukanKeterangan             string `json:"rujukan_keterangan"`
	InisiasiMenyusuDiniKeterangan string `json:"inisiasi_menyusu_dini_keterangan"`

	CapKakiBayiImageURL string `json:"cap_kaki_bayi_image_url"`

	CreatedAt time.Time `json:"created_at"`
}

func (RiwayatProsesMelahirkan) TableName() string {
	return "riwayat_proses_melahirkan"
}
