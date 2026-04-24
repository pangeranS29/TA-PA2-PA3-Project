package models

// import (
// 	"time"

// 	"gorm.io/gorm"
// )

// type Penduduk struct {
// 	ID int32 `gorm:"primaryKey"`

// 	KartuKeluargaID *int32         `gorm:"column:kartu_keluarga_id;index"`
// 	KartuKeluarga   *KartuKeluarga `gorm:"foreignKey:KartuKeluargaID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

// 	NIK          string     `gorm:"type:varchar(16);uniqueIndex;not null"`
// 	NamaLengkap  string     `gorm:"type:text;not null"`
// 	JenisKelamin string     `gorm:"type:char(1);not null;check:jenis_kelamin IN ('L','P')"`
// 	TanggalLahir *time.Time `gorm:"type:date"`
// 	TempatLahir  string     `gorm:"type:text"`

// 	GolonganDarah      string `gorm:"type:varchar(2);check:golongan_darah IN ('A','B','AB','O','-')"`
// 	Agama              string `gorm:"type:varchar(20)"`
// 	StatusPerkawinan   string `gorm:"type:varchar(20)"`
// 	PendidikanTerakhir string `gorm:"type:varchar(50)"`
// 	Pekerjaan          string `gorm:"type:text"`

// 	BacaHuruf         string `gorm:"type:char(1);check:baca_huruf IN ('Y','T')"` // Ya / Tidak
// 	KedudukanKeluarga string `gorm:"type:varchar(20)"`
// 	Dusun             string `gorm:"type:varchar(100)"`

// 	TanggalPenambahan  *time.Time `gorm:"type:date"`
// 	AsalPenduduk       string     `gorm:"type:varchar(50)"`
// 	TanggalPengurangan *time.Time `gorm:"type:date"`
// 	TujuanPindah       string     `gorm:"type:text"`
// 	TempatMeninggal    string     `gorm:"type:text"`

// 	Keterangan   string `gorm:"type:text"`
// 	NomorTelepon string `gorm:"type:varchar(15)"`

// 	CreatedAt time.Time
// 	UpdatedAt time.Time
// 	DeletedAt gorm.DeletedAt `gorm:"index"`
// }

// // nama tabel fix (tidak plural)
// func (Penduduk) TableName() string {
// 	return "penduduk"
// }
