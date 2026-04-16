package models

import "time"

type IbuHamil struct {
	ID              int32      `gorm:"primaryKey" json:"id"`
	UserID          *int32     `gorm:"index" json:"user_id"`
	User            *User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	NamaIbu         string     `gorm:"type:varchar(255);not null" json:"nama_ibu"`
	NIK             string     `gorm:"type:char(16);unique" json:"nik"`
	// HPHT            *time.Time `gorm:"type:date" json:"hpht"`
	Usia            int        `json:"usia"`
	Dusun           string     `gorm:"type:varchar(50)" json:"dusun"`
	StatusKehamilan string     `gorm:"type:varchar(20)" json:"statusKehamilan"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

func (IbuHamil) TableName() string {
	return "ibu_hamil"
}
