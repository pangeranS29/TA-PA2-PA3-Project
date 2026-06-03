package models

import "time"

type Posyandu struct {
	ID          int32      `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
<<<<<<< HEAD
	IDPuskesmas int32      `gorm:"column:id_puskesmas;not null" json:"id_puskesmas"`
=======
	IDPuskesmas int32      `gorm:"column:id_puskesmas;not null;index;constraint:OnDelete:CASCADE" json:"id_puskesmas"`
	// PenggunaID   	uint       `json:"id_pengguna" gorm:"column:id_pengguna;not null;index;constraint:OnDelete:CASCADE"`
	Puskesmas	  *Puskesmas  `json:"puskesmas,omitempty" gorm:"foreignKey:IDPuskesmas;constraint:OnDelete:CASCADE"`
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
	Nama        string     `gorm:"column:nama;type:varchar(255);not null" json:"nama"`
	Alamat      string     `gorm:"column:alamat;type:text" json:"alamat,omitempty"`
	CreatedAt   time.Time  `gorm:"column:created_at" json:"created_at"`
	UpdatedAt   time.Time  `gorm:"column:updated_at" json:"updated_at"`
	DeletedAt   *time.Time `gorm:"column:deleted_at" json:"deleted_at,omitempty"`
}

func (Posyandu) TableName() string { return "posyandu" }
