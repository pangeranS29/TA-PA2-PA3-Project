package models

import "time"

type Ibu struct {
	ID             uint      `gorm:"primaryKey;column:id" db:"id" json:"id"`
	KependudukanID *uint     `gorm:"column:kependudukan_id;uniqueIndex" db:"kependudukan_id" json:"kependudukan_id,omitempty"`
	CreatedAt      time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt      time.Time `gorm:"column:updated_at" json:"updated_at"`
	Isdeleted      time.Time `gorm:"column:is_deleted" json:"is_deleted,omitempty"`
	// Foreign key constraint
	Kependudukan *Kependudukan `gorm:"foreignKey:KependudukanID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"-"`
}

func (Ibu) TableName() string {
	return "ibu"
}
