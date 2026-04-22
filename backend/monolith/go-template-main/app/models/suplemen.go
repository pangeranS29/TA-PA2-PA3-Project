package models

import "time"

type Suplemen struct {
	ID                 uint       `gorm:"primaryKey;column:id" db:"id" json:"id"`
	AnakID             int        `gorm:"column:anak_id" db:"anak_id" json:"anak_id"`
	KategoriSuplemenID int        `gorm:"column:kategori_suplemen_id" db:"kategori_suplemen_id" json:"kategori_suplemen_id"`
	Jawaban            *bool      `gorm:"column:jawaban" db:"jawaban" json:"jawaban,omitempty"`
	TanggalPemberian   *time.Time `gorm:"column:tanggal_pemberian" db:"tanggal_pemberian" json:"tanggal_pemberian,omitempty"`
	CreatedAt          time.Time  `gorm:"column:created_at" db:"created_at" json:"created_at"`
	UpdatedAt          time.Time  `gorm:"column:updated_at" db:"updated_at" json:"updated_at"`
	Isdeleted          time.Time  `gorm:"column:is_deleted" db:"is_deleted" json:"is_deleted,omitempty"`

	// Foreign key constraints
	Anak             *Anak             `gorm:"foreignKey:AnakID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT" json:"-"`
	KategoriSuplemen *KategoriSuplemen `gorm:"foreignKey:KategoriSuplemenID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT" json:"-"`
}

func (Suplemen) TableName() string {
	return "suplemen"
}
