package models

import "time"

type Ibu struct {
	ID           uint      `gorm:"primaryKey;column:id" db:"id" json:"id"`
	UserID       *int      `gorm:"column:user_id;uniqueIndex;not null" db:"user_id" json:"user_id,omitempty"`
	Nik          int64     `gorm:"column:nik;uniqueIndex" db:"nik" json:"nik"`
	Nama         string    `gorm:"column:nama" db:"nama" json:"nama"`
	TanggalLahir time.Time `gorm:"column:tanggal_lahir" db:"tanggal_lahir" json:"tanggal_lahir"`
	Alamat       string    `gorm:"column:alamat" db:"alamat" json:"alamat,omitempty"`
	Pekerjaan    string    `gorm:"column:pekerjaan" db:"pekerjaan" json:"pekerjaan,omitempty"`
	Pendidikan   string    `gorm:"column:pendidikan" db:"pendidikan" json:"pendidikan,omitempty"`
	CreatedAt    time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt    time.Time `gorm:"column:updated_at" json:"updated_at"`
	Isdeleted    time.Time `gorm:"column:is_deleted" json:"is_deleted,omitempty"`
	// Foreign key constraint
	User *User `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"-"`
}

func (Ibu) TableName() string {
	return "ibu"
}
