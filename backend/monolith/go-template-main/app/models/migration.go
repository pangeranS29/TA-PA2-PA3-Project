package models

import "gorm.io/gorm"

func AutoMigrate(db *gorm.DB) error {
	// Semua model dalam satu slice
	models := []interface{}{
		// Master
		// &Role{},
		// &User{},
		// &KategoriUmur{},
		// &PeriodeKunjungan{},
		// &JenisPelayanan{},
		// &JenisPelayananKategori{},

		// // Relasi utama
		// // &ibu
		// &Kehamilan{},
		// &Anak{},
		// &Role{},
		// &User{},
		// &Kebabura{},
		// &Kependudukan{},
		// &Ibu{},
		// &Anak{},

		// // Evaluasi & riwayat
		// &EvaluasiKesehatanIbu{},
		// &RiwayatKehamilanLalu{},

		// // Pelayanan & lainnya
		// &KunjunganAnak{},
		// &AturanPelayanan{},
		// &KunjunganGizi{},
		// &KunjunganVitamin{},
		// &Neonatus{},
		// &DetailPelayananNeonatus{},
		// &DetailPelayananVitamin{},
		// &ASI{},
		// &MPASI{},
		// &CatatanPelayanan{},
		&EdukasiInformasiUmum{},
		&EdukasiTandaBahayaTrimester{},
		&EdukasiTandaMelahirkan{},
		&EdukasiIMD{},
		&EdukasiSetelahMelahirkan{},
		&EdukasiMenyusuiASI{},
		&EdukasiPolaAsuh{},
		&EdukasiKesehatanMental{},
		// &KehadiranImunisasi{},
		// &DetailPelayananImunisasi{},
		// &PeriksaGigi{},
		// &DeteksiDiniPenyimpangan{},
		// &PengukuranLila{},
		// &Pertumbuhan{},

		// Kehamilan detail
		// &PemeriksaanKehamilan{},
		// &PemeriksaanDokterTrimester1{},
		// &PemeriksaanLaboratoriumJiwa{},
		// &CatatanPelayananTrimester1{},
		// &SkriningPreeklampsia{},
		// &SkriningDMGestasional{},
		// &CatatanPelayananTrimester2{},
		// &PemeriksaanDokterTrimester3{},
		// &PemeriksaanLanjutanTrimester3{},
		// &CatatanPelayananTrimester3{},

		// Grafik & hasil
		// &GrafikEvaluasiKehamilan{},
		// &GrafikPeningkatanBB{},
		// &PenjelasanHasilGrafik{},

		// Persalinan
		// &RencanaPersalinan{},
		// &RingkasanPelayananPersalinan{},
		// &KeteranganLahir{},
		// &RiwayatProsesMelahirkan{},

		// Nifas & rujukan
		// &PelayananIbuNifas{},
		// &CatatanPelayananNifas{},
		// &Rujukan{},

		// Kesehatan Lingkungan & Catatan Kader
		&KesehatanLingkunganDanCatatanKader{},
		// &CatatanKaderKesehatanLingkungan{},
		&PemantauanIndikator{},
	}

	// Jalankan automigrate sekali saja
	if err := db.AutoMigrate(models...); err != nil {
		return err
	}

	return nil
}
