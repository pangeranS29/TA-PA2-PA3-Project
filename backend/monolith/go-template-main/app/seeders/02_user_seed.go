package seeders

import (
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

func SeedUser(db *gorm.DB) error {
	var roleModel models.Role
	if err := db.Where("nama = ?", "Orangtua").First(&roleModel).Error; err != nil {
			return err
	}

	userData := []struct {
		Name        string
		Email       string
		PhoneNumber string
		Password    string
	}{
		{"Sorta Lumbantoruan", "sorta@gmail.com", "081266443321", "sorta123"},
		{"Melati Simanjuntak", "melati@gmail.com", "085277881122", "melati123"},
		{"Siti Aminah Matondang", "siti@gmail.com", "081355667788", "siti123"},
		{"Rohani Napitupulu", "rohani@gmail.com", "081311229900", "rohani123"},
		{"Tiurma Siahaan", "tiurma@gmail.com", "082165432100", "tiurma123"},
		{"Dumasi Hutajulu", "dumasi@gmail.com", "081299887766", "dumasi123"},
		{"Lambok Gultom", "lambok@gmail.com", "085312345678", "lambok123"},
		{"Pesta Sibarani", "pesta@gmail.com", "081199001122", "pesta123"},
		{"Nurainun Pasaribu", "nurainun@gmail.com", "082277665544", "nurainun123"},
		{"Hamidah Situmorang", "hamidah@gmail.com", "081388776655", "hamidah123"},
	}

	now := time.Now()
	for _, d := range userData {
		user := models.User{
			Name:        d.Name,
			Email:       d.Email,
			RoleID:      roleModel.ID,
			PhoneNumber: d.PhoneNumber,
			Password:    d.Password,
			CreatedAt:   now,
			UpdatedAt:   now,
		}
		if err := db.Where(models.User{Email: d.Email}).FirstOrCreate(&user).Error; err != nil {
			return err
		}
	}
	return nil
}
