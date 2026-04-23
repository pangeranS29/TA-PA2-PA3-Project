package models

import "time"

type Vaksin struct {
	ID        		uint      	`gorm:"column:id;primaryKey" json:"id	"`
	Name      		string    	`gorm:"column:nama;type:varchar(50);not null" json:"nama"`
	Deskripsi    	string 		`gorm:"column:deskripsi;type:text;not null" json:"deskripsi"`
	EfekSamping    	string 		`gorm:"column:efek_samping;type:text;not null" json:"efek_samping"`
	CreatedAt 		time.Time 	`gorm:"column:created_at" json:"created_at"`
	UpdatedAt 		time.Time 	`gorm:"column:updated_at" json:"updated_at"`
	DeletedAt     	time.Time   `gorm:"column:deleted_at" json:"deleted_at"`
}

func (Vaksin) TableName() string {
	return "vaksin"
}

type CreateVaksinRequest struct {
	Name        string `json:"nama"`
	Deskripsi   string `json:"deskripsi"`
	EfekSamping string `json:"efek_samping"`
}

type UpdateVaksinRequest struct {
	Nama        string `json:"nama"`
	Deskripsi   string `json:"deskripsi"`
	EfekSamping string `json:"efek_samping"`
}