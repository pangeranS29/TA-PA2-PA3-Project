package models

import (
	"time"
)

type StatusEnum string
type StatusImunisasiTTEnum string

const (
	// Bagian status state ibu
	StatusHamil StatusEnum = "hamil"
	StatusAnak  StatusEnum = "anak"

	// Bagian status imunisasi ibu
	StatusTT1 StatusImunisasiTTEnum = "tt1"
	StatusTT2 StatusImunisasiTTEnum = "tt2"
	StatusTT3 StatusImunisasiTTEnum = "tt3"
	StatusTT4 StatusImunisasiTTEnum = "tt4"
	StatusTT5 StatusImunisasiTTEnum = "tt5"
)

type Ibu struct {
	IdIbu                   uint                  `gorm:"column:id_ibu;primaryKey;autoIncrement" json:"id_ibu"`
	FKIdKependudukan        uint                  `gorm:"column:id_kependudukan;not null" json:"id_kependudukan"`
	Umur                    uint8                 `gorm:"column:umur;not null" json:"umur"`
	AlergiMakanan           string                `gorm:"column:alergi_makanan;type:text" json:"alergi_makanan"`
	AlergiObat              string                `gorm:"column:alergi_obat;type:text" json:"alergi_obat"`
	NoJKN                   string                `gorm:"column:no_jkn;type:varchar(15)" json:"no_jkn"`
	FaskesTK1               string                `gorm:"column:faskes_tk1;type:varchar(100);not null" json:"faskes_tk1"`
	NoRegKohort             string                `gorm:"column:no_reg_kohort;type:varchar(20);not null" json:"no_reg_kohort"`
	StatusIbu               StatusEnum            `gorm:"column:status;type:text;not null" json:"status"`
	RiwayatKesehatan        string                `gorm:"column:riwayat_kesehatan;type:text" json:"riwayat_kesehatan"`
	RiwayatPerilakuBeresiko string                `gorm:"column:riwayat_perilaku_beresiko;type:text" json:"riwayat_perilaku_beresiko"`
	RiwayatPenyakitKeluarga string                `gorm:"column:riwayat_penyakit_keluarga;type:text" json:"riwayat_penyakit_keluarga"`
	Gravida                 uint8                 `gorm:"column:gravida;not null" json:"gravida"`
	Partus                  uint8                 `gorm:"column:partus;not null" json:"partus"`
	Abortus                 uint8                 `gorm:"column:abortus;not null" json:"abortus"`
	StatusImunisasiTT       StatusImunisasiTTEnum `gorm:"column:status_imunisasi_tt;type:text" json:"status_imunisasi_tt"`
	CreatedAt               time.Time             `gorm:"column:created_at;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt               time.Time             `gorm:"column:updated_at" json:"updated_at"`

	// Relationship
	// Kependudukan Kependudukan `gorm:"foreignKey:IdKependudukan;references:IdKependudukan" json:"kependudukan,omitempty"`
	Kependudukan Kependudukan `gorm:"foreignKey:FKIdKependudukan;references:IdKependudukan;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;" json:"kependudukan,omitempty"`
}

func (Ibu) TableName() string {
	return "ibu"
}
