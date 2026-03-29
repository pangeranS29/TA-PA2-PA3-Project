package models

import "time"

type Role struct {
	ID        uint      `gorm:"column:id;primaryKey" json:"id"`
	Name      string    `gorm:"column:nama;type:varchar(50);not null;uniqueIndex" json:"name"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at"`
	Isdeleted time.Time `gorm:"column:is_deleted" json:"is_deleted,omitempty"`
}

func (Role) TableName() string {
	return "roles"
}
