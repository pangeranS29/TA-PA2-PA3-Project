package models

type StatusKunjungan struct {
	ID         uint   `gorm:"column:id;primaryKey" json:"id"`
	NamaStatus string `gorm:"column:nama_status;type:text" json:"nama_status"`
}

func (StatusKunjungan) TableName() string {
	return "status_kunjungan"
}
