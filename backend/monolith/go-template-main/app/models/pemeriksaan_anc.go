package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

type ProteinUrin string
type UrinReduksi string
type TripleEliminasi string
type AnemiaStatus string
type NormalStatus string

const (
	// PROTEIN URIN
	ProteinNegatif ProteinUrin = "negatif"
	ProteinTrace   ProteinUrin = "trace"
	ProteinPlus1   ProteinUrin = "+1"
	ProteinPlus2   ProteinUrin = "+2"
	ProteinPlus3   ProteinUrin = "+3"
	ProteinPlus4   ProteinUrin = "+4"

	// URIN REDUKSI
	ReduksiNegatif UrinReduksi = "negatif"
	ReduksiPlus1   UrinReduksi = "+1"
	ReduksiPlus2   UrinReduksi = "+2"
	ReduksiPlus3   UrinReduksi = "+3"
	ReduksiPlus4   UrinReduksi = "+4"

	// TRIPLE ELIMINASE
	HasilReaktif    TripleEliminasi = "reaktif"
	HasilNonReaktif TripleEliminasi = "non-reaktif"

	// Anemia Status
	StatusAnemia    AnemiaStatus = "anemia"
	StatusNonAnemia AnemiaStatus = "non-anemia"

	// Normal Status
	StatusNormal      NormalStatus = "normal"
	StatusTidakNormal NormalStatus = "tidak normal"
)

type DataPemeriksaanLanjut struct {
	Konjungtiva AnemiaStatus `json:"konjungtiva"`
	Sklera      NormalStatus `json:"sklera"`
	Kulit       NormalStatus `json:"kulit"`
	Leher       NormalStatus `json:"leher"`
	GigiMulut   NormalStatus `json:"gigi_mulut"`
	Telinga     NormalStatus `json:"telinga"`
	Hidung      NormalStatus `json:"hidung"`
	Mulut       NormalStatus `json:"mulut"`
	Dada        NormalStatus `json:"dada"`
	Jantung     NormalStatus `json:"jantung"`
	Paru        NormalStatus `json:"paru"`
	Perut       NormalStatus `json:"perut"`
	Tungkai     NormalStatus `json:"tungkai"`

	StatusImunisasiTetanus bool `json:"status_imunisasi_tetanus"`
	Konseling              bool `json:"konseling"`
	SkriningDokter         bool `json:"skrining_dokter"`
	PemberianTTD           bool `json:"pemberian_ttd"`
	KesehatanJiwa          bool `json:"kesehatan_jiwa"`
}

type PemeriksaanANC struct {
	IdPemeriksaanANC          uint                  `gorm:"column:id_pemeriksaan_anc;primaryKey;autoIncrement" json:"id_pemeriksaan_anc"`
	FKIdKehamilan             uint                  `gorm:"column:id_kehamilan;not null" json:"id_kehamilan"`
	Trimester                 string                `gorm:"column:trimester;type:text;not null" json:"trimester"`
	KunjunganKe               uint8                 `gorm:"column:kunjungan_ke;not null" json:"kunjungan_ke"`
	UsiaKehamilan             uint8                 `gorm:"column:usia_kehamilan;not null" json:"usia_kehamilan"`
	TanggalPeriksa            time.Time             `gorm:"column:tanggal_periksa;type:date;not null" json:"tanggal_periksa"`
	TempatPeriksa             string                `gorm:"column:tempat_periksa;type:varchar(255);not null" json:"tempat_periksa"`
	NamaDokter                string                `gorm:"column:nama_dokter;type:varchar(255);not null" json:"nama_dokter"`
	TanggalKembali            *time.Time            `gorm:"column:tanggal_kembali;type:date" json:"tanggal_kembali"`
	BeratBadan                float32               `gorm:"column:berat_badan" json:"berat_badan"`
	Lila                      float32               `gorm:"column:lila" json:"lila"`
	TinggiFundus              uint8                 `gorm:"column:tinggi_fundus" json:"tinggi_fundus"`
	TDSistolik                uint8                 `gorm:"column:td_sistolik" json:"td_sistolik"`
	TDDiastolik               uint8                 `gorm:"column:td_diastolik" json:"td_diastolik"`
	Hemoglobin                float32               `gorm:"column:hemoglobin" json:"hemoglobin"`
	TesGulaDarah              uint8                 `gorm:"column:tes_gula_darah" json:"tes_gula_darah"`
	ProteinUrin               ProteinUrin           `gorm:"column:protein_urin;type:text" json:"protein_urin"`
	UrinReduksi               UrinReduksi           `gorm:"column:urin_reduksi;type:text" json:"urin_reduksi"`
	GulaDarahPuasa            float32               `gorm:"column:gula_darah_puasa" json:"gula_darah_puasa"`
	GulaDarah2JamPostPrandial float32               `gorm:"column:gula_darah_2_jam_post_prandial" json:"gula_darah_2_jam_post_prandial"`
	HIV                       TripleEliminasi       `gorm:"column:hiv;type:text" json:"hiv"`
	Sifilis                   TripleEliminasi       `gorm:"column:sifilis;type:text" json:"sifilis"`
	HepatitisB                TripleEliminasi       `gorm:"column:hepatitis_b;type:text" json:"hepatitis_b"`
	CatatanPemeriksaanLanjut  DataPemeriksaanLanjut `gorm:"column:catatan_pemeriksaan_lanjut;type:jsonb" json:"catatan_pemeriksaan_lanjut"`
	TataLaksanaKasus          string                `gorm:"column:tata_laksana_kasus;type:text" json:"tata_laksana_kasus"`
	CatatanPelayanan          string                `gorm:"column:catatan_pelayanan;type:text" json:"catatan_pelayanan"`
	Kesimpulan                string                `gorm:"column:kesimpulan;type:text" json:"kesimpulan"`
	CreatedAt                 time.Time             `gorm:"column:created_at;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt                 time.Time             `gorm:"column:updated_at" json:"updated_at"`

	// Relationship
	Kehamilan Kehamilan `gorm:"foreignKey:FKIdKehamilan;references:IdKehamilan" json:"kehamilan,omitempty"`
}

// Convert JSONB ke Struct
func (d *DataPemeriksaanLanjut) Scan(value interface{}) error {
	if value == nil {
		*d = DataPemeriksaanLanjut{}
		return nil
	}

	b, ok := value.([]byte)
	if !ok {
		str, ok := value.(string)
		if !ok {
			return errors.New("Gagal konversi data JSONB ... ")
		}
		b = []byte(str)
	}

	return json.Unmarshal(b, d)
}

// Convert Struct ke JSONB
func (d DataPemeriksaanLanjut) Value() (driver.Value, error) {
	b, err := json.Marshal(d)
	if err != nil {
		return nil, err
	}
	return b, nil
}

func (PemeriksaanANC) TableName() string {
	return "pemeriksaan_anc"
}
