package models

import "time"

type UserRole struct {
	UserID    uint      `gorm:"column:user_id;primaryKey" db:"user_id" json:"user_id"`
	RoleID    uint      `gorm:"column:role_id;primaryKey" db:"role_id" json:"role_id"`
	IsActive  bool      `gorm:"column:is_active;default:true" db:"is_active" json:"is_active"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at"`
	Isdeleted time.Time `gorm:"column:is_deleted" json:"is_deleted,omitempty"`

	// Relationships
	User *User `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"-"`
	Role *Role `gorm:"foreignKey:RoleID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"-"`
}

func (UserRole) TableName() string {
	return "user_roles"
}
