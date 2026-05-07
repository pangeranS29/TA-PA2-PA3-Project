package seeders

import (
	"log"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

func PerkembanganAnakSeeder(db *gorm.DB) {
	// 1. Reset data (opsional, gunakan dengan hati-hati)
	// db.Exec("TRUNCATE TABLE detail_perkembangan_anak CASCADE")
	// db.Exec("TRUNCATE TABLE lembar_perkembangan_anak CASCADE")
	// db.Exec("TRUNCATE TABLE kategori_perkembangan CASCADE")
	// db.Exec("TRUNCATE TABLE rentang_usia_perkembangan CASCADE")

	// 2. Seed Rentang Usia Perkembangan
	rentangUsia := []models.RentangUsiaPerkembangan{
		{ID: 1, NamaRentang: "29 Hari - 3 Bulan"},
		{ID: 2, NamaRentang: "3 - 6 Bulan"},
		{ID: 3, NamaRentang: "6 - 9 Bulan"},
		{ID: 4, NamaRentang: "9 - 12 Bulan"},
		{ID: 5, NamaRentang: "12 - 18 Bulan"},
		{ID: 6, NamaRentang: "2 - 3 Tahun"},
		{ID: 7, NamaRentang: "3 - 4 Tahun"},
		{ID: 8, NamaRentang: "4 - 5 Tahun"},
		{ID: 9, NamaRentang: "5 - 6 Tahun"},
	}

	for _, r := range rentangUsia {
		db.FirstOrCreate(&r, models.RentangUsiaPerkembangan{ID: r.ID})
	}

	// 3. Seed Indikator Perkembangan (Contoh untuk 29 Hari - 3 Bulan seperti di gambar)
	indikators := []models.KategoriPerkembangan{
		{RentangUsiaPerkembanganID: 1, Indikator: "Bayi bisa mengangkat kepala mandiri hingga setinggi 45 derajat?", Aspek: "Motorik Kasar"},
		{RentangUsiaPerkembanganID: 1, Indikator: "Bayi bisa menggerakkan kepala dari kiri/kanan ke tengah?", Aspek: "Motorik Kasar"},
		{RentangUsiaPerkembanganID: 1, Indikator: "Bayi bisa melihat dan menatap wajah anda?", Aspek: "Sosialisasi & Kemandirian"},
		{RentangUsiaPerkembanganID: 1, Indikator: "Bayi bisa mengoceh spontan atau bereaksi dengan mengoceh?", Aspek: "Bicara & Bahasa"},
		{RentangUsiaPerkembanganID: 1, Indikator: "Bayi suka tertawa keras?", Aspek: "Sosialisasi & Kemandirian"},
		{RentangUsiaPerkembanganID: 1, Indikator: "Bayi bereaksi terkejut terhadap suara keras?", Aspek: "Pendengaran"},
		{RentangUsiaPerkembanganID: 1, Indikator: "Bayi membalas tersenyum ketika diajak bicara/tersenyum?", Aspek: "Sosialisasi & Kemandirian"},
		{RentangUsiaPerkembanganID: 1, Indikator: "Bayi mengenal ibu dengan penglihatan, penciuman, pendengaran, kontak?", Aspek: "Sosialisasi & Kemandirian"},
	}

	for _, ind := range indikators {
		db.FirstOrCreate(&ind, models.KategoriPerkembangan{Indikator: ind.Indikator, RentangUsiaPerkembanganID: ind.RentangUsiaPerkembanganID})
	}

	log.Println("✅ Seeder Perkembangan Anak berhasil dijalankan")
}
