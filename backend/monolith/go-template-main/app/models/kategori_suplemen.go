package models

import "time"

type KategoriSuplemen struct {
	ID             uint      `gorm:"primaryKey;column:id" db:"id" json:"id"`
	NamaSuplemen   string    `gorm:"column:nama_suplemen" db:"nama_suplemen" json:"nama_suplemen"`
	BulanPemberian string    `gorm:"column:bulan_pemberian" db:"bulan_pemberian" json:"bulan_pemberian"`
	MinimalUsia    int       `gorm:"column:minimal_usia" db:"minimal_usia" json:"minimal_usia"`
	CreatedAt      time.Time `gorm:"column:created_at" db:"created_at" json:"created_at"`
	UpdatedAt      time.Time `gorm:"column:updated_at" db:"updated_at" json:"updated_at"`
	Isdeleted      time.Time `gorm:"column:is_deleted" db:"is_deleted" json:"is_deleted,omitempty"`
}

func (KategoriSuplemen) TableName() string {
	return "kategori_suplemen"
}
