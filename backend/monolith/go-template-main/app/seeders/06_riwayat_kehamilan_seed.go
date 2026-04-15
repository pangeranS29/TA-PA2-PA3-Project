package seeders

import (
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

func SeedRiwayatKehamilan(db *gorm.DB) error {
	riwayatData := []struct {
		NIK                      string
		Tahun                    uint16
		ProsesMelahirkan         string
		PenolongProsesMelahirkan string
		Masalah                  string
	}{
		{
			NIK:                      "1212014405900001",
			Tahun:                    2022,
			ProsesMelahirkan:         "Normal",
			PenolongProsesMelahirkan: "Bidan",
			Masalah:                  "Tidak Ada",
		},
		// Melati : kosong
		{
			NIK:                      "1212015208950002",
			Tahun:                    2019,
			ProsesMelahirkan:         "Normal",
			PenolongProsesMelahirkan: "Bidan",
			Masalah:                  "Tidak Ada",
		},
		{
			NIK:                      "1212014101980003",
			Tahun:                    2023,
			ProsesMelahirkan:         "Normal",
			PenolongProsesMelahirkan: "Dokter",
			Masalah:                  "Lilitan Tali Pusat (Ringan)",
		},
		{
			NIK:                      "1212016512920005",
			Tahun:                    2021,
			ProsesMelahirkan:         "Sesar (Caesar)",
			PenolongProsesMelahirkan: "Dokter Sp.OG",
			Masalah:                  "Panggul Sempit",
		},
		{
			NIK:                      "1212015006970006",
			Tahun:                    2024,
			ProsesMelahirkan:         "Abortus",
			PenolongProsesMelahirkan: "Dokter",
			Masalah:                  "Keguguran pada Trimester 1",
		},
		{
			NIK:                      "1212015509910008",
			Tahun:                    2015,
			ProsesMelahirkan:         "Normal",
			PenolongProsesMelahirkan: "Bidan",
			Masalah:                  "Tidak Ada",
		},
		{
			NIK:                      "1212015509910008",
			Tahun:                    2018,
			ProsesMelahirkan:         "Normal",
			PenolongProsesMelahirkan: "Bidan",
			Masalah:                  "KPD (Ketuban Pecah Dini)",
		},
		{
			NIK:                      "1212015509910008",
			Tahun:                    2022,
			ProsesMelahirkan:         "Normal",
			PenolongProsesMelahirkan: "Dokter",
			Masalah:                  "Tidak Ada",
		},
		{
			NIK:                      "1212016004960009",
			Tahun:                    2023,
			ProsesMelahirkan:         "Normal",
			PenolongProsesMelahirkan: "Bidan",
			Masalah:                  "Tidak Ada",
		},
	}

	now := time.Now()
	for _, d := range riwayatData {
		var kependudukan models.Kependudukan
		if err := db.Where("nik = ?", d.NIK).First(&kependudukan).Error; err != nil {
			continue
		}

		var ibu models.Ibu
		if err := db.Where("id_kependudukan = ?", kependudukan.IdKependudukan).First(&ibu).Error; err != nil {
			continue
		}

		riwayat := models.RiwayatKehamilan{
			FKIdIbu:                  ibu.IdIbu,
			Tahun:                    d.Tahun,
			ProsesMelahirkan:         d.ProsesMelahirkan,
			PenolongProsesMelahirkan: d.PenolongProsesMelahirkan,
			Masalah:                  d.Masalah,
			CreatedAt:                now,
			UpdatedAt:                now,
		}

        if err := db.Where("id_ibu = ? AND tahun = ?", riwayat.FKIdIbu, riwayat.Tahun).
            FirstOrCreate(&riwayat).Error; err != nil {
            return err
        }
	}
	return nil
}
