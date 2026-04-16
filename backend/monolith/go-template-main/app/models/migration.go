package models

import "gorm.io/gorm"

var defaultRoles = []string{
	"Tenaga-kesehatan",
	"Dokter",
	"Kader",
	"Bidan",
	"Orangtua",
}

func AutoMigrateAndSeed(db *gorm.DB) error {
	if err := db.AutoMigrate(&Role{}, &User{}, &Kependudukan{}, &Ibu{}, &Kehamilan{}, &RiwayatKehamilan{}, &PemeriksaanANC{}, 
		&SkriningPreeklampsiaDanDiabetes{}, &Janin{}, &USGTrimester1{}, &USGTrimester2{}, &USGTrimester3{}); err != nil {
		return err
	}

	for _, roleName := range defaultRoles {
		role := Role{Name: roleName}
		if err := db.Where(Role{Name: roleName}).FirstOrCreate(&role).Error; err != nil {
			return err
		}
	}

	return nil
}
