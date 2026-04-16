package models

import "time"

type Janin struct {
	IdJanin       uint      `gorm:"column:id_janin;primaryKey;autoIncrement" json:"id_janin"`
	FKIdKehamilan uint      `gorm:"column:id_kehamilan;not null;uniqueIndex:index_label_janin" json:"id_kehamilan"`
	LabelJanin    string    `gorm:"column:label_janin;type:varchar(1);not null;uniqueIndex:index_label_janin" json:"label_janin"` // Misal: 'A' atau 'B'
	CreatedAt     time.Time `gorm:"column:created_at;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt     time.Time `gorm:"column:updated_at" json:"updated_at"`

	// Relationship
	Kehamilan Kehamilan `gorm:"foreignKey:FKIdKehamilan;references:IdKehamilan" json:"-"`
}

func (Janin) TableName() string {
	return "Janin"
}