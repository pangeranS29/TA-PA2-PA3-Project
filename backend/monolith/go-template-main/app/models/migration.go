package models

import "gorm.io/gorm"

func AutoMigrate(db *gorm.DB) error {
	models := []interface{}{
		&Role{},
		&User{},
		&KategoriUmur{},
		&PeriodeKunjungan{},
		&JenisPelayanan{},
		&JenisPelayananKategori{},
		&AturanPelayanan{},

		&Penduduk{},
		&KartuKeluarga{},
		&Ibu{},
		&Kehamilan{},
		&Anak{},

		&EvaluasiKesehatanIbu{},
		&RiwayatKehamilanLalu{},

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

		&GrafikEvaluasiKehamilan{},
		&GrafikPeningkatanBB{},
		&PenjelasanHasilGrafik{},
		&RencanaPersalinan{},
		&RingkasanPelayananPersalinan{},
		&KeteranganLahir{},
		&RiwayatProsesMelahirkan{},

		&PelayananIbuNifas{},
		&CatatanPelayananNifas{},
		&Rujukan{},
	}

	return db.AutoMigrate(models...)
}
