package models

import (
	"time"
)

type StatusKehamilan string

const (
	StatusAktif StatusKehamilan = "aktif"
)

type Kehamilan struct {
	IdKehamilan       uint            `gorm:"column:id_kehamilan;primaryKey;autoIncrement" json:"id_kehamilan"`
	FKIdIbu           uint            `gorm:"column:id_ibu;not null" json:"id_ibu"`
	KehamilanKe       uint8           `gorm:"column:kehamilan_ke;not null" json:"kehamilan_ke"`
	HPHT              *time.Time      `gorm:"column:hpht;type:date" json:"hpht"`
	HPLHPHT           *time.Time      `gorm:"column:hpl_hpht;type:date" json:"hpl_hpht"`
	HPLUSG            *time.Time      `gorm:"column:hpl_usg;type:date" json:"hpl_usg"`
	StatusKehamilan   StatusKehamilan `gorm:"column:status_kehamilan;type:text;not null" json:"status_kehamilan"`
	TinggiBadan       float32         `gorm:"column:tinggi_badan" json:"tinggi_badan"`
	UmurKehamilanHPHT uint8           `gorm:"column:umur_kehamilan_hpht" json:"umur_kehamilan_hpht"`
	UmurKehamilanUSG  uint8           `gorm:"column:umur_kehamilan_usg" json:"umur_kehamilan_usg"`
	CreatedAt         time.Time       `gorm:"column:created_at;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt         time.Time       `gorm:"column:updated_at" json:"updated_at"`

	// Relationship
	Ibu Ibu `gorm:"foreignKey:FKIdIbu;references:IdIbu" json:"ibu,omitempty"`
}

func (Kehamilan) TableName() string {
	return "kehamilan"
}
