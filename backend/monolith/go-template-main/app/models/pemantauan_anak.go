package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

// RentangUsia - Menyimpan: "0-28 Hari", "29 Hari - 3 Bulan", "3-6 Bulan", etc.
type RentangUsia struct {
	ID          int32     `gorm:"primaryKey;autoIncrement" json:"id"`
	NamaRentang string    `gorm:"type:varchar(50);not null" json:"nama_rentang"`
	SatuanWaktu string    `gorm:"type:varchar(20);not null" json:"satuan_waktu"` // Hari, Minggu, Bulan
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (RentangUsia) TableName() string {
	return "rentang_usia"
}

// KategoriTandaSakit - Master data gejala per rentang usia
type KategoriTandaSakit struct {
	ID            int32          `gorm:"primaryKey;autoIncrement" json:"id"`
	RentangUsiaID int32          `gorm:"not null;index" json:"rentang_usia_id"`
	Gejala        string         `gorm:"type:text;not null" json:"gejala"`
	Deskripsi     string         `gorm:"type:text" json:"deskripsi"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`

	RentangUsia RentangUsia `gorm:"foreignKey:RentangUsiaID;references:ID" json:"rentang_usia,omitempty"`
}

func (KategoriTandaSakit) TableName() string {
	return "kategori_tanda_sakit"
}

// LembarPemantauanAnak - Header transaksi pemantauan
type LembarPemantauanAnak struct {
	ID            int32 `gorm:"primaryKey;autoIncrement" json:"id"`
	AnakID        int32 `gorm:"not null;index" json:"anak_id"`
	RentangUsiaID int32 `gorm:"not null;index" json:"rentang_usia_id"`

	PeriodeWaktu   int       `gorm:"not null" json:"periode_waktu"` // Hari ke-X atau Bulan ke-X
	TanggalPeriksa time.Time `gorm:"type:date;not null" json:"tanggal_periksa"`
	Pemeriksa      string    `gorm:"type:varchar(100)" json:"pemeriksa"` // Nama Kader/Nakes

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Anak         Anak                  `gorm:"foreignKey:AnakID;references:ID" json:"anak,omitempty"`
	RentangUsia  RentangUsia           `gorm:"foreignKey:RentangUsiaID;references:ID" json:"rentang_usia,omitempty"`
	DetailGejala []DetailPemantauanAnak `gorm:"foreignKey:LembarPemantauanAnakID" json:"detail_gejala,omitempty"`
}

func (LembarPemantauanAnak) TableName() string {
	return "lembar_pemantauan_anak"
}

// DetailPemantauanAnak - Status checkbox per gejala
type DetailPemantauanAnak struct {
	ID                     int32          `gorm:"primaryKey;autoIncrement" json:"id"`
	LembarPemantauanAnakID int32          `gorm:"not null;index" json:"lembar_pemantauan_anak_id"`
	KategoriTandaSakitID   int32          `gorm:"not null;index" json:"kategori_tanda_sakit_id"`
	IsTerjadi              bool           `gorm:"not null" json:"is_terjadi"`
	CreatedAt              time.Time      `json:"created_at"`
	UpdatedAt              time.Time      `json:"updated_at"`
	DeletedAt              gorm.DeletedAt `gorm:"index" json:"-"`

	LembarPemantauan   LembarPemantauanAnak `gorm:"foreignKey:LembarPemantauanAnakID;references:ID;constraint:OnDelete:CASCADE" json:"-"`
	KategoriTandaSakit KategoriTandaSakit   `gorm:"foreignKey:KategoriTandaSakitID;references:ID" json:"kategori_tanda_sakit,omitempty"`
}

func (DetailPemantauanAnak) TableName() string {
	return "detail_pemantauan_anak"
}

// ==================== REQUEST MODELS ====================

type DetailPemantauanAnakRequest struct {
	KategoriTandaSakitID int32 `json:"kategori_tanda_sakit_id" validate:"required"`
	IsTerjadi            bool  `json:"is_terjadi"`
}

type LembarPemantauanAnakRequest struct {
	AnakID         int32                         `json:"anak_id" validate:"required"`
	RentangUsiaID  int32                         `json:"rentang_usia_id" validate:"required"`
	PeriodeWaktu   int                           `json:"periode_waktu" validate:"required"`
	TanggalPeriksa string                        `json:"tanggal_periksa" validate:"required"` // YYYY-MM-DD
	Pemeriksa      string                        `json:"pemeriksa"`
	DetailGejala   []DetailPemantauanAnakRequest `json:"detail_gejala" validate:"required,dive"`
}

func (r *LembarPemantauanAnakRequest) Validate() error {
	if r.AnakID <= 0 {
		return errors.New("anak_id harus lebih dari 0")
	}
	if r.RentangUsiaID <= 0 {
		return errors.New("rentang_usia_id harus lebih dari 0")
	}
	if r.PeriodeWaktu <= 0 {
		return errors.New("periode_waktu harus lebih dari 0")
	}
	if r.TanggalPeriksa == "" {
		return errors.New("tanggal_periksa tidak boleh kosong")
	}
	if len(r.DetailGejala) == 0 {
		return errors.New("detail_gejala wajib diisi minimal 1")
	}
	return nil
}
