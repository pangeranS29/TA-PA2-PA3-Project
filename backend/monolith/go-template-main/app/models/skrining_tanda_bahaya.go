package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

// Menyimpan: "0-28 Hari", "29 Hari - 3 Bulan", "2-6 Tahun"
type RentangUsia struct {
	ID          int32     `gorm:"primaryKey;autoIncrement" json:"id"`
	NamaRentang string    `gorm:"type:varchar(50);not null" json:"nama_rentang"`
	SatuanWaktu string    `gorm:"type:enum('Hari','Minggu','Bulan');not null" json:"satuan_waktu"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (RentangUsia) TableName() string {
	return "rentang_usia"
}

// Menyimpan: "Demam", "Kejang", "Tali pusat kemerahan", dll.
type KategoriTandaSakit struct {
	ID            int32          `gorm:"primaryKey;autoIncrement" json:"id"`
	RentangUsiaID int32          `gorm:"not null;index" json:"rentang_usia_id"` // Relasi ke rentang usia (karena gejala bayi 0 hari beda dengan balita 4 tahun)
	Gejala        string         `gorm:"type:text;not null" json:"gejala"`
	Deskripsi     string         `gorm:"type:text" json:"deskripsi"`
	IsActive      bool           `gorm:"default:true" json:"is_active"` // pertanyaan aktif atau tidak
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`

	RentangUsia RentangUsia `gorm:"foreignKey:RentangUsiaID;references:ID" json:"rentang_usia,omitempty"`
}

func (KategoriTandaSakit) TableName() string {
	return "kategori_tanda_sakit"
}

// transaksi
// MEWAKILI 1 KOLOM DI BUKU KIA (Header)
type LembarPemantauan struct {
	ID            int32 `gorm:"primaryKey;autoIncrement" json:"id"`
	AnakID        int32 `gorm:"not null;index" json:"anak_id"`
	RentangUsiaID int32 `gorm:"not null;index" json:"rentang_usia_id"`

	PeriodeWaktu   int       `gorm:"not null" json:"periode_waktu"` // Contoh: 4 (jika hari ke-4 / bulan ke-4)
	TanggalPeriksa time.Time `gorm:"type:date;not null" json:"tanggal_periksa"`
	NamaPemeriksa  string    `gorm:"type:varchar(100)" json:"nama_pemeriksa"` // Menyimpan Nama/Paraf Kader atau Nakes

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Anak         Anak               `gorm:"foreignKey:AnakID;references:ID" json:"anak,omitempty"`
	RentangUsia  RentangUsia        `gorm:"foreignKey:RentangUsiaID;references:ID" json:"rentang_usia,omitempty"`
	DetailGejala []DetailPemantauan `gorm:"foreignKey:LembarPemantauanID" json:"detail_gejala,omitempty"` // Relasi Has-Many
}

func (LembarPemantauan) TableName() string {
	return "lembar_pemantauan"
}

// MEWAKILI KOTAK CENTANG (Detail)
type DetailPemantauan struct {
	ID                   int32          `gorm:"primaryKey;autoIncrement" json:"id"`
	LembarPemantauanID   int32          `gorm:"not null;index" json:"lembar_pemantauan_id"`
	KategoriTandaSakitID int32          `gorm:"not null;index" json:"kategori_tanda_sakit_id"`
	IsTerjadi            bool           `gorm:"not null" json:"is_terjadi"` // True = Sakit/Dicentang, False = Sehat
	CreatedAt            time.Time      `json:"created_at"`
	UpdatedAt            time.Time      `json:"updated_at"`
	DeletedAt            gorm.DeletedAt `gorm:"index" json:"-"`

	LembarPemantauan   LembarPemantauan   `gorm:"foreignKey:LembarPemantauanID;references:ID;constraint:OnDelete:CASCADE" json:"-"`
	KategoriTandaSakit KategoriTandaSakit `gorm:"foreignKey:KategoriTandaSakitID;references:ID" json:"kategori_tanda_sakit,omitempty"`
}

func (DetailPemantauan) TableName() string {
	return "detail_pemantauan"
}

// ==================== REQUEST MODELS ====================

// DetailPemantauanDetailRequest - Detail gejala dalam request
type DetailPemantauanDetailRequest struct {
	KategoriTandaSakitID int32 `json:"kategori_tanda_sakit_id" validate:"required"`
	IsTerjadi            bool  `json:"is_terjadi"` // true = gejala terjadi, false = tidak
}

// LembarPemantauanRequest - Request untuk create/update lembar pemantauan
type LembarPemantauanRequest struct {
	AnakID         int32                           `json:"anak_id" validate:"required"`
	RentangUsiaID  int32                           `json:"rentang_usia_id" validate:"required"`
	PeriodeWaktu   int                             `json:"periode_waktu" validate:"required,min=1"`
	TanggalPeriksa string                          `json:"tanggal_periksa" validate:"required"` // Format: YYYY-MM-DD
	NamaPemeriksa  string                          `json:"nama_pemeriksa" validate:"required"`
	DetailGejala   []DetailPemantauanDetailRequest `json:"detail_gejala" validate:"required,dive"`
}

// Validate - Validasi request
func (r *LembarPemantauanRequest) Validate() error {
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
	if r.NamaPemeriksa == "" {
		return errors.New("nama_pemeriksa tidak boleh kosong")
	}
	if len(r.DetailGejala) == 0 {
		return errors.New("detail_gejala wajib diisi minimal 1")
	}
	return nil
}
