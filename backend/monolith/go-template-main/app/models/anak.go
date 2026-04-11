package models

import "time"

type Anak struct {
	ID             uint      `gorm:"primaryKey;column:id" db:"id" json:"id"`
	KependudukanID uint      `gorm:"column:kependudukan_id" db:"kependudukan_id" json:"kependudukan_id"`
	BeratLahir     float64   `gorm:"column:berat_lahir" db:"berat_lahir" json:"berat_lahir"`
	TinggiLahir    float64   `gorm:"column:tinggi_lahir" db:"tinggi_lahir" json:"tinggi_lahir"`
	CreatedAt      time.Time `gorm:"column:created_at" db:"created_at" json:"created_at"`
	UpdatedAt      time.Time `gorm:"column:updated_at" db:"updated_at" json:"updated_at"`
	Isdeleted      time.Time `gorm:"column:is_deleted" db:"is_deleted" json:"is_deleted,omitempty"`

	// Foreign key constraint
	Kependudukan *Kependudukan `gorm:"foreignKey:KependudukanID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT" json:"-"`
}

func (Anak) TableName() string {
	return "anak"
}
