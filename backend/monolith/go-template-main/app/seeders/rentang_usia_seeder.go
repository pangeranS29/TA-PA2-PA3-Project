// seeders/rentang_usia_seeder.go
package seeders

import (
	"log"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type RentangUsiaSeeder struct {
	db *gorm.DB
}

func NewRentangUsiaSeeder(db *gorm.DB) *RentangUsiaSeeder {
	return &RentangUsiaSeeder{db: db}
}

func (s *RentangUsiaSeeder) Seed() error {
	log.Println("🌱 Starting rentang usia seeding...")

	if err := s.seedRentangUsia(); err != nil {
		return err
	}

	log.Println("✅ Rentang usia seeding completed!")
	return nil
}

func (s *RentangUsiaSeeder) seedRentangUsia() error {
	// Aligned with kategori_umur seed ranges
	rentangData := []struct {
		NamaRentang string
		SatuanWaktu string
		MaxPeriode  int
	}{
		{
			NamaRentang: "0-3 bulan",
			SatuanWaktu: "bulan",
			MaxPeriode:  3,
		},
		{
			NamaRentang: "3-6 bulan",
			SatuanWaktu: "bulan",
			MaxPeriode:  6,
		},
		{
			NamaRentang: "6-9 bulan",
			SatuanWaktu: "bulan",
			MaxPeriode:  9,
		},
		{
			NamaRentang: "9-12 bulan",
			SatuanWaktu: "bulan",
			MaxPeriode:  12,
		},
		{
			NamaRentang: "12-18 bulan",
			SatuanWaktu: "bulan",
			MaxPeriode:  18,
		},
		{
			NamaRentang: "18-24 bulan",
			SatuanWaktu: "bulan",
			MaxPeriode:  24,
		},
		{
			NamaRentang: "2-3 tahun",
			SatuanWaktu: "tahun",
			MaxPeriode:  3,
		},
		{
			NamaRentang: "3-4 tahun",
			SatuanWaktu: "tahun",
			MaxPeriode:  4,
		},
		{
			NamaRentang: "4-5 tahun",
			SatuanWaktu: "tahun",
			MaxPeriode:  5,
		},
		{
			NamaRentang: "5-6 tahun",
			SatuanWaktu: "tahun",
			MaxPeriode:  6,
		},
	}

	for _, rd := range rentangData {
		var rentang models.RentangUsia
		err := s.db.Where(models.RentangUsia{NamaRentang: rd.NamaRentang}).FirstOrCreate(&rentang, models.RentangUsia{
			NamaRentang: rd.NamaRentang,
			SatuanWaktu: rd.SatuanWaktu,
			MaxPeriode:  rd.MaxPeriode,
		}).Error
		if err != nil {
			log.Printf("Error seeding RentangUsia (%s): %v\n", rd.NamaRentang, err)
			return err
		}
		log.Printf("✓ Seeded rentang usia: %s (%d %s)\n", rd.NamaRentang, rd.MaxPeriode, rd.SatuanWaktu)
	}

	return nil
}
