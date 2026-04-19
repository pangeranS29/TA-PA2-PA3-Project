package models

import "time"

type Kependudukan struct {
	ID                uint   `gorm:"primaryKey;column:id" db:"id" json:"id"`
	NoKartuKeluargaID *uint  `gorm:"column:no_kartu_keluarga_id;index" db:"no_kartu_keluarga_id" json:"no_kartu_keluarga_id,omitempty"`
	Nik               int64  `gorm:"column:nik;uniqueIndex" db:"nik" json:"nik"`
	Nama              string `gorm:"column:nama" db:"nama" json:"nama"`
	JenisKelamin      string `gorm:"column:jenis_kelamin" db:"jenis_kelamin" json:"jenis_kelamin"`
	TanggalLahir      string `gorm:"column:tanggal_lahir" db:"tanggal_lahir" json:"tanggal_lahir"`
	TempatLahir       string `gorm:"column:tempat_lahir" db:"tempat_lahir" json:"tempat_lahir"`
	GolonganDarah     string `gorm:"column:golongan_darah" db:"golongan_darah" json:"golongan_darah,omitempty"`
	// HubunganKeluarga   string    `gorm:"column:hubungan_keluarga" db:"hubungan_keluarga" json:"hubungan_keluarga,omitempty"`
	Dusun              string    `gorm:"column:dusun" db:"dusun" json:"dusun,omitempty"`
	Pekerjaan          string    `gorm:"column:pekerjaan" db:"pekerjaan" json:"pekerjaan,omitempty"`
	PendidikanTerakhir string    `gorm:"column:pendidikan_terakhir" db:"pendidikan_terakhir" json:"pendidikan_terakhir,omitempty"`
	CreatedAt          time.Time `gorm:"column:created_at" db:"created_at" json:"created_at"`
	UpdatedAt          time.Time `gorm:"column:updated_at" db:"updated_at" json:"updated_at"`
	Isdeleted          time.Time `gorm:"column:is_deleted" db:"is_deleted" json:"is_deleted,omitempty"`
	// Foreign key constraint
	NoKartuKeluarga *KartuKeluarga `gorm:"foreignKey:NoKartuKeluargaID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"-"`
}

func (Kependudukan) TableName() string {
	return "kependudukan"
}
