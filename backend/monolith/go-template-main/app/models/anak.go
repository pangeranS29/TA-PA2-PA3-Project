package models

import "time"

type Anak struct {
	ID              uint      `gorm:"primaryKey;column:id" db:"id" json:"id"`
	IbuID           *uint     `gorm:"column:ibu_id;index" db:"ibu_id" json:"ibu_id,omitempty"`
	KependudukanID  *uint     `gorm:"column:kependudukan_id;index" db:"kependudukan_id" json:"kependudukan_id,omitempty"`
	NoKartuKeluarga int64     `gorm:"column:no_kartu_keluarga" db:"no_kartu_keluarga" json:"no_kartu_keluarga,omitempty"`
	NamaAnak        string    `gorm:"column:nama_anak" db:"nama_anak" json:"nama_anak,omitempty"`
	JenisKelamin    string    `gorm:"column:jenis_kelamin" db:"jenis_kelamin" json:"jenis_kelamin,omitempty"`
	TanggalLahir    string    `gorm:"column:tanggal_lahir" db:"tanggal_lahir" json:"tanggal_lahir,omitempty"`
	BeratLahir      float64   `gorm:"column:berat_lahir" db:"berat_lahir" json:"berat_lahir"`
	TinggiLahir     float64   `gorm:"column:tinggi_lahir" db:"tinggi_lahir" json:"tinggi_lahir"`
	CreatedAt       time.Time `gorm:"column:created_at" db:"created_at" json:"created_at"`
	UpdatedAt       time.Time `gorm:"column:updated_at" db:"updated_at" json:"updated_at"`
	Isdeleted       time.Time `gorm:"column:is_deleted" db:"is_deleted" json:"is_deleted,omitempty"`

	// Foreign key constraint
	Ibu          *Ibu          `gorm:"foreignKey:IbuID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"-"`
	Kependudukan *Kependudukan `gorm:"foreignKey:KependudukanID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"-"`
}

func (Anak) TableName() string {
	return "anak"
}
