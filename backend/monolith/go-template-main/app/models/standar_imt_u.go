package models

type StandarIMTU  struct {
	JenisKelamin string  `gorm:"type:char(1);primaryKey"` // L / P
	UmurBulan    int     `gorm:"primaryKey"`

	MinSD3       float64 `gorm:"type:decimal(5,2)"`
	MinSD2       float64 `gorm:"type:decimal(5,2)"`
	Median       float64 `gorm:"type:decimal(5,2)"`
	PlusSD2      float64 `gorm:"type:decimal(5,2)"`
	PlusSD3      float64 `gorm:"type:decimal(5,2)"`
}
func (StandarIMTU) TableName() string {
	return "standar_imt_u"
}