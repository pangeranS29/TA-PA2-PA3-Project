package models

type StandarBBU  struct {
	JenisKelamin string  `gorm:"type:char(10);primaryKey"` 
	UmurBulan    int     `gorm:"primaryKey"`

	MinSD3       float64 `gorm:"type:decimal(5,2)"`
	MinSD2       float64 `gorm:"type:decimal(5,2)"`
	Median       float64 `gorm:"type:decimal(5,2)"`
	PlusSD2      float64 `gorm:"type:decimal(5,2)"`
	PlusSD3      float64 `gorm:"type:decimal(5,2)"`
}

func (StandarBBU) TableName() string {
	return "standar_bb_u"
}