package seeders

import (
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

func SeedIbu(db *gorm.DB) error {
	ibuData := []struct {
		NIK                     string
		Umur                    uint8
		AlergiMakanan           string
		AlergiObat              string
		NoJKN                   string
		FaskesTK1               string
		NoRegKohort             string
		StatusIbu               models.StatusEnum
		RiwayatKesehatan        string
		RiwayatPerilakuBeresiko string
		RiwayatPenyakitKeluarga string
		Gravida                 uint8
		Partus                  uint8
		Abortus                 uint8
		StatusImunisasiTT       models.StatusImunisasiTTEnum
	}{
		{
			NIK:                     "1212014405900001",
			Umur:                    36,
			AlergiMakanan:           "Udang",
			AlergiObat:              "Tidak Ada",
			NoJKN:                   "0001234567891",
			FaskesTK1:               "Puskesmas Balige",
			NoRegKohort:             "KHT-2026-001",
			StatusIbu:               models.StatusHamil,
			RiwayatKesehatan:        "Normal",
			RiwayatPerilakuBeresiko: "Tidak Ada",
			RiwayatPenyakitKeluarga: "Hipertensi (Ayah)",
			Gravida:                 2,
			Partus:                  1,
			Abortus:                 0,
			StatusImunisasiTT:       models.StatusTT3,
		},
		{
			NIK:                     "1212015208950002",
			Umur:                    31,
			AlergiMakanan:           "Tidak Ada",
			AlergiObat:              "Penicillin",
			NoJKN:                   "0001234567892",
			FaskesTK1:               "Puskesmas Balige",
			NoRegKohort:             "KHT-2026-002",
			StatusIbu:               models.StatusHamil,
			RiwayatKesehatan:        "Anemia Ringan",
			RiwayatPerilakuBeresiko: "Tidak Ada",
			RiwayatPenyakitKeluarga: "Tidak Ada",
			Gravida:                 1,
			Partus:                  0,
			Abortus:                 0,
			StatusImunisasiTT:       models.StatusTT2,
		},
		{
			NIK:                     "1212014101980003",
			Umur:                    28,
			AlergiMakanan:           "Kacang",
			AlergiObat:              "Tidak Ada",
			NoJKN:                   "0001234567893",
			FaskesTK1:               "Puskesmas Balige",
			NoRegKohort:             "KHT-2026-003",
			StatusIbu:               models.StatusHamil,
			RiwayatKesehatan:        "Normal",
			RiwayatPerilakuBeresiko: "Tidak Ada",
			RiwayatPenyakitKeluarga: "Diabetes (Ibu)",
			Gravida:                 3,
			Partus:                  2,
			Abortus:                 0,
			StatusImunisasiTT:       models.StatusTT5,
		},
		{
			NIK:                     "1212016512920005",
			Umur:                    33,
			AlergiMakanan:           "Tidak Ada",
			AlergiObat:              "Tidak Ada",
			NoJKN:                   "0001234567894",
			FaskesTK1:               "Puskesmas Balige",
			NoRegKohort:             "KHT-2026-004",
			StatusIbu:               models.StatusHamil,
			RiwayatKesehatan:        "Pernah Caesar",
			RiwayatPerilakuBeresiko: "Tidak Ada",
			RiwayatPenyakitKeluarga: "Tidak Ada",
			Gravida:                 2,
			Partus:                  1,
			Abortus:                 0,
			StatusImunisasiTT:       models.StatusTT4,
		},
		{
			NIK:                     "1212014203940004",
			Umur:                    32,
			AlergiMakanan:           "Telur",
			AlergiObat:              "Aspirin",
			NoJKN:                   "0001234567895",
			FaskesTK1:               "Puskesmas Balige",
			NoRegKohort:             "KHT-2026-005",
			StatusIbu:               models.StatusHamil,
			RiwayatKesehatan:        "Asma",
			RiwayatPerilakuBeresiko: "Tidak Ada",
			RiwayatPenyakitKeluarga: "Asma (Ibu)",
			Gravida:                 1,
			Partus:                  0,
			Abortus:                 0,
			StatusImunisasiTT:       models.StatusTT1,
		},
		{
			NIK:                     "1212015006970006",
			Umur:                    29,
			AlergiMakanan:           "Tidak Ada",
			AlergiObat:              "Tidak Ada",
			NoJKN:                   "0001234567896",
			FaskesTK1:               "Puskesmas Balige",
			NoRegKohort:             "KHT-2026-006",
			StatusIbu:               models.StatusHamil,
			RiwayatKesehatan:        "Normal",
			RiwayatPerilakuBeresiko: "Tidak Ada",
			RiwayatPenyakitKeluarga: "Tidak Ada",
			Gravida:                 2,
			Partus:                  0,
			Abortus:                 1,
			StatusImunisasiTT:       models.StatusTT2,
		},
		{
			NIK:                     "1212014811930007",
			Umur:                    32,
			AlergiMakanan:           "Ikan Laut",
			AlergiObat:              "Tidak Ada",
			NoJKN:                   "0001234567897",
			FaskesTK1:               "Puskesmas Balige",
			NoRegKohort:             "KHT-2026-007",
			StatusIbu:               models.StatusHamil,
			RiwayatKesehatan:        "Normal",
			RiwayatPerilakuBeresiko: "Tidak Ada",
			RiwayatPenyakitKeluarga: "Tidak Ada",
			Gravida:                 1,
			Partus:                  0,
			Abortus:                 0,
			StatusImunisasiTT:       models.StatusTT2,
		},
		{
			NIK:                     "1212015509910008",
			Umur:                    34,
			AlergiMakanan:           "Tidak Ada",
			AlergiObat:              "Tidak Ada",
			NoJKN:                   "0001234567898",
			FaskesTK1:               "Puskesmas Balige",
			NoRegKohort:             "KHT-2026-008",
			StatusIbu:               models.StatusHamil,
			RiwayatKesehatan:        "Normal",
			RiwayatPerilakuBeresiko: "Tidak Ada",
			RiwayatPenyakitKeluarga: "Hipertensi",
			Gravida:                 4,
			Partus:                  3,
			Abortus:                 0,
			StatusImunisasiTT:       models.StatusTT5,
		},
		{
			NIK:                     "1212016004960009",
			Umur:                    30,
			AlergiMakanan:           "Susu Sapi",
			AlergiObat:              "Tidak Ada",
			NoJKN:                   "0001234567899",
			FaskesTK1:               "Puskesmas Balige",
			NoRegKohort:             "KHT-2026-009",
			StatusIbu:               models.StatusHamil,
			RiwayatKesehatan:        "Normal",
			RiwayatPerilakuBeresiko: "Tidak Ada",
			RiwayatPenyakitKeluarga: "Tidak Ada",
			Gravida:                 2,
			Partus:                  1,
			Abortus:                 0,
			StatusImunisasiTT:       models.StatusTT3,
		},
		{
			NIK:                     "1212014402990010",
			Umur:                    27,
			AlergiMakanan:           "Tidak Ada",
			AlergiObat:              "Tidak Ada",
			NoJKN:                   "0001234567900",
			FaskesTK1:               "Puskesmas Balige",
			NoRegKohort:             "KHT-2026-010",
			StatusIbu:               models.StatusHamil,
			RiwayatKesehatan:        "Normal",
			RiwayatPerilakuBeresiko: "Tidak Ada",
			RiwayatPenyakitKeluarga: "Tidak Ada",
			Gravida:                 1,
			Partus:                  0,
			Abortus:                 0,
			StatusImunisasiTT:       models.StatusTT1,
		},
	}

	now := time.Now()
	for _, d := range ibuData {
		var kependudukanModel models.Kependudukan
		if err := db.Where("nik = ?", d.NIK).First(&kependudukanModel).Error; err != nil {
			continue
		}
		ibu := models.Ibu{
			FKIdKependudukan:        kependudukanModel.IdKependudukan,
			AlergiMakanan:           d.AlergiMakanan,
			Umur:                    d.Umur,
			AlergiObat:              d.AlergiObat,
			NoJKN:                   d.NoJKN,
			FaskesTK1:               d.FaskesTK1,
			NoRegKohort:             d.NoRegKohort,
			StatusIbu:               d.StatusIbu,
			RiwayatKesehatan:        d.RiwayatKesehatan,
			RiwayatPerilakuBeresiko: d.RiwayatPerilakuBeresiko,
			RiwayatPenyakitKeluarga: d.RiwayatPenyakitKeluarga,
			Gravida:                 d.Gravida,
			Partus:                  d.Partus,
			Abortus:                 d.Abortus,
			StatusImunisasiTT:       d.StatusImunisasiTT,
			CreatedAt:               now,
			UpdatedAt:               now,
		}

		if err := db.Where("id_kependudukan = ?", ibu.FKIdKependudukan).FirstOrCreate(&ibu).Error; err != nil {
			return err
		}
	}
	return nil
}
