package models

import (
	"gorm.io/gorm"
)

// AutoMigrateEdukasi runs AutoMigrate for the edukasi-related models
// and inserts a minimal sample row per table if the table is empty.
func AutoMigrateEdukasi(db *gorm.DB) error {
	models := []interface{}{
		&EdukasiImd{},
		&EdukasiTrimester{},
		&EdukasiKesehatanMental{},
		&EdukasiMenyusuiASI{},
		&EdukasiSetelahMelahirkan{},
		&EdukasiTandaMelahirkan{},
	}

	if err := db.AutoMigrate(models...); err != nil {
		return err
	}

	// Seed minimal sample data if tables are empty (used as proof of connection)
	var cnt int64

	db.Model(&EdukasiImd{}).Count(&cnt)
	if cnt == 0 {
		db.Create(&EdukasiImd{Judul: "Contoh IMD", GambarURL: "", Isi: "Isi contoh edukasi IMD"})
	}

	db.Model(&EdukasiTrimester{}).Count(&cnt)
	if cnt == 0 {
		db.Create(&EdukasiTrimester{Judul: "Contoh Trimester", GambarURL: "", IsiKonten: "Isi contoh edukasi trimester"})
	}

	db.Model(&EdukasiKesehatanMental{}).Count(&cnt)
	if cnt == 0 {
		db.Create(&EdukasiKesehatanMental{Judul: "Contoh Kesehatan Mental", GambarURL: "", Deskripsi: "Ringkasan", Isi: "Isi contoh"})
	}

	db.Model(&EdukasiMenyusuiASI{}).Count(&cnt)
	if cnt == 0 {
		db.Create(&EdukasiMenyusuiASI{Judul: "Contoh Menyusui ASI", GambarURL: "", Isi: "Isi contoh"})
	}

	db.Model(&EdukasiSetelahMelahirkan{}).Count(&cnt)
	if cnt == 0 {
		db.Create(&EdukasiSetelahMelahirkan{Judul: "Contoh Setelah Melahirkan", GambarURL: "", Isi: "Isi contoh"})
	}

	db.Model(&EdukasiTandaMelahirkan{}).Count(&cnt)
	if cnt == 0 {
		db.Create(&EdukasiTandaMelahirkan{Judul: "Contoh Tanda Melahirkan", GambarURL: "", Ringkasan: "Ringkasan contoh", Isi: "Isi contoh"})
	}

	return nil
}
