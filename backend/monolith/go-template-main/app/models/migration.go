package models

import (
	"gorm.io/gorm"
)

var defaultRoles = []string{
	"Tenaga-kesehatan",
	"Dokter",
	"Kader",
	"Bidan",
	"Orangtua",
}

func AutoMigrateAndSeed(db *gorm.DB) error {
	// auto migrate
	if err := db.AutoMigrate(
		&Role{},
		&KaderPosyandu{},
		&User{},
		&KartuKeluarga{},
		&Kependudukan{},
		&Ibu{},
		&Anak{},
		&MasterStandarAntropometri{},
		&CatatanPertumbuhan{},
		&KategoriCapaian{},
		&Perkembangan{},
	); err != nil {
		return err
	}

	for _, roleName := range defaultRoles {
		role := Role{Name: roleName}
		if err := db.Where(Role{Name: roleName}).FirstOrCreate(&role).Error; err != nil {
			return err
		}
	}

	// seeder
	// log.Println("AutoMigrate selesai. Menjalankan Seeder...")
	// seeder := seeders.NewSeeder(db)
	// if err := seeder.Run(); err != nil {
	// 	println("Error: seeder gagal dijalankan:", err.Error())
	// }

	return nil
}
