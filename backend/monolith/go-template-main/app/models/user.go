package models

import "time"

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"type:varchar(120);not null" json:"name"`
	Email     string    `gorm:"type:varchar(120);not null;uniqueIndex" json:"email"`
	Password  string    `gorm:"type:text;not null" json:"-"`
	RoleID    uint      `gorm:"not null;index" json:"role_id"`
	Role      Role      `gorm:"foreignKey:RoleID;references:ID" json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (User) TableName() string {
	return "users"
}
