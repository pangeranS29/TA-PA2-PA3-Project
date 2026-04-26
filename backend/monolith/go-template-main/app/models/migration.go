package models

import (
	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) error {
	// Semua model dalam satu slice
	models := []interface{}{
		// Master
		// &KategoriTandaBahaya{},
		&SkriningPemantauan{},
		// &KartuKeluarga{},
		// &Kependudukan{},

		// // Monitoring
		// &SkriningPemantauan{},
	}

	// Jalankan automigrate sekali saja
	if err := db.AutoMigrate(models...); err != nil {
		return err
	}

	// seeder
	// log.Println("AutoMigrate selesai. Menjalankan Seeder...")
	// seeder := seeders.NewSeeder(db)
	// if err := seeder.Run(); err != nil {
	// 	println("Error: seeder gagal dijalankan:", err.Error())
	// }

	return nil
}
