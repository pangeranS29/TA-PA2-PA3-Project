package models

import "gorm.io/gorm"

func AutoMigrate(db *gorm.DB) error {
	models := []interface{}{
		// Master
		&Role{},
		&User{},
		&KategoriUmur{},
		&PeriodeKunjungan{},
		&JenisPelayanan{},
		&JenisPelayananKategori{},
		&AturanPelayanan{},

		// Relasi utama
		// &ibu
		&Penduduk{},
		&Ibu{},
		&Kehamilan{},
		&Anak{},
		// &Role{},
		// &User{},
		// &Kebabura{},
		// &Anak{},
		// Evaluasi & riwayat
		&EvaluasiKesehatanIbu{},
		&RiwayatKehamilanLalu{},

		// Pelayanan anak
		&KunjunganAnak{},
		&KunjunganGizi{},
		&KunjunganVitamin{},
		&Neonatus{},
		&DetailPelayananNeonatus{},
		&DetailPelayananVitamin{},
		&ASI{},
		&MPASI{},
		&CatatanPelayanan{},
		&KehadiranImunisasi{},
		&DetailPelayananImunisasi{},
		&PeriksaGigi{},
		&DeteksiDiniPenyimpangan{},
		&PengukuranLila{},
		// &Pertumbuhan{},

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
		&StandarBBTB{},
		&StandarBBU{},
		&StandarIMTU{},
		&MasterStandarAntropometri{},
		// Persalinan
		&RencanaPersalinan{},
		&RingkasanPelayananPersalinan{},
		&KeteranganLahir{},
		&RiwayatProsesMelahirkan{},

		// Nifas & rujukan
		&PelayananIbuNifas{},
		&CatatanPelayananNifas{},
		&Rujukan{},
	}

	return db.AutoMigrate(models...)
}
