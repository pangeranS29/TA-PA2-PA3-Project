package models

import (
	"time"
)

type Kependudukan struct {
	IdKependudukan     uint      `gorm:"column:id_kependudukan;primaryKey;autoIncrement" json:"id_kependudukan"`
	IdUser             uint      `gorm:"column:id_user" json:"id_user"`
	NIK                string    `gorm:"column:nik;type:char(16);unique;not null" json:"nik"`
	NamaLengkap        string    `gorm:"column:nama_lengkap;type:varchar(255);not null" json:"nama_lengkap"`
	NoKK               string    `gorm:"column:no_kk;type:varchar(16);not null" json:"no_kk"`
	TanggalTerbit      time.Time `gorm:"column:tanggal_terbit;type:date;not null" json:"tanggal_terbit"`
	JenisKelamin       string    `gorm:"column:jenis_kelamin;type:char(1);not null" json:"jenis_kelamin"`
	TempatLahir        string    `gorm:"column:tempat_lahir;type:varchar(100);not null" json:"tempat_lahir"`
	TanggalLahir       time.Time `gorm:"column:tanggal_lahir;type:date;not null" json:"tanggal_lahir"`
	Agama              string    `gorm:"column:agama;type:varchar(50);not null" json:"agama"`
	GolonganDarah      string    `gorm:"column:golongan_darah;type:varchar(5);not null" json:"golongan_darah"`
	PendidikanTerakhir string    `gorm:"column:pendidikan_terakhir;type:varchar(50);not null" json:"pendidikan_terakhir"`
	Pekerjaan          string    `gorm:"column:pekerjaan;type:varchar(100);not null" json:"pekerjaan"`
	NoTelp             string    `gorm:"column:no_telp;type:varchar(20);unique;not null" json:"no_telp"`
	RTRW               string    `gorm:"column:rt_rw;type:varchar(10);not null" json:"rt_rw"`
	Dusun              string    `gorm:"column:dusun;type:varchar(100)" json:"dusun"`
	DesaKelurahan      string    `gorm:"column:desa_kelurahan;type:varchar(100);not null" json:"desa_kelurahan"`
	Kecamatan          string    `gorm:"column:kecamatan;type:varchar(100);not null" json:"kecamatan"`
	KabupatenKota      string    `gorm:"column:kabupaten_kota;type:varchar(100);not null" json:"kabupaten_kota"`
	Provinsi           string    `gorm:"column:provinsi;type:varchar(100);not null" json:"provinsi"`
	CreatedAt          time.Time `gorm:"column:created_at;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt          time.Time `gorm:"column:updated_at" json:"updated_at"`

	// Relationship
	User User `gorm:"foreignKey:IdUser;references:ID" json:"user,omitempty"`
}

func (Kependudukan) TableName() string {
	return "kependudukan"
}
