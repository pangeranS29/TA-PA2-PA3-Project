package models

type Desa struct {
	ID       int32  `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	NamaDesa string `gorm:"column:nama_desa;type:text" json:"nama_desa"`
}

func (Desa) TableName() string { return "desa" }
