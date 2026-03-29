package models

import "time"

// MasterStandarAntropometri berisi standar WHO/Kemenkes untuk perhitungan Z-Score
type MasterStandarAntropometri struct {
	ID           uint       `gorm:"primaryKey;column:id" db:"id" json:"id"`
	Parameter    string     `gorm:"column:parameter;type:varchar;not null;index" db:"parameter" json:"parameter"` // bb_u, tb_u, imt_u, bb_tb
	JenisKelamin GenderType `gorm:"column:jenis_kelamin;type:gender_type;not null;index" db:"jenis_kelamin" json:"jenis_kelamin"`
	NilaiSumbuX  float64    `gorm:"column:nilai_sumbu_x;type:decimal;not null" db:"nilai_sumbu_x" json:"nilai_sumbu_x"` // Umur (bulan) atau Tinggi Badan (cm)
	SD3Neg       float64    `gorm:"column:sd_3_neg;type:decimal" db:"sd_3_neg" json:"sd_3_neg"`
	SD2Neg       float64    `gorm:"column:sd_2_neg;type:decimal" db:"sd_2_neg" json:"sd_2_neg"`
	Median       float64    `gorm:"column:median;type:decimal" db:"median" json:"median"`
	SD2Pos       float64    `gorm:"column:sd_2_pos;type:decimal" db:"sd_2_pos" json:"sd_2_pos"`
	SD3Pos       float64    `gorm:"column:sd_3_pos;type:decimal" db:"sd_3_pos" json:"sd_3_pos"`
	CreatedAt    time.Time  `gorm:"column:created_at" db:"created_at" json:"created_at"`
}

func (MasterStandarAntropometri) TableName() string {
	return "master_standar_antropometri"
}
