package models

import "time"

type User struct {
	ID           int64      `gorm:"column:id;primaryKey" json:"id"`
	PendudukID   *int64     `gorm:"column:penduduk_id" json:"penduduk_id,omitempty"`
	NomorTelepon string     `gorm:"column:nomor_telepon" json:"nomor_telepon"`
	KataSandi    string     `gorm:"column:kata_sandi" json:"-"`
	RolesID      *int64     `gorm:"column:roles_id" json:"roles_id,omitempty"`
	Email        string     `gorm:"column:email" json:"email,omitempty"`
	CreatedAt    *time.Time `gorm:"column:created_at" json:"created_at,omitempty"`
	UpdatedAt    *time.Time `gorm:"column:updated_at" json:"updated_at,omitempty"`
	IsDeleted    bool       `gorm:"column:isdeleted" json:"isdeleted"`

	Role Role `gorm:"foreignKey:RolesID;references:ID" json:"role,omitempty"`
}

func (User) TableName() string {
	return "users"
}
