package models

import "time"

type Ibu struct {
	ID         int32      `gorm:"primaryKey;autoIncrement" json:"id"`
	PendudukID int64      `gorm:"not null;uniqueIndex" json:"penduduk_id"`
	Penduduk   *Penduduk  `gorm:"foreignKey:PendudukID;references:ID" json:"penduduk,omitempty"`
	Gravida    *int32     `json:"gravida,omitempty"`
	Paritas    *int32     `json:"paritas,omitempty"`
	Abortus    *int32     `json:"abortus,omitempty"`
	CreatedAt  *time.Time `json:"created_at"`
	UpdatedAt  *time.Time `json:"updated_at"`
	IsDeleted  *time.Time `json:"is_deleted,omitempty"`
}

func (Ibu) TableName() string { return "ibu" }
