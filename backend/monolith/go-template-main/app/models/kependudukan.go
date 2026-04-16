package models

import "time"

type Kependudukan struct {
	IDKependudukan int32  `gorm:"primaryKey;autoIncrement" json:"id_kependudukan"`
	NoKK           string `gorm:"type:varchar(20);not null;index" json:"no_kk"`
	// Kebabura           *Kebabura  `gorm:"foreignKey:NoKK;references:NoKK" json:"kebabura,omitempty"`
	NIK                string     `gorm:"type:varchar(20);uniqueIndex;not null" json:"nik"`
	Dusun              string     `gorm:"type:varchar(50)" json:"dusun"`
	NamaLengkap        string     `gorm:"type:text;not null" json:"nama_lengkap"`
	GolonganDarah      string     `gorm:"type:text" json:"golongan_darah"`
	JenisKelamin       string     `gorm:"type:varchar(20);not null" json:"jenis_kelamin"`
	TempatLahir        string     `gorm:"type:varchar(100)" json:"tempat_lahir"`
	TanggalLahir       time.Time  `gorm:"type:date;not null" json:"tanggal_lahir"`
	Pekerjaan          string     `gorm:"type:varchar(100)" json:"pekerjaan"`
	PendidikanTerakhir string     `gorm:"type:varchar(50)" json:"pendidikan_terakhir"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
	IsDeleted          *time.Time `json:"is_deleted,omitempty"`
}

func (Kependudukan) TableName() string { return "kependudukan" }
