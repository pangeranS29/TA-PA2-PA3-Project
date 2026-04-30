package models

type Puskesmas struct {
	ID         int32  `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	UserID     uint   `gorm:"column:id_pengguna;uniqueIndex" json:"user_id"`
	User       *User  `json:"user,omitempty" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	Nama       string `gorm:"column:nama;type:varchar(255);not null" json:"nama"`
	Alamat     string `gorm:"column:alamat;type:varchar(255);" json:"alamat"`
	Kecamatan  string `gorm:"column:kecamatan;type:varchar(100);" json:"kecamatan"`
	NamaKepala string `gorm:"column:nama_kepala;type:text;" json:"nama_kepala"`
	NoTelepon  string `gorm:"column:no_telepon;type:varchar(20);" json:"no_telepon"`
}

func (Puskesmas) TableName() string {
	return "puskesmas"
}
