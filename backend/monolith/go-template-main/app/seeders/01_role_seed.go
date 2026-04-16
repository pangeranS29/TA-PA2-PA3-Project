package seeders

import (
	"gorm.io/gorm"
	"monitoring-service/app/models"
)

func SeedRole(db *gorm.DB) error {
	var role models.Role

	if err := db.Where("nama = ?", "Orangtua").FirstOrCreate(&role, models.Role{Name: "Orangtua"}).Error; err != nil {
		return err
	}
	
	return nil;
}

