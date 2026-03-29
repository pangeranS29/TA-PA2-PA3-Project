package models

import "time"

type PetugasKesehatan struct {
	UserID         uint      `gorm:"primaryKey;column:user_id" db:"user_id" json:"user_id"`
	JenisPetugasID uint      `gorm:"column:jenis_petugas_id;not null;index" db:"jenis_petugas_id" json:"jenis_petugas_id"`
	Nip            string    `gorm:"column:nip;uniqueIndex;not null" db:"nip" json:"nip"`
	Institusi      string    `gorm:"column:institusi;not null" db:"institusi" json:"institusi"`
	Jabatan        string    `gorm:"column:jabatan" db:"jabatan" json:"jabatan,omitempty"`
	NoStr          string    `gorm:"column:no_str" db:"no_str" json:"no_str,omitempty"` // Surat Tanda Registrasi
	NoSip          string    `gorm:"column:no_sip" db:"no_sip" json:"no_sip,omitempty"` // Surat Izin Praktik
	CreatedAt      time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt      time.Time `gorm:"column:updated_at" json:"updated_at"`
	Isdeleted      time.Time `gorm:"column:is_deleted" json:"is_deleted,omitempty"`

	// Relationships
	User         *User                  `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"-"`
	JenisPetugas *JenisPetugasKesehatan `gorm:"foreignKey:JenisPetugasID;references:ID" json:"role,omitempty"`
}

func (PetugasKesehatan) TableName() string {
	return "petugas_kesehatan"
}

type JenisPetugasKesehatan struct {
	ID        uint      `gorm:"column:id;primaryKey" json:"id"`
	Nama      string    `gorm:"column:nama;type:varchar(50);not null;uniqueIndex" json:"name"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at"`
	Isdeleted time.Time `gorm:"column:is_deleted" json:"is_deleted,omitempty"`
}

func (JenisPetugasKesehatan) TableName() string {
	return "jenis_petugas_kesehatan"
}
