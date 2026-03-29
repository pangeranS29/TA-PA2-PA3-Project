package models

import (
	"log"

	"gorm.io/gorm"
)

func RunMigrations(db *gorm.DB) error {
	log.Println("Running database migrations...")

	// Urutan penting: parent tables dulu, baru child tables
	err := db.AutoMigrate(
	// &models.CatatanPertumbuhan{},
	// &models.MasterStandarAntropometri{},
	)

	if err != nil {
		log.Printf("Error running migrations: %v", err)
		return err
	}

	log.Println("Database migrations completed successfully")
	return nil
}
