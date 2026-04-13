package models

import (
	"time"
)

type IbuHamil struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	UserID    *uint      `gorm:"index" json:"user_id"`
	User      *User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	NamaIbu   string     `gorm:"type:varchar(255);not null" json:"nama_ibu"`
	NIK       string     `gorm:"type:char(16);unique" json:"nik"`
	HPHT      *time.Time `gorm:"type:date" json:"hpht"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

func (IbuHamil) TableName() string {
	return "ibu_hamil"
}
