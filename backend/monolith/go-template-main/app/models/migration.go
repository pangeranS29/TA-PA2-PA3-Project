package models

import (
	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) error {
	// Semua model dalam satu slice
	models := []interface{}{
		// Master
		&KategoriTandaBahaya{},
		&SkriningPemantauan{},
		&KartuKeluarga{},
		&Kependudukan{},
		&KategoriCapaian{},
		&KategoriUmur{},
		&PeriodeKunjungan{},
		&MasterStandarAntropometri{},
		&MasterImunisasi{},
		&KaderPosyandu{},

		// Relasi utama
		&Ibu{},
		&Kehamilan{},
		&Anak{},
		&Role{},
		&User{},
		&Bidan{},
		&Kader{},
		&KartuKeluarga{},
		&Kependudukan{},
		&Ibu{},
		&Anak{},

		// Evaluasi & riwayat
		&EvaluasiKesehatanIbu{},
		&RiwayatKehamilanLalu{},

		// Pelayanan & lainnya
		&JenisPelayanan{},
		&JenisPelayananKategori{},
		&KunjunganAnak{},
		&AturanPelayanan{},
		&DetailPelayanan{},
		&KunjunganGizi{},
		&KunjunganVitamin{},
		&Neonatus{},
		&DetailPelayananNeonatus{},
		&DetailPelayananVitamin{},
		&ASI{},
		&MPASI{},
		&CatatanPelayanan{},
		&DetailPelayanan{},
		&CatatanPertumbuhan{},
		&CatatanPertumbuhan{},
		&KehadiranImunisasi{},
		&Imunisasi{},
		&Imunisasi{},
		&DetailPelayananImunisasi{},
		&PeriksaGigi{},
		&DeteksiDiniPenyimpangan{},
		&PengukuranLila{},
		&Perkembangan{},
		&Pertumbuhan{},
		&Perkembangan{},

		// Kehamilan detail
		&PemeriksaanKehamilan{},
		&PemeriksaanDokterTrimester1{},
		&PemeriksaanLaboratoriumJiwa{},
		&CatatanPelayananTrimester1{},
		&SkriningPreeklampsia{},
		&SkriningDMGestasional{},
		&CatatanPelayananTrimester2{},
		&PemeriksaanDokterTrimester3{},
		&PemeriksaanLanjutanTrimester3{},
		&CatatanPelayananTrimester3{},

		// Grafik & hasil
		&GrafikEvaluasiKehamilan{},
		&GrafikPeningkatanBB{},
		&PenjelasanHasilGrafik{},

		// Persalinan
		&RencanaPersalinan{},
		&RingkasanPelayananPersalinan{},
		&KeteranganLahir{},
		&RiwayatProsesMelahirkan{},

		// // Nifas & rujukan
		&PelayananIbuNifas{},
		&CatatanPelayananNifas{},
		&Rujukan{},

		// edukasi
		&EdukasiIMD{},
		&EdukasiInformasiUmum{},
		&EdukasiKesehatanMental{},
		&EdukasiPolaAsuh{},
		&EdukasiSetelahMelahirkan{},
		&EdukasiTandaBahayaTrimester{},
		&EdukasiTandaMelahirkan{},
		&EdukasiMenyusuiASI{},
		&CatatanKaderKesehatanLingkungan{},
		&KesehatanLingkunganDanCatatanKader{},
		&PemantauanIndikator{},
	}

	// Jalankan automigrate sekali saja
	if err := db.AutoMigrate(models...); err != nil {
		return err
	}

	// seeder
	// log.Println("AutoMigrate selesai. Menjalankan Seeder...")
	// seeder := seeders.NewSeeder(db)
	// if err := seeder.Run(); err != nil {
	// 	println("Error: seeder gagal dijalankan:", err.Error())
	// }

	return nil
}
