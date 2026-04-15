package models

import (
	"time"
)

// USG TRIMESTER 1
type USGTrimester1 struct {
	IdUsgTrimester1               uint      `gorm:"column:id_usg_trimester1;primaryKey;autoIncrement" json:"id_usg_trimester1"`
	FKIdPemeriksaanAnc            uint      `gorm:"column:id_anc;not null" json:"id_anc"`
	FKIdJanin                     uint      `gorm:"column:id_janin;not null" json:"id_janin"`
	JumlahGS                      string    `gorm:"column:jumlah_gs;type:text" json:"jumlah_gs"`
	UmurKehamilanDiameterGSMinggu int       `gorm:"column:umur_kehamilan_diameter_gs_minggu" json:"umur_kehamilan_diameter_gs_minggu"`
	UmurKehamilanDiameterGSHari   int       `gorm:"column:umur_kehamilan_diameter_gs_hari" json:"umur_kehamilan_diameter_gs_hari"`
	DiameterGS                    float32   `gorm:"column:diameter_gs" json:"diameter_gs"`
	UmurKehamilanCRLMinggu        int       `gorm:"column:umur_kehamilan_crl_minggu" json:"umur_kehamilan_crl_minggu"`
	UmurKehamilanCRLHari          int       `gorm:"column:umur_kehamilan_crl_hari" json:"umur_kehamilan_crl_hari"`
	CRL                           float32   `gorm:"column:crl" json:"crl"`
	PulsasiJantung                string    `gorm:"column:pulsasi_jantung;type:text" json:"pulsasi_jantung"`
	KecurigaanAbnormal            string    `gorm:"column:kecurigaan_abnormal;type:text" json:"kecurigaan_abnormal"`
	CreatedAt                     time.Time `gorm:"column:created_at;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt                     time.Time `gorm:"column:updated_at" json:"updated_at"`

	// Relationship
	PemeriksaanANC PemeriksaanANC `gorm:"foreignKey:FKIdPemeriksaanAnc;references:IdPemeriksaanANC" json:"pemeriksaan_anc,omitempty"`
	Janin          Janin          `gorm:"foreignKey:FKIdJanin;references:IdJanin" json:"janin,omitempty"`
}

// USG TRIMESTER 2
type USGTrimester2 struct {
	IdUsgTrimester2      uint      `gorm:"column:id_usg_trimester2;primaryKey;autoIncrement" json:"id_usg_trimester2"`
	FKIdPemeriksaanAnc   uint      `gorm:"column:id_anc;not null" json:"id_anc"`
	FKIdJanin            uint      `gorm:"column:id_janin;not null" json:"id_janin"`
	BPD                  float32   `gorm:"column:bpd" json:"bpd"`
	BPDMinggu            int       `gorm:"column:bpd_minggu" json:"bpd_minggu"`
	HC                   int       `gorm:"column:hc" json:"hc"`
	HCMinggu             int       `gorm:"column:hc_minggu" json:"hc_minggu"`
	AC                   int       `gorm:"column:ac" json:"ac"`
	ACMinggu             int       `gorm:"column:ac_minggu" json:"ac_minggu"`
	FL                   float32   `gorm:"column:fl" json:"fl"`
	FLMinggu             int       `gorm:"column:fl_minggu" json:"fl_minggu"`
	EfwTbj               int       `gorm:"column:efw_tbj" json:"efw_tbj"`
	EfwTbjMinggu         int       `gorm:"column:efw_tbj_minggu" json:"efw_tbj_minggu"`
	PresentilPertumbuhan int       `gorm:"column:presentil_pertumbuhan" json:"presentil_pertumbuhan"`
	CreatedAt            time.Time `gorm:"column:created_at;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt            time.Time `gorm:"column:updated_at" json:"updated_at"`

	// Relationship
	PemeriksaanANC PemeriksaanANC `gorm:"foreignKey:FKIdPemeriksaanAnc;references:IdPemeriksaanANC" json:"pemeriksaan_anc,omitempty"`
	Janin          Janin          `gorm:"foreignKey:FKIdJanin;references:IdJanin" json:"janin,omitempty"`
}

// USG TRIMESTER 3
type USGTrimester3 struct {
	IdUsgTrimester3         uint      `gorm:"column:id_usg_trimester3;primaryKey;autoIncrement" json:"id_usg_trimester3"`
	FKIdPemeriksaanAnc      uint      `gorm:"column:id_anc;not null" json:"id_anc"`
	FKIdJanin               uint      `gorm:"column:id_janin;not null" json:"id_janin"`
	KeadaanBayi             string    `gorm:"column:keadaan_bayi;type:text" json:"keadaan_bayi"`
	LokasiPlasenta          string    `gorm:"column:lokasi_plasenta;type:text" json:"lokasi_plasenta"`
	JumlahCairanKetubanSdp  float32   `gorm:"column:jumlah_cairan_ketuban_sdp" json:"jumlah_cairan_ketuban_sdp"`
	HasilCairanKetuban      string    `gorm:"column:hasil_cairan_ketuban;type:text" json:"hasil_cairan_ketuban"`
	BPD                     float32   `gorm:"column:bpd" json:"bpd"`
	BPDMinggu               int       `gorm:"column:bpd_minggu" json:"bpd_minggu"`
	HC                      int       `gorm:"column:hc" json:"hc"`
	HCMinggu                int       `gorm:"column:hc_minggu" json:"hc_minggu"`
	AC                      int       `gorm:"column:ac" json:"ac"`
	ACMinggu                int       `gorm:"column:ac_minggu" json:"ac_minggu"`
	FL                      float32   `gorm:"column:fl" json:"fl"`
	FLMinggu                int       `gorm:"column:fl_minggu" json:"fl_minggu"`
	EfwTbj                  int       `gorm:"column:efw_tbj" json:"efw_tbj"`
	EfwTbjMinggu            int       `gorm:"column:efw_tbj_minggu" json:"efw_tbj_minggu"`
	KonsultasiLanjut        string    `gorm:"column:konsultasi_lanjut;type:varchar(500)" json:"konsultasi_lanjut"`
	RencanaProsesMelahirkan string    `gorm:"column:rencana_proses_melahirkan;type:text" json:"rencana_proses_melahirkan"`
	CreatedAt               time.Time `gorm:"column:created_at;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt               time.Time `gorm:"column:updated_at" json:"updated_at"`

	// Relationship
	PemeriksaanANC PemeriksaanANC `gorm:"foreignKey:FKIdPemeriksaanAnc;references:IdPemeriksaanANC" json:"pemeriksaan_anc,omitempty"`
	Janin          Janin          `gorm:"foreignKey:FKIdJanin;references:IdJanin" json:"janin,omitempty"`
}

// FUNCTION
func (USGTrimester1) TableName() string {
	return "USG_Trimester_1"
}

func (USGTrimester2) TableName() string {
	return "USG_Trimester_2"
}

func (USGTrimester3) TableName() string {
	return "USG_Trimester_3"
}
