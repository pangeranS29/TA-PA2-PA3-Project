package models

type Puskesmas struct {
	ID          int32      `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Nama        string     `gorm:"column:nama;type:varchar(255);not null" json:"nama"`
	Alamat      string     `gorm:"column:alamat;type:text" json:"alamat,omitempty"`
	NoTelepon   string     `gorm:"column:no_telepon;type:text" json:"no_telepon,omitempty"`
}

func (Puskesmas) TableName() string { return "puskesmas" }
