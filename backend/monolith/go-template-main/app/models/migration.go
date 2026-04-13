package models

import (
	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) error {
	// 1. Tabel master tanpa foreign key
	if err := db.AutoMigrate(
		&Role{},
		&User{},
		&KategoriUmur{},
		&PeriodeKunjungan{},
		&JenisPelayanan{},
		&JenisPelayananImunisasi{},
		&JenisPelayananKategori{},
	); err != nil {
		return err
	}

	// 2. IbuHamil (master untuk data ibu)
	if err := db.AutoMigrate(&IbuHamil{}); err != nil {
		return err
	}

	// 3. Kehamilan (tergantung IbuHamil)
	if err := db.AutoMigrate(&Kehamilan{}); err != nil {
		return err
	}

	// 4. Anak (tergantung Kehamilan)
	if err := db.AutoMigrate(&Anak{}); err != nil {
		return err
	}

	// 5. EvaluasiKesehatanIbu (tergantung IbuHamil)
	if err := db.AutoMigrate(&EvaluasiKesehatanIbu{}); err != nil {
		return err
	}

	// 6. RiwayatKehamilanLalu (tergantung EvaluasiKesehatanIbu)
	if err := db.AutoMigrate(&RiwayatKehamilanLalu{}); err != nil {
		return err
	}

	// 7. Model lainnya (tidak memiliki foreign key ke model di atas yang bermasalah)
	if err := db.AutoMigrate(
		&KunjunganAnak{},
		&Neonatus{},
		&DetailPelayanan{},
		&DetailPelayananNeonatus{},
		&KunjunganGizi{},
		&ASI{},
		&MPASI{},
		&VitaminAObatCacing{},
		&CatatanPelayanan{},
		&KehadiranImunisasi{},
		&PeriksaGigi{},
		&DeteksiDiniPenyimpangan{},
		&PengukuranLila{},
		&Pertumbuhan{},
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
	); err != nil {
		return err
	}

	return nil
}
