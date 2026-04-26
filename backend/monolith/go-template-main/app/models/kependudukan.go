package models

import "time"

type Kependudukan struct {
	IDKependudukan     int32          `gorm:"primaryKey;column:id;autoIncrement" json:"id_kependudukan"`
	KartuKeluargaID    int32          `gorm:"not null;index" json:"kartu_keluarga_id"`
	KartuKeluarga      *KartuKeluarga `gorm:"foreignKey:KartuKeluargaID;references:ID" json:"kartu_keluarga,omitempty"`
	NIK                string         `gorm:"type:varchar(20);uniqueIndex;not null" json:"nik"`
	Dusun              string         `gorm:"type:varchar(50)" json:"dusun"`
	NamaLengkap        string         `gorm:"type:text;not null" json:"nama_lengkap"`
	GolonganDarah      string         `gorm:"type:text" json:"golongan_darah"`
	JenisKelamin       string         `gorm:"type:varchar(20);not null" json:"jenis_kelamin"`
	TempatLahir        string         `gorm:"type:varchar(100)" json:"tempat_lahir"`
	TanggalLahir       time.Time      `gorm:"type:date;not null" json:"tanggal_lahir"`
	Pekerjaan          string         `gorm:"type:varchar(100)" json:"pekerjaan"`
	PendidikanTerakhir string         `gorm:"type:varchar(50)" json:"pendidikan_terakhir"`
	Alamat             string         `gorm:"type:text" json:"alamat"`
	Telepon            string         `gorm:"type:varchar(20)" json:"telepon"`
	CreatedAt          time.Time      `json:"created_at"`
	UpdatedAt          time.Time      `json:"updated_at"`
	DeletedAt          *time.Time     `json:"deleted_at,omitempty" gorm:"index"`
}

func (Kependudukan) TableName() string { return "penduduk" }
