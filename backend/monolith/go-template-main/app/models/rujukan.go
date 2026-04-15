package models

import "time"

type Rujukan struct {
	IDRujukan int32     `gorm:"primaryKey" json:"id_rujukan"`
	IDIbu     int32     `gorm:"not null;index" json:"id_ibu"`
	Ibu       *IbuHamil `gorm:"foreignKey:IDIbu;references:ID" json:"ibu,omitempty"`

	RujukanResumePemeriksaanTatalaksana string `json:"rujukan_resume_pemeriksaan_tatalaksana"`
	RujukanDiagnosisAkhir               string `json:"rujukan_diagnosis_akhir"`
	RujukanAlasanDirujukKeFKRTL         string `json:"rujukan_alasan_dirujuk_ke_fkrtl"`

	RujukanBalikTanggal                      *time.Time `gorm:"type:date" json:"rujukan_balik_tanggal"`
	RujukanBalikDiagnosisAkhir               string     `json:"rujukan_balik_diagnosis_akhir"`
	RujukanBalikResumePemeriksaanTatalaksana string     `json:"rujukan_balik_resume_pemeriksaan_tatalaksana"`

	AnjuranRekomendasiTempatMelahirkan string `gorm:"type:varchar(50)" json:"anjuran_rekomendasi_tempat_melahirkan"`

	CreatedAt time.Time `json:"created_at"`
}

func (Rujukan) TableName() string {
	return "rujukan"
}
