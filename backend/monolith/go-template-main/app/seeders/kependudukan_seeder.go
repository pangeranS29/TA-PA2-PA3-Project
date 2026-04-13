// seeds/kependudukan_seeder.go
package seeders

import (
	"log"
	"time"

	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type KependudukanSeeder struct {
	db *gorm.DB
}

func NewKependudukanSeeder(db *gorm.DB) *KependudukanSeeder {
	return &KependudukanSeeder{db: db}
}

func (s *KependudukanSeeder) Seed() error {
	log.Println("Starting kependudukan and anak seeding...")

	// Seed kependudukan data
	if err := s.seedKependudukan(); err != nil {
		return err
	}

	// Seed anak data
	if err := s.seedAnak(); err != nil {
		return err
	}

	log.Println("Kependudukan and anak seeding completed!")
	return nil
}

func (s *KependudukanSeeder) seedKependudukan() error {
	now := time.Now()

	// Data contoh kependudukan (1 Keluarga: Ayah, Ibu, 2 Anak)
	kependudukanList := []models.Kependudukan{
		{
			NoKartuKeluarga: 3171234567890101,
			Nik:             3171234567890001,
			Nama:            "Budi Santoso",
			JenisKelamin:    "Laki-laki",
			TanggalLahir:    "1990-05-10",
			TempatLahir:     "Jakarta",
			GolonganDarah:   "O",
			Dusun:           "Mawar",
			// HubunganKeluarga: "Kepala Keluarga",
			CreatedAt: now,
			UpdatedAt: now,
		},
		{
			NoKartuKeluarga: 3171234567890101,
			Nik:             3171234567890002,
			Nama:            "Siti Aminah",
			JenisKelamin:    "Perempuan",
			TanggalLahir:    "1992-08-20",
			TempatLahir:     "Bandung",
			GolonganDarah:   "A",
			Dusun:           "Mawar",
			// HubunganKeluarga: "Istri",
			CreatedAt: now,
			UpdatedAt: now,
		},
		{
			NoKartuKeluarga: 3171234567890101,
			Nik:             3171234567890003, // NIK untuk disemai ke tabel Anak
			Nama:            "Ahmad Santoso",
			JenisKelamin:    "Laki-laki",
			TanggalLahir:    "2020-10-15",
			TempatLahir:     "Jakarta",
			GolonganDarah:   "O",
			Dusun:           "Mawar",
			// HubunganKeluarga: "Anak",
			CreatedAt: now,
			UpdatedAt: now,
		},
		{
			NoKartuKeluarga: 3171234567890101,
			Nik:             3171234567890004, // NIK untuk disemai ke tabel Anak
			Nama:            "Rina Santoso",
			JenisKelamin:    "Perempuan",
			TanggalLahir:    "2023-01-25",
			TempatLahir:     "Jakarta",
			GolonganDarah:   "A",
			Dusun:           "Mawar",
			// HubunganKeluarga: "Anak",
			CreatedAt: now,
			UpdatedAt: now,
		},
		{
			NoKartuKeluarga: 3171234567890101,
			Nik:             3171234567890005, // NIK untuk disemai ke tabel Anak
			Nama:            "Nahes Purba",
			JenisKelamin:    "Laki-laki",
			TanggalLahir:    "2025-12-09",
			TempatLahir:     "Jakarta",
			GolonganDarah:   "A",
			Dusun:           "Luman Batu",
			// HubunganKeluarga: "Anak",
			CreatedAt: now,
			UpdatedAt: now,
		},
	}

	for _, k := range kependudukanList {
		var existing models.Kependudukan
		err := s.db.Where("nik = ?", k.Nik).First(&existing).Error

		// Jika tidak ditemukan, buat data baru
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := s.db.Create(&k).Error; err != nil {
					log.Printf("Error creating Kependudukan (NIK: %d): %v\n", k.Nik, err)
					return err
				}
			} else {
				return err
			}
		}
	}

	return nil
}

func (s *KependudukanSeeder) seedAnak() error {
	now := time.Now()

	// Mapping berat dan tinggi anak berdasarkan NIK
	dataAnakMap := map[int64]models.Anak{
		3171234567890003: {BeratLahir: 3.2, TinggiLahir: 50.0},
		3171234567890004: {BeratLahir: 2.9, TinggiLahir: 48.5},
		3171234567890005: {BeratLahir: 3.1, TinggiLahir: 49.0},
	}

	for nik, detailAnak := range dataAnakMap {
		var kependudukan models.Kependudukan

		// Cari ID Kependudukan berdasarkan NIK
		if err := s.db.Where("nik = ?", nik).First(&kependudukan).Error; err != nil {
			log.Printf("Kependudukan dengan NIK %d tidak ditemukan, melewati seed Anak\n", nik)
			continue
		}

		var existing models.Anak
		// Periksa apakah data anak untuk KependudukanID ini sudah ada
		err := s.db.Where("kependudukan_id = ?", kependudukan.ID).First(&existing).Error

		if err != nil {
			if err == gorm.ErrRecordNotFound {
				anak := models.Anak{
					KependudukanID: kependudukan.ID,
					BeratLahir:     detailAnak.BeratLahir,
					TinggiLahir:    detailAnak.TinggiLahir,
					CreatedAt:      now,
					UpdatedAt:      now,
				}

				if err := s.db.Create(&anak).Error; err != nil {
					log.Printf("Error creating Anak (KependudukanID: %d): %v\n", anak.KependudukanID, err)
					return err
				}
			} else {
				return err
			}
		}
	}

	return nil
}
