package models

import (
	"time"

	"gorm.io/gorm"
)

type Bbl struct {
	ID        int32          `json:"id" gorm:"primaryKey;autoIncrement"`
	AnakID    int32          `json:"anak_id" gorm:"not null;uniqueIndex"`
	Anak      *Anak          `json:"anak,omitempty" gorm:"foreignKey:AnakID"`
	Jam06     bool           `json:"jam_0_6" gorm:"column:jam_0_6;default:false"`
	Jam648    bool           `json:"jam_6_48" gorm:"column:jam_6_48;default:false"`
	Hari37    bool           `json:"hari_3_7" gorm:"column:hari_3_7;default:false"`
	Hari828   bool           `json:"hari_8_28" gorm:"column:hari_8_28;default:false"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

func (Bbl) TableName() string {
	return "bbl"
}
