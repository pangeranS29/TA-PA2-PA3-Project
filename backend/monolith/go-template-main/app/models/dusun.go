package models

type Dusun struct {
	ID       int32  `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	NamaDusun string `gorm:"column:nama_dusun;type:text" json:"nama_dusun"`
	DesaID   int32  `gorm:"column:desa_id;not null" json:"desa_id"`

	Desa Desa `gorm:"foreignKey:DesaID;references:ID" json:"desa,omitempty"`
}

func (Dusun) TableName() string { return "dusun" }
