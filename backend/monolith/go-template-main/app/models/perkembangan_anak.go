package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

// RentangUsiaPerkembangan - Contoh: "29 Hari - 3 Bulan", "3-6 Bulan", etc.
type RentangUsiaPerkembangan struct {
	ID          int32     `gorm:"primaryKey;autoIncrement" json:"id"`
	NamaRentang string    `gorm:"type:varchar(50);not null" json:"nama_rentang"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (RentangUsiaPerkembangan) TableName() string {
	return "rentang_usia_perkembangan"
}

// KategoriPerkembangan - Master data poin perkembangan per rentang usia
type KategoriPerkembangan struct {
	ID                      int32          `gorm:"primaryKey;autoIncrement" json:"id"`
	RentangUsiaPerkembanganID int32          `gorm:"not null;index" json:"rentang_usia_perkembangan_id"`
	Indikator               string         `gorm:"type:text;not null" json:"indikator"`
	Aspek                   string         `gorm:"type:varchar(50)" json:"aspek"` // Motorik, Sensorik, etc.
	CreatedAt               time.Time      `json:"created_at"`
	UpdatedAt               time.Time      `json:"updated_at"`
	DeletedAt               gorm.DeletedAt `gorm:"index" json:"-"`

	RentangUsia RentangUsiaPerkembangan `gorm:"foreignKey:RentangUsiaPerkembanganID;references:ID" json:"rentang_usia,omitempty"`
}

func (KategoriPerkembangan) TableName() string {
	return "kategori_perkembangan"
}

// LembarPerkembanganAnak - Header transaksi perkembangan
type LembarPerkembanganAnak struct {
	ID                      int32 `gorm:"primaryKey;autoIncrement" json:"id"`
	AnakID                  int32 `gorm:"not null;index" json:"anak_id"`
	RentangUsiaPerkembanganID int32 `gorm:"not null;index" json:"rentang_usia_perkembangan_id"`

	TanggalPeriksa time.Time `gorm:"type:date;not null" json:"tanggal_periksa"`
	Pemeriksa      string    `gorm:"type:varchar(100)" json:"pemeriksa"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Anak               Anak                      `gorm:"foreignKey:AnakID;references:ID" json:"anak,omitempty"`
	RentangUsia        RentangUsiaPerkembangan   `gorm:"foreignKey:RentangUsiaPerkembanganID;references:ID" json:"rentang_usia,omitempty"`
	DetailPerkembangan []DetailPerkembanganAnak `gorm:"foreignKey:LembarPerkembanganAnakID" json:"detail_perkembangan,omitempty"`
}

func (LembarPerkembanganAnak) TableName() string {
	return "lembar_perkembangan_anak"
}

// DetailPerkembanganAnak - Isian Ya/Tidak per indikator
type DetailPerkembanganAnak struct {
	ID                      int32          `gorm:"primaryKey;autoIncrement" json:"id"`
	LembarPerkembanganAnakID int32          `gorm:"not null;index" json:"lembar_perkembangan_anak_id"`
	KategoriPerkembanganID  int32          `gorm:"not null;index" json:"kategori_perkembangan_id"`
	Jawaban                 bool           `gorm:"not null" json:"jawaban"` // true = Ya, false = Tidak
	CreatedAt               time.Time      `json:"created_at"`
	UpdatedAt               time.Time      `json:"updated_at"`
	DeletedAt               gorm.DeletedAt `gorm:"index" json:"-"`

	LembarPerkembangan   LembarPerkembanganAnak `gorm:"foreignKey:LembarPerkembanganAnakID;references:ID;constraint:OnDelete:CASCADE" json:"-"`
	KategoriPerkembangan KategoriPerkembangan   `gorm:"foreignKey:KategoriPerkembanganID;references:ID" json:"kategori_perkembangan,omitempty"`
}

func (DetailPerkembanganAnak) TableName() string {
	return "detail_perkembangan_anak"
}

// ==================== REQUEST MODELS ====================

type DetailPerkembanganAnakRequest struct {
	KategoriPerkembanganID int32 `json:"kategori_perkembangan_id" validate:"required"`
	Jawaban                bool  `json:"jawaban"`
}

type LembarPerkembanganAnakRequest struct {
	AnakID                  int32                           `json:"anak_id" validate:"required"`
	RentangUsiaPerkembanganID int32                           `json:"rentang_usia_perkembangan_id" validate:"required"`
	TanggalPeriksa          string                          `json:"tanggal_periksa" validate:"required"`
	Pemeriksa               string                          `json:"pemeriksa"`
	DetailPerkembangan      []DetailPerkembanganAnakRequest `json:"detail_perkembangan" validate:"required,dive"`
}

func (r *LembarPerkembanganAnakRequest) Validate() error {
	if r.AnakID <= 0 || r.RentangUsiaPerkembanganID <= 0 {
		return errors.New("id anak dan rentang usia wajib diisi")
	}
	if len(r.DetailPerkembangan) == 0 {
		return errors.New("detail perkembangan tidak boleh kosong")
	}
	return nil
}
