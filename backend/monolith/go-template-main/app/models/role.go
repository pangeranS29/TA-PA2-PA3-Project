package models

import "time"

type Role struct {
	ID          int64      `gorm:"column:id;primaryKey" json:"id"`
	Name        string     `gorm:"column:name" json:"name"`
	Description *string    `gorm:"column:description" json:"description,omitempty"`
	CreatedAt   *time.Time `gorm:"column:created_at" json:"created_at,omitempty"`
	UpdatedAt   *time.Time `gorm:"column:updated_at" json:"updated_at,omitempty"`
	IsDeleted   *time.Time `gorm:"column:is_deleted" json:"is_deleted,omitempty"`
}

func (Role) TableName() string {
	return "roles"
}
