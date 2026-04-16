package seeders

import (
	"gorm.io/gorm"
)

func RunAllSeeders(db *gorm.DB) error {
	if err := SeedRole(db); err != nil { return err }
	if err := SeedUser(db); err != nil { return err }
	if err := SeedKependudukan(db); err != nil { return err }
	if err := SeedIbu(db); err != nil { return err }
	if err := SeedKehamilan(db); err != nil { return err }
	if err := SeedRiwayatKehamilan(db); err != nil { return err }
	if err := SeedPemeriksaanANC(db); err != nil { return err }
	if err := SeedSkriningPreeklampsia(db); err != nil { return err }
	if err := SeedJanin(db); err != nil { return err }
	if err := SeedUSGTrimester1(db); err != nil { return err }
	if err := SeedUSGTrimester2(db); err != nil { return err }
	if err := SeedUSGTrimester3(db); err != nil { return err }

	return nil
}