package models

import "time"

type Penduduk struct {
	ID                 int64          `gorm:"primaryKey;autoIncrement" json:"id"`
	KartuKeluargaID    *int64         `gorm:"index" json:"kartu_keluarga_id,omitempty"`
	KartuKeluarga      *KartuKeluarga `gorm:"foreignKey:KartuKeluargaID;references:ID" json:"kartu_keluarga,omitempty"`
	NIK                *string        `gorm:"uniqueIndex;size:20" json:"nik,omitempty"`
	NamaLengkap        *string        `json:"nama_lengkap,omitempty"`
	JenisKelamin       *string        `json:"jenis_kelamin,omitempty"`
	TanggalLahir       *time.Time     `json:"tanggal_lahir,omitempty"`
	TempatLahir        *string        `json:"tempat_lahir,omitempty"`
	GolonganDarah      *string        `json:"golongan_darah,omitempty"`
	Agama              *string        `json:"agama,omitempty"`
	StatusPerkawinan   *string        `json:"status_perkawinan,omitempty"`
	PendidikanTerakhir *string        `json:"pendidikan_terakhir,omitempty"`
	Pekerjaan          *string        `json:"pekerjaan,omitempty"`
	BacaHuruf          *string        `json:"baca_huruf,omitempty"`
	KedudukanKeluarga  *string        `json:"kedudukan_keluarga,omitempty"`
	Dusun              *string        `json:"dusun,omitempty"`
	NomorTelepon       *string        `json:"nomor_telepon,omitempty"`
	CreatedAt          *time.Time     `json:"created_at"`
	UpdatedAt          *time.Time     `json:"updated_at"`
	DeletedAt          *time.Time     `json:"deleted_at,omitempty"`
}

func (Penduduk) TableName() string { return "penduduk" }
