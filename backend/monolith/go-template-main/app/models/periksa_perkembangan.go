package models

import "time"

type Perkembangan struct {
	ID                uint       `gorm:"primaryKey;column:id" db:"id" json:"id"`
	AnakID            int        `gorm:"column:anak_id" db:"anak_id" json:"anak_id"`
	KategoriCapaianID int        `gorm:"column:kategori_capaian_id" db:"kategori_capaian_id" json:"kategori_capaian_id"`
	Jawaban           *bool      `gorm:"column:jawaban" db:"jawaban" json:"jawaban,omitempty"`
	TanggalPeriksa    *time.Time `gorm:"column:tanggal_periksa" db:"tanggal_periksa" json:"tanggal_periksa,omitempty"`
	CreatedAt         time.Time  `gorm:"column:created_at" db:"created_at" json:"created_at"`
	UpdatedAt         time.Time  `gorm:"column:updated_at" db:"updated_at" json:"updated_at"`
	Isdeleted         time.Time  `gorm:"column:is_deleted" db:"is_deleted" json:"is_deleted,omitempty"`

	// Foreign key constraints
	Anak            *Anak            `gorm:"foreignKey:AnakID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT" json:"-"`
	KategoriCapaian *KategoriCapaian `gorm:"foreignKey:KategoriCapaianID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT" json:"-"`
}

func (Perkembangan) TableName() string {
	return "pemeriksaan_perkembangan"
}
