package models

type StandarBBTB struct {
	JenisKelamin string  `gorm:"type:char(1);primaryKey"`
	TinggiBadan  float64 `gorm:"type:decimal(5,2);primaryKey"`

	MinSD3  float64 `gorm:"type:decimal(5,2)"`
	MinSD2  float64 `gorm:"type:decimal(5,2)"`
	Median  float64 `gorm:"type:decimal(5,2)"`
	PlusSD2 float64 `gorm:"type:decimal(5,2)"`
	PlusSD3 float64 `gorm:"type:decimal(5,2)"`
}
