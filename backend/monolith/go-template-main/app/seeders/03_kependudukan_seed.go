package seeders

import (
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

func SeedKependudukan(db *gorm.DB) error {
	kependudukanData := []struct {
		NIK                string
		NamaLengkap        string
		NoKK               string
		TanggalTerbit      time.Time
		JenisKelamin       string
		TempatLahir        string
		TanggalLahir       time.Time
		Agama              string
		GolonganDarah      string
		PendidikanTerakhir string
		Pekerjaan          string
		NoTelp             string
		RTRW               string
		Dusun              string
		DesaKelurahan      string
		Kecamatan          string
		KabupatenKota      string
		Provinsi           string
	}{
		{
			NIK:                "1212014405900001",
			NamaLengkap:        "Sorta Lumbantoruan",
			NoKK:               "1212011002150043",
			TanggalTerbit:      time.Date(2022, 5, 15, 0, 0, 0, 0, time.UTC),
			JenisKelamin:       "P",
			TempatLahir:        "Balige",
			TanggalLahir:       time.Date(1990, 5, 4, 0, 0, 0, 0, time.UTC),
			Agama:              "Kristen",
			GolonganDarah:      "A",
			PendidikanTerakhir: "S1 Akuntansi",
			Pekerjaan:          "Wiraswasta",
			NoTelp:             "081266443321",
			RTRW:               "002/001",
			Dusun:              "Dusun I Nagatimbul",
			DesaKelurahan:      "Lumban Bulbul",
			Kecamatan:          "Balige",
			KabupatenKota:      "Toba",
			Provinsi:           "Sumatera Utara",
		},
		{
			NIK:                "1212015208950002",
			NamaLengkap:        "Melati Simanjuntak",
			NoKK:               "1212012211180012",
			TanggalTerbit:      time.Date(2023, 1, 20, 0, 0, 0, 0, time.UTC),
			JenisKelamin:       "P",
			TempatLahir:        "Porsea",
			TanggalLahir:       time.Date(1995, 8, 12, 0, 0, 0, 0, time.UTC),
			Agama:              "Kristen",
			GolonganDarah:      "O",
			PendidikanTerakhir: "SMA",
			Pekerjaan:          "Mengurus Rumah Tangga",
			NoTelp:             "085277881122",
			RTRW:               "001/002",
			Dusun:              "Dusun II Pagar Batu",
			DesaKelurahan:      "Pardede Onan",
			Kecamatan:          "Balige",
			KabupatenKota:      "Toba",
			Provinsi:           "Sumatera Utara",
		},
		{
			NIK:                "1212014101980003",
			NamaLengkap:        "Siti Aminah Matondang",
			NoKK:               "1212011503200055",
			TanggalTerbit:      time.Date(2024, 6, 10, 0, 0, 0, 0, time.UTC),
			JenisKelamin:       "P",
			TempatLahir:        "Balige",
			TanggalLahir:       time.Date(1998, 1, 1, 0, 0, 0, 0, time.UTC),
			Agama:              "Islam",
			GolonganDarah:      "B",
			PendidikanTerakhir: "D3 Kebidanan",
			Pekerjaan:          "Tenaga Kesehatan",
			NoTelp:             "081355667788",
			RTRW:               "003/001",
			Dusun:              "Dusun III",
			DesaKelurahan:      "Sangkar Nihuta",
			Kecamatan:          "Balige",
			KabupatenKota:      "Toba",
			Provinsi:           "Sumatera Utara",
		},
		{
			NIK:                "1212016512920005",
			NamaLengkap:        "Rohani Napitupulu",
			NoKK:               "1212010506200088",
			TanggalTerbit:      time.Date(2024, 9, 10, 0, 0, 0, 0, time.UTC),
			JenisKelamin:       "P",
			TempatLahir:        "Balige",
			TanggalLahir:       time.Date(1992, 12, 25, 0, 0, 0, 0, time.UTC),
			Agama:              "Kristen",
			GolonganDarah:      "B",
			PendidikanTerakhir: "D3 Kebidanan",
			Pekerjaan:          "Tenaga Kesehatan",
			NoTelp:             "081311229900",
			RTRW:               "004/002",
			Dusun:              "Dusun III Tambunan",
			DesaKelurahan:      "Sangkar Nihuta",
			Kecamatan:          "Balige",
			KabupatenKota:      "Toba",
			Provinsi:           "Sumatera Utara",
		},
		{
			NIK:                "1212014203940004",
			NamaLengkap:        "Tiurma Siahaan",
			NoKK:               "1212011212190032",
			TanggalTerbit:      time.Date(2021, 3, 15, 0, 0, 0, 0, time.UTC),
			JenisKelamin:       "P",
			TempatLahir:        "Laguboti",
			TanggalLahir:       time.Date(1994, 3, 2, 0, 0, 0, 0, time.UTC),
			Agama:              "Kristen",
			GolonganDarah:      "AB",
			PendidikanTerakhir: "SMA",
			Pekerjaan:          "Petani",
			NoTelp:             "082165432100",
			RTRW:               "001/001",
			Dusun:              "Dusun I",
			DesaKelurahan:      "Sibola Hotangs",
			Kecamatan:          "Balige",
			KabupatenKota:      "Toba",
			Provinsi:           "Sumatera Utara",
		},
		{
			NIK:                "1212015006970006",
			NamaLengkap:        "Dumasi Hutajulu",
			NoKK:               "1212012508210011",
			TanggalTerbit:      time.Date(2022, 11, 2, 0, 0, 0, 0, time.UTC),
			JenisKelamin:       "P",
			TempatLahir:        "Balige",
			TanggalLahir:       time.Date(1997, 6, 10, 0, 0, 0, 0, time.UTC),
			Agama:              "Kristen",
			GolonganDarah:      "O",
			PendidikanTerakhir: "S1 Guru",
			Pekerjaan:          "Guru Honorer",
			NoTelp:             "081299887766",
			RTRW:               "002/002",
			Dusun:              "Dusun IV",
			DesaKelurahan:      "Lumban Pea",
			Kecamatan:          "Balige",
			KabupatenKota:      "Toba",
			Provinsi:           "Sumatera Utara",
		},
		{
			NIK:                "1212014811930007",
			NamaLengkap:        "Lambok Gultom",
			NoKK:               "1212010101220099",
			TanggalTerbit:      time.Date(2023, 5, 5, 0, 0, 0, 0, time.UTC),
			JenisKelamin:       "P",
			TempatLahir:        "Balige",
			TanggalLahir:       time.Date(1993, 11, 8, 0, 0, 0, 0, time.UTC),
			Agama:              "Kristen",
			GolonganDarah:      "A",
			PendidikanTerakhir: "SMA",
			Pekerjaan:          "Wiraswasta",
			NoTelp:             "085312345678",
			RTRW:               "003/001",
			Dusun:              "Dusun II",
			DesaKelurahan:      "Hutabulu Mejan",
			Kecamatan:          "Balige",
			KabupatenKota:      "Toba",
			Provinsi:           "Sumatera Utara",
		},
		{
			NIK:                "1212015509910008",
			NamaLengkap:        "Pesta Sibarani",
			NoKK:               "1212011105200044",
			TanggalTerbit:      time.Date(2024, 2, 14, 0, 0, 0, 0, time.UTC),
			JenisKelamin:       "P",
			TempatLahir:        "Balige",
			TanggalLahir:       time.Date(1991, 9, 15, 0, 0, 0, 0, time.UTC),
			Agama:              "Kristen",
			GolonganDarah:      "B",
			PendidikanTerakhir: "S1 Hukum",
			Pekerjaan:          "Karyawan Swasta",
			NoTelp:             "081199001122",
			RTRW:               "005/002",
			Dusun:              "Dusun I",
			DesaKelurahan:      "Bonandolok",
			Kecamatan:          "Balige",
			KabupatenKota:      "Toba",
			Provinsi:           "Sumatera Utara",
		},
		{
			NIK:                "1212016004960009",
			NamaLengkap:        "Nurainun Pasaribu",
			NoKK:               "1212011902170066",
			TanggalTerbit:      time.Date(2021, 8, 20, 0, 0, 0, 0, time.UTC),
			JenisKelamin:       "P",
			TempatLahir:        "Balige",
			TanggalLahir:       time.Date(1996, 4, 20, 0, 0, 0, 0, time.UTC),
			Agama:              "Islam",
			GolonganDarah:      "O",
			PendidikanTerakhir: "SMA",
			Pekerjaan:          "Pedagang",
			NoTelp:             "082277665544",
			RTRW:               "001/003",
			Dusun:              "Dusun II",
			DesaKelurahan:      "Saribu Raja Janji Maria",
			Kecamatan:          "Balige",
			KabupatenKota:      "Toba",
			Provinsi:           "Sumatera Utara",
		},
		{
			NIK:                "1212014402990010",
			NamaLengkap:        "Hamidah Situmorang",
			NoKK:               "1212013009210077",
			TanggalTerbit:      time.Date(2022, 12, 1, 0, 0, 0, 0, time.UTC),
			JenisKelamin:       "P",
			TempatLahir:        "Parapat",
			TanggalLahir:       time.Date(1999, 2, 4, 0, 0, 0, 0, time.UTC),
			Agama:              "Islam",
			GolonganDarah:      "AB",
			PendidikanTerakhir: "SMA",
			Pekerjaan:          "Mengurus Rumah Tangga",
			NoTelp:             "081388776655",
			RTRW:               "002/001",
			Dusun:              "Dusun I",
			DesaKelurahan:      "Sitorret",
			Kecamatan:          "Balige",
			KabupatenKota:      "Toba",
			Provinsi:           "Sumatera Utara",
		},
	}

	now := time.Now()
	for _, d := range kependudukanData {
		var userModel models.User
		if err := db.Where("nama LIKE ?", d.NamaLengkap+"%").First(&userModel).Error; err != nil {
			return err;
		}
		kependudukan := models.Kependudukan{
			IdUser:             userModel.ID,
			NIK:                d.NIK,
			NamaLengkap:        d.NamaLengkap,
			NoKK:               d.NoKK,
			TanggalTerbit:      d.TanggalTerbit,
			JenisKelamin:       d.JenisKelamin,
			TempatLahir:        d.TempatLahir,
			TanggalLahir:       d.TanggalLahir,
			Agama:              d.Agama,
			GolonganDarah:      d.GolonganDarah,
			PendidikanTerakhir: d.PendidikanTerakhir,
			Pekerjaan:          d.Pekerjaan,
			NoTelp:             d.NoTelp,
			RTRW:               d.RTRW,
			Dusun:              d.Dusun,
			DesaKelurahan:      d.DesaKelurahan,
			Kecamatan:          d.Kecamatan,
			KabupatenKota:      d.KabupatenKota,
			Provinsi:           d.Provinsi,
			CreatedAt:          now,
			UpdatedAt:          now,
		}
		if err := db.Where(models.Kependudukan{NIK: d.NIK}).FirstOrCreate(&kependudukan).Error; err != nil {
			return err
		}
	}

	return nil
}
