package models

import "time"

// type User struct {
// 	ID          uint      `gorm:"column:id;primaryKey" json:"id"`
// 	Name        string    `gorm:"column:nama;type:varchar(120);not null" json:"name"`
// 	Email       string    `gorm:"column:email;type:varchar(120);not null;uniqueIndex" json:"email"`
// 	PhoneNumber string    `gorm:"column:nomor_telepon;type:varchar(20);uniqueIndex" json:"phone_number"`
// 	Password    string    `gorm:"column:kata_sandi;type:text;not null" json:"-"`
// 	RoleID      uint      `gorm:"column:id_role;not null;index" json:"role_id"`
// 	Role        Role      `gorm:"foreignKey:RoleID;references:ID" json:"role"`
// 	CreatedAt   time.Time `gorm:"column:created_at" json:"created_at"`
// 	UpdatedAt   time.Time `gorm:"column:updated_at" json:"updated_at"`
// }
type User struct {
	ID          uint      `gorm:"column:id;primaryKey" json:"id"`
	Name        string    `gorm:"column:nama;type:varchar(120);not null" json:"name"`
	Email       string    `gorm:"column:email;type:varchar(120);not null;uniqueIndex" json:"email"`
	PhoneNumber string    `gorm:"column:nomor_telepon;type:varchar(20);uniqueIndex" json:"phone_number"`
	Password    string    `gorm:"column:kata_sandi;type:text;not null" json:"-"`
	CreatedAt   time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt   time.Time `gorm:"column:updated_at" json:"updated_at"`
	Isdeleted   time.Time `gorm:"column:is_deleted" json:"is_deleted,omitempty"`

	// Many-to-many relationship with roles
	Role []Role `gorm:"many2many:user_roles" json:"roles,omitempty"`

	// Profile relationships (one-to-one)
	Ibu              *Ibu              `gorm:"foreignKey:UserID" json:"ibu,omitempty"`
	KaderPosyandu    *KaderPosyandu    `gorm:"foreignKey:UserID" json:"kader_posyandu,omitempty"`
	PetugasKesehatan *PetugasKesehatan `gorm:"foreignKey:UserID" json:"petugas_kesehatan,omitempty"`
}

func (User) TableName() string {
	return "pengguna"
}
