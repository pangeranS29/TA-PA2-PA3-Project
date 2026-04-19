package models

import "time"

type KartuKeluarga struct {
	ID              uint      `gorm:"primaryKey;column:id" db:"id" json:"id"`
	UserID          *uint     `gorm:"column:user_id;index" db:"user_id" json:"user_id,omitempty"`
	NoKartuKeluarga int64     `gorm:"column:no_kartu_keluarga" db:"no_kartu_keluarga" json:"no_kartu_keluarga"`
	TanggalTerbit   string    `gorm:"column:tanggal_terbit" db:"tanggal_terbit" json:"tanggal_terbit"`
	Alamat          string    `gorm:"column:alamat" db:"alamat" json:"alamat,omitempty"`
	RTRW            string    `gorm:"column:rt_rw" db:"rt_rw" json:"rt_rw,omitempty"`
	CreatedAt       time.Time `gorm:"column:created_at" db:"created_at" json:"created_at"`
	UpdatedAt       time.Time `gorm:"column:updated_at" db:"updated_at" json:"updated_at"`
	Isdeleted       time.Time `gorm:"column:is_deleted" db:"is_deleted" json:"is_deleted,omitempty"`
	// Foreign key constraint
	User *User `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"-"`
}

func (KartuKeluarga) TableName() string {
	return "kartu_keluarga"
}
