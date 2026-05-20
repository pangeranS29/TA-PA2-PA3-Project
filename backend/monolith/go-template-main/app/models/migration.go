package models

import (
	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) error {
	// Semua model dalam satu slice
	models := []interface{}{
		// Master
		// &KartuKeluarga{},
		// &Kependudukan{},
		// &Ibu{},
		// &KategoriTandaBahaya{},
		// &SkriningPemantauan{},
		// &RentangUsia{},
		// &KategoriTandaSakit{},
		// &KartuKeluarga{},
		// &Kependudukan{},

		// Relasi utama
		// &ibu
		// &Kehamilan{},
		// &Anak{},
		// &Role{},
		// &User{},
		// &Bidan{},
		// &Kader{},

		// &Anak{},

		// Evaluasi & riwayat
		// &EvaluasiKesehatanIbu{},
		// &RiwayatKehamilanLalu{},

		// Pelayanan & lainnya
		// &JenisPelayanan{},
		// &JenisPelayananKategori{},
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
		// &KehadiranImunisasi{},
		// &DetailPelayananImunisasi{},
		// &PeriksaGigi{},
		// &DeteksiDiniPenyimpangan{},
		// &PengukuranLila{},
		// &Pertumbuhan{},
		// &LembarPemantauan{},
		// &DetailPemantauan{},

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
		// &KategoriCapaian{},
		// &Perawatan{},
		// &PemantauanIndikator{},
		// &KategoriCapaian{},

		// Perkembangan Anak
		// &RentangUsiaPerkembangan{},
		// &IndikatorPerkembangan{},
		// &LembarPerkembangan{},
		// &DetailPerkembangan{},

		// Edukasi Digital
		&EdukasiIMD{},
		&EdukasiInformasiUmum{},
		&EdukasiMenyusuiASI{},
		&EdukasiNifas{},
		&EdukasiPerawatanAnak{},
		&EdukasiPolaAsuh{},
		&EdukasiSetelahMelahirkan{},
		&EdukasiTandaMelahirkan{},
		&EdukasiTrimester{},
		&MateriMPASI{},
		&AturanPorsiMPASI{},
		&JadwalHarianMPASI{},
		&ResepMPASI{},

		// pemantauan dan perawatan
		&LembarPemantauan{},
		&DetailPemantauan{},

		// Tambahan Data Anak
		&KeluhanAnak{},
		&PrediksiStunting{},
		&CatatanPertumbuhan{},

		// Kesehatan Lingkungan
		&KategoriLingkungan{},
		&IndikatorLingkungan{},
		&LembarLingkungan{},
		&DetailLingkungan{},
	}

	// Jalankan automigrate sekali saja
	if err := db.AutoMigrate(models...); err != nil {
		return err
	}

	return nil
}
