package seeders

import (
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

func SeedPemeriksaanANC(db *gorm.DB) error {
	ancData := []struct {
		NIK                       string
		KehamilanKe               uint8
		Trimester                 string
		KunjunganKe               uint8
		UsiaKehamilan             uint8
		TanggalPeriksa            time.Time
		TempatPeriksa             string
		NamaDokter                string
		TanggalKembali            time.Time
		BeratBadan                float32
		Lila                      float32
		TinggiFundus              uint8
		TDSistolik                uint8
		TDDiastolik               uint8
		Hemoglobin                float32
		TesGulaDarah              uint8
		ProteinUrin               models.ProteinUrin
		UrinReduksi               models.UrinReduksi
		GulaDarahPuasa            float32
		GulaDarah2JamPostPrandial float32
		HIV                       models.TripleEliminasi
		Sifilis                   models.TripleEliminasi
		HepatitisB                models.TripleEliminasi
		CatatanPemeriksaanLanjut  models.DataPemeriksaanLanjut
		TataLaksanaKasus          string
		CatatanPelayanan          string
		Kesimpulan                string
	}{
		{
			// Sorta - Trimester 3
			NIK:            "1212014405900001",
			KehamilanKe:    2,
			Trimester:      "3",
			KunjunganKe:    6,
			UsiaKehamilan:  39,
			TanggalPeriksa: time.Date(2026, 4, 10, 0, 0, 0, 0, time.UTC),
			TempatPeriksa:  "RSUD Deli Serdang",
			NamaDokter:     "dr. Andi Sp.OG",
			TanggalKembali: time.Date(2026, 4, 17, 0, 0, 0, 0, time.UTC),
			BeratBadan:     68.5,
			Lila:           28.5,
			TinggiFundus:   34,
			TDSistolik:     120,
			TDDiastolik:    80,
			Hemoglobin:     11.5,
			TesGulaDarah:   95,
			ProteinUrin:    models.ProteinNegatif,
			UrinReduksi:    models.ReduksiNegatif,
			HIV:            models.HasilNonReaktif,
			Sifilis:        models.HasilNonReaktif,
			HepatitisB:     models.HasilNonReaktif,
			CatatanPemeriksaanLanjut: models.DataPemeriksaanLanjut{
				Konjungtiva:            models.StatusNonAnemia,
				Sklera:                 models.StatusNormal,
				Kulit:                  models.StatusNormal,
				Leher:                  models.StatusNormal,
				GigiMulut:              models.StatusNormal,
				Telinga:                models.StatusNormal,
				Hidung:                 models.StatusNormal,
				Mulut:                  models.StatusNormal,
				Dada:                   models.StatusNormal,
				Jantung:                models.StatusNormal,
				Paru:                   models.StatusNormal,
				Perut:                  models.StatusNormal,
				Tungkai:                models.StatusNormal,
				StatusImunisasiTetanus: true,
				Konseling:              true,
				SkriningDokter:         true,
				PemberianTTD:           true,
				KesehatanJiwa:          true,
			},
			TataLaksanaKasus: "Persiapan persalinan normal",
			CatatanPelayanan: "Edukasi tanda-tanda persalinan",
			Kesimpulan:       "Ibu dan janin sehat, siap melahirkan",
		},
		{
			// Melati - Trimester 2
			NIK:            "1212015208950002",
			KehamilanKe:    1,
			Trimester:      "2",
			KunjunganKe:    3,
			UsiaKehamilan:  22,
			TanggalPeriksa: time.Date(2026, 4, 8, 0, 0, 0, 0, time.UTC),
			TempatPeriksa:  "Puskesmas Lubuk Pakam",
			NamaDokter:     "dr. Siti Aminah",
			TanggalKembali: time.Date(2026, 5, 8, 0, 0, 0, 0, time.UTC),
			BeratBadan:     58.0,
			Lila:           24.5,
			TinggiFundus:   19,
			TDSistolik:     110,
			TDDiastolik:    70,
			Hemoglobin:     10.8,
			TesGulaDarah:   90,
			ProteinUrin:    models.ProteinNegatif,
			UrinReduksi:    models.ReduksiNegatif,
			HIV:            models.HasilNonReaktif,
			Sifilis:        models.HasilNonReaktif,
			HepatitisB:     models.HasilNonReaktif,
			CatatanPemeriksaanLanjut: models.DataPemeriksaanLanjut{
				Konjungtiva:            models.StatusAnemia,
				Sklera:                 models.StatusNormal,
				Kulit:                  models.StatusNormal,
				StatusImunisasiTetanus: true,
				Konseling:              true,
				PemberianTTD:           true,
			},
			TataLaksanaKasus: "Pemberian tablet tambah darah (TTD)",
			CatatanPelayanan: "Edukasi gizi besi",
			Kesimpulan:       "Anemia ringan, kondisi janin baik",
		},
		{
			// Siti - Trimester 1
			NIK:            "1212014101980003",
			KehamilanKe:    3,
			Trimester:      "1",
			KunjunganKe:    1,
			UsiaKehamilan:  8,
			TanggalPeriksa: time.Date(2026, 4, 5, 0, 0, 0, 0, time.UTC),
			TempatPeriksa:  "Klinik Pratama",
			NamaDokter:     "dr. Budi Santoso",
			TanggalKembali: time.Date(2026, 5, 5, 0, 0, 0, 0, time.UTC),
			BeratBadan:     62.0,
			Lila:           27.0,
			TinggiFundus:   0,
			TDSistolik:     115,
			TDDiastolik:    75,
			Hemoglobin:     12.2,
			TesGulaDarah:   100,
			ProteinUrin:    models.ProteinNegatif,
			UrinReduksi:    models.ReduksiNegatif,
			HIV:            models.HasilNonReaktif,
			Sifilis:        models.HasilNonReaktif,
			HepatitisB:     models.HasilNonReaktif,
			CatatanPemeriksaanLanjut: models.DataPemeriksaanLanjut{
				Konjungtiva:    models.StatusNonAnemia,
				Sklera:         models.StatusNormal,
				SkriningDokter: true,
				Konseling:      true,
				KesehatanJiwa:  true,
			},
			TataLaksanaKasus: "Pemberian asam folat",
			CatatanPelayanan: "Edukasi mual muntah (emesis)",
			Kesimpulan:       "Kehamilan awal normal",
		},
		{
			// Rohani - Trimester 3
			NIK:            "1212016512920005",
			KehamilanKe:    2,
			Trimester:      "3",
			KunjunganKe:    4,
			UsiaKehamilan:  29,
			TanggalPeriksa: time.Date(2026, 4, 1, 0, 0, 0, 0, time.UTC),
			TempatPeriksa:  "RSUD Deli Serdang",
			NamaDokter:     "dr. Andi Sp.OG",
			TanggalKembali: time.Date(2026, 4, 29, 0, 0, 0, 0, time.UTC),
			BeratBadan:     65.2,
			Lila:           26.0,
			TinggiFundus:   26,
			TDSistolik:     135,
			TDDiastolik:    85,
			Hemoglobin:     11.0,
			TesGulaDarah:   110,
			ProteinUrin:    models.ProteinTrace,
			UrinReduksi:    models.ReduksiNegatif,
			HIV:            models.HasilNonReaktif,
			Sifilis:        models.HasilNonReaktif,
			HepatitisB:     models.HasilNonReaktif,
			CatatanPemeriksaanLanjut: models.DataPemeriksaanLanjut{
				Konjungtiva:    models.StatusNonAnemia,
				Tungkai:        models.StatusTidakNormal,
				SkriningDokter: true,
				Konseling:      true,
			},
			TataLaksanaKasus: "Observasi tekanan darah, kurangi garam",
			CatatanPelayanan: "Edukasi tanda bahaya preeklamsia",
			Kesimpulan:       "Waspada hipertensi gestasional",
		},
		{
			// Tiurma - Trimester 3
			NIK:            "1212014203940004",
			KehamilanKe:    1,
			Trimester:      "3",
			KunjunganKe:    5,
			UsiaKehamilan:  34,
			TanggalPeriksa: time.Date(2026, 4, 2, 0, 0, 0, 0, time.UTC),
			TempatPeriksa:  "Puskesmas Lubuk Pakam",
			NamaDokter:     "dr. Siti Aminah",
			TanggalKembali: time.Date(2026, 4, 16, 0, 0, 0, 0, time.UTC),
			BeratBadan:     60.5,
			Lila:           25.5,
			TinggiFundus:   30,
			TDSistolik:     110,
			TDDiastolik:    70,
			Hemoglobin:     11.8,
			TesGulaDarah:   92,
			ProteinUrin:    models.ProteinNegatif,
			UrinReduksi:    models.ReduksiNegatif,
			HIV:            models.HasilNonReaktif,
			Sifilis:        models.HasilNonReaktif,
			HepatitisB:     models.HasilNonReaktif,
			CatatanPemeriksaanLanjut: models.DataPemeriksaanLanjut{
				Konjungtiva:            models.StatusNonAnemia,
				Sklera:                 models.StatusNormal,
				StatusImunisasiTetanus: true,
				Konseling:              true,
				PemberianTTD:           true,
			},
			TataLaksanaKasus: "Lanjutkan vitamin rutin",
			CatatanPelayanan: "Edukasi menghitung gerakan janin",
			Kesimpulan:       "Kondisi stabil, janin aktif",
		},
		{
			// Dumasi - Trimester 1
			NIK:            "1212015006970006",
			KehamilanKe:    2,
			Trimester:      "1",
			KunjunganKe:    2,
			UsiaKehamilan:  13,
			TanggalPeriksa: time.Date(2026, 4, 3, 0, 0, 0, 0, time.UTC),
			TempatPeriksa:  "Klinik Pratama",
			NamaDokter:     "dr. Budi Santoso",
			TanggalKembali: time.Date(2026, 5, 3, 0, 0, 0, 0, time.UTC),
			BeratBadan:     55.0,
			Lila:           24.0,
			TinggiFundus:   10,
			TDSistolik:     120,
			TDDiastolik:    80,
			Hemoglobin:     12.5,
			TesGulaDarah:   88,
			ProteinUrin:    models.ProteinNegatif,
			UrinReduksi:    models.ReduksiNegatif,
			HIV:            models.HasilNonReaktif,
			Sifilis:        models.HasilNonReaktif,
			HepatitisB:     models.HasilNonReaktif,
			CatatanPemeriksaanLanjut: models.DataPemeriksaanLanjut{
				Konjungtiva:    models.StatusNonAnemia,
				SkriningDokter: true,
				Konseling:      true,
			},
			TataLaksanaKasus: "Penguatan psikologis pasca keguguran sebelumnya",
			CatatanPelayanan: "Edukasi nutrisi trimester 1",
			Kesimpulan:       "Kehamilan sehat, riwayat abortus terkontrol",
		},
		{
			// Lambok - Trimester 2
			NIK:            "1212014811930007",
			KehamilanKe:    1,
			Trimester:      "2",
			KunjunganKe:    4,
			UsiaKehamilan:  25,
			TanggalPeriksa: time.Date(2026, 3, 28, 0, 0, 0, 0, time.UTC),
			TempatPeriksa:  "Puskesmas Lubuk Pakam",
			NamaDokter:     "dr. Siti Aminah",
			TanggalKembali: time.Date(2026, 4, 28, 0, 0, 0, 0, time.UTC),
			BeratBadan:     54.5,
			Lila:           23.2,
			TinggiFundus:   21,
			TDSistolik:     100,
			TDDiastolik:    60,
			Hemoglobin:     11.2,
			TesGulaDarah:   90,
			ProteinUrin:    models.ProteinNegatif,
			UrinReduksi:    models.ReduksiNegatif,
			HIV:            models.HasilNonReaktif,
			Sifilis:        models.HasilNonReaktif,
			HepatitisB:     models.HasilNonReaktif,
			CatatanPemeriksaanLanjut: models.DataPemeriksaanLanjut{
				Konjungtiva:  models.StatusNonAnemia,
				Kulit:        models.StatusNormal,
				Konseling:    true,
				PemberianTTD: true,
			},
			TataLaksanaKasus: "Pemberian PMT (Pemberian Makanan Tambahan)",
			CatatanPelayanan: "Edukasi peningkatan berat badan",
			Kesimpulan:       "Kondisi janin normal, ibu risiko KEK",
		},
		{
			// Pesta - Trimester 2
			NIK:            "1212015509910008",
			KehamilanKe:    4,
			Trimester:      "2",
			KunjunganKe:    2,
			UsiaKehamilan:  15,
			TanggalPeriksa: time.Date(2026, 4, 6, 0, 0, 0, 0, time.UTC),
			TempatPeriksa:  "RSUD Deli Serdang",
			NamaDokter:     "dr. Andi Sp.OG",
			TanggalKembali: time.Date(2026, 5, 6, 0, 0, 0, 0, time.UTC),
			BeratBadan:     70.0,
			Lila:           30.0,
			TinggiFundus:   13,
			TDSistolik:     120,
			TDDiastolik:    80,
			Hemoglobin:     12.0,
			TesGulaDarah:   130,
			ProteinUrin:    models.ProteinNegatif,
			UrinReduksi:    models.ReduksiNegatif,
			HIV:            models.HasilNonReaktif,
			Sifilis:        models.HasilNonReaktif,
			HepatitisB:     models.HasilNonReaktif,
			CatatanPemeriksaanLanjut: models.DataPemeriksaanLanjut{
				Konjungtiva:    models.StatusNonAnemia,
				Perut:          models.StatusNormal,
				SkriningDokter: true,
				Konseling:      true,
			},
			TataLaksanaKasus: "Cek GDS ulang kunjungan berikutnya",
			CatatanPelayanan: "Edukasi diet rendah gula",
			Kesimpulan:       "Multigravida, waspada diabetes gestasional",
		},
		{
			// Nurainun - Trimester 1
			NIK:            "1212016004960009",
			KehamilanKe:    2,
			Trimester:      "1",
			KunjunganKe:    1,
			UsiaKehamilan:  5,
			TanggalPeriksa: time.Date(2026, 4, 7, 0, 0, 0, 0, time.UTC),
			TempatPeriksa:  "Klinik Pratama",
			NamaDokter:     "dr. Budi Santoso",
			TanggalKembali: time.Date(2026, 5, 7, 0, 0, 0, 0, time.UTC),
			BeratBadan:     57.5,
			Lila:           25.0,
			TinggiFundus:   0,
			TDSistolik:     110,
			TDDiastolik:    70,
			Hemoglobin:     13.0,
			TesGulaDarah:   85,
			ProteinUrin:    models.ProteinNegatif,
			UrinReduksi:    models.ReduksiNegatif,
			HIV:            models.HasilNonReaktif,
			Sifilis:        models.HasilNonReaktif,
			HepatitisB:     models.HasilNonReaktif,
			CatatanPemeriksaanLanjut: models.DataPemeriksaanLanjut{
				Konjungtiva:    models.StatusNonAnemia,
				SkriningDokter: true,
				Konseling:      true,
			},
			TataLaksanaKasus: "Pemberian asam folat dan penguat kandungan",
			CatatanPelayanan: "Edukasi istirahat cukup",
			Kesimpulan:       "Konfirmasi kehamilan awal via USG",
		},
		{
			// Hamidah - Trimester 3
			NIK:            "1212014402990010",
			KehamilanKe:    1,
			Trimester:      "3",
			KunjunganKe:    7,
			UsiaKehamilan:  42,
			TanggalPeriksa: time.Date(2026, 4, 9, 0, 0, 0, 0, time.UTC),
			TempatPeriksa:  "RSUD Deli Serdang",
			NamaDokter:     "dr. Andi Sp.OG",
			TanggalKembali: time.Date(2026, 4, 10, 0, 0, 0, 0, time.UTC),
			BeratBadan:     66.0,
			Lila:           27.5,
			TinggiFundus:   36,
			TDSistolik:     120,
			TDDiastolik:    80,
			Hemoglobin:     11.5,
			TesGulaDarah:   90,
			ProteinUrin:    models.ProteinNegatif,
			UrinReduksi:    models.ReduksiNegatif,
			HIV:            models.HasilNonReaktif,
			Sifilis:        models.HasilNonReaktif,
			HepatitisB:     models.HasilNonReaktif,
			CatatanPemeriksaanLanjut: models.DataPemeriksaanLanjut{
				Konjungtiva: models.StatusNonAnemia, Jantung: models.StatusNormal,
				SkriningDokter: true,
				Konseling:      true,
			},
			TataLaksanaKasus: "Rencana induksi atau SC besok pagi",
			CatatanPelayanan: "Informed consent tindakan operatif",
			Kesimpulan:       "Kehamilan lewat waktu (Post-term)",
		},

		// DATA TAMBAHAN
		// SORTA ID: 1
		{NIK: "1212014405900001", KehamilanKe: 2, Trimester: "1", KunjunganKe: 1, UsiaKehamilan: 8, TanggalPeriksa: time.Date(2025, 9, 10, 0, 0, 0, 0, time.UTC), TempatPeriksa: "Klinik Pratama", NamaDokter: "dr. Andi Sp.OG", BeratBadan: 60.0, Lila: 28.0, TDSistolik: 110, TDDiastolik: 70, Hemoglobin: 12.0, Kesimpulan: "Kunjungan T1 awal"},
		{NIK: "1212014405900001", KehamilanKe: 2, Trimester: "2", KunjunganKe: 2, UsiaKehamilan: 19, TanggalPeriksa: time.Date(2025, 11, 20, 0, 0, 0, 0, time.UTC), TempatPeriksa: "Klinik Pratama", NamaDokter: "dr. Andi Sp.OG", BeratBadan: 63.5, Lila: 28.2, TDSistolik: 115, TDDiastolik: 75, Hemoglobin: 11.8, Kesimpulan: "Kunjungan T2 rutin"},
		{NIK: "1212014405900001", KehamilanKe: 2, Trimester: "3", KunjunganKe: 3, UsiaKehamilan: 37, TanggalPeriksa: time.Date(2026, 3, 15, 0, 0, 0, 0, time.UTC), TempatPeriksa: "RSUD Deli Serdang", NamaDokter: "dr. Andi Sp.OG", BeratBadan: 67.0, Lila: 28.5, TinggiFundus: 32, TDSistolik: 120, TDDiastolik: 80, Hemoglobin: 11.5, Kesimpulan: "Kunjungan T3 awal"},
		{NIK: "1212014405900001", KehamilanKe: 2, Trimester: "3", KunjunganKe: 6, UsiaKehamilan: 39, TanggalPeriksa: time.Date(2026, 4, 10, 0, 0, 0, 0, time.UTC), TempatPeriksa: "RSUD Deli Serdang", NamaDokter: "dr. Andi Sp.OG", BeratBadan: 68.5, Lila: 28.5, TinggiFundus: 34, TDSistolik: 120, TDDiastolik: 80, Hemoglobin: 11.5, Kesimpulan: "Siap melahirkan"},

		// MELATI ID: 2
		{NIK: "1212015208950002", KehamilanKe: 1, Trimester: "1", KunjunganKe: 1, UsiaKehamilan: 10, TanggalPeriksa: time.Date(2026, 1, 15, 0, 0, 0, 0, time.UTC), NamaDokter: "dr. Siti Aminah", BeratBadan: 52.0, Kesimpulan: "ANC T1"},
		{NIK: "1212015208950002", KehamilanKe: 1, Trimester: "2", KunjunganKe: 2, UsiaKehamilan: 18, TanggalPeriksa: time.Date(2026, 3, 10, 0, 0, 0, 0, time.UTC), NamaDokter: "dr. Siti Aminah", BeratBadan: 55.5, Kesimpulan: "ANC T2"},
		{NIK: "1212015208950002", KehamilanKe: 1, Trimester: "2", KunjunganKe: 3, UsiaKehamilan: 22, TanggalPeriksa: time.Date(2026, 4, 8, 0, 0, 0, 0, time.UTC), NamaDokter: "dr. Siti Aminah", BeratBadan: 58.0, Kesimpulan: "Anemia ringan"},

		// SITI ID: 3
		{NIK: "1212014101980003", KehamilanKe: 3, Trimester: "1", KunjunganKe: 1, UsiaKehamilan: 8, TanggalPeriksa: time.Date(2026, 4, 5, 0, 0, 0, 0, time.UTC), NamaDokter: "dr. Budi Santoso", BeratBadan: 62.0, Kesimpulan: "Kehamilan normal"},

		// ROHANI ID: 5
		{NIK: "1212016512920005", KehamilanKe: 2, Trimester: "1", KunjunganKe: 1, UsiaKehamilan: 10, TanggalPeriksa: time.Date(2025, 11, 1, 0, 0, 0, 0, time.UTC), NamaDokter: "dr. Andi Sp.OG", BeratBadan: 58.0, Kesimpulan: "ANC T1"},
		{NIK: "1212016512920005", KehamilanKe: 2, Trimester: "2", KunjunganKe: 2, UsiaKehamilan: 24, TanggalPeriksa: time.Date(2026, 2, 10, 0, 0, 0, 0, time.UTC), NamaDokter: "dr. Andi Sp.OG", BeratBadan: 62.0, Kesimpulan: "ANC T2"},
		{NIK: "1212016512920005", KehamilanKe: 2, Trimester: "3", KunjunganKe: 3, UsiaKehamilan: 27, TanggalPeriksa: time.Date(2026, 3, 1, 0, 0, 0, 0, time.UTC), NamaDokter: "dr. Andi Sp.OG", BeratBadan: 64.0, Kesimpulan: "ANC T3 awal"},
		{NIK: "1212016512920005", KehamilanKe: 2, Trimester: "3", KunjunganKe: 4, UsiaKehamilan: 29, TanggalPeriksa: time.Date(2026, 4, 1, 0, 0, 0, 0, time.UTC), NamaDokter: "dr. Andi Sp.OG", BeratBadan: 65.2, Kesimpulan: "Waspada Hipertensi"},

		// TIURMA ID: 4
		{NIK: "1212014203940004", KehamilanKe: 1, Trimester: "1", KunjunganKe: 1, UsiaKehamilan: 11, TanggalPeriksa: time.Date(2025, 10, 10, 0, 0, 0, 0, time.UTC), BeratBadan: 50.0, Kesimpulan: "ANC T1"},
		{NIK: "1212014203940004", KehamilanKe: 1, Trimester: "2", KunjunganKe: 2, UsiaKehamilan: 25, TanggalPeriksa: time.Date(2026, 1, 15, 0, 0, 0, 0, time.UTC), BeratBadan: 56.0, Kesimpulan: "ANC T2"},
		{NIK: "1212014203940004", KehamilanKe: 1, Trimester: "3", KunjunganKe: 3, UsiaKehamilan: 32, TanggalPeriksa: time.Date(2026, 3, 15, 0, 0, 0, 0, time.UTC), BeratBadan: 59.5, Kesimpulan: "ANC T3"},
		{NIK: "1212014203940004", KehamilanKe: 1, Trimester: "3", KunjunganKe: 5, UsiaKehamilan: 34, TanggalPeriksa: time.Date(2026, 4, 2, 0, 0, 0, 0, time.UTC), BeratBadan: 60.5, Kesimpulan: "Janin aktif"},

		// DUMASI ID: 6
		{NIK: "1212015006970006", KehamilanKe: 2, Trimester: "1", KunjunganKe: 2, UsiaKehamilan: 13, TanggalPeriksa: time.Date(2026, 4, 3, 0, 0, 0, 0, time.UTC), BeratBadan: 55.0, Kesimpulan: "Riwayat abortus terkontrol"},

		// LAMBOK ID: 7
		{NIK: "1212014811930007", KehamilanKe: 1, Trimester: "1", KunjunganKe: 1, UsiaKehamilan: 9, TanggalPeriksa: time.Date(2025, 12, 1, 0, 0, 0, 0, time.UTC), BeratBadan: 48.0, Kesimpulan: "ANC T1"},
		{NIK: "1212014811930007", KehamilanKe: 1, Trimester: "2", KunjunganKe: 2, UsiaKehamilan: 20, TanggalPeriksa: time.Date(2026, 2, 15, 0, 0, 0, 0, time.UTC), BeratBadan: 52.0, Kesimpulan: "ANC T2"},
		{NIK: "1212014811930007", KehamilanKe: 1, Trimester: "2", KunjunganKe: 4, UsiaKehamilan: 25, TanggalPeriksa: time.Date(2026, 3, 28, 0, 0, 0, 0, time.UTC), BeratBadan: 54.5, Kesimpulan: "Ibu risiko KEK"},

		// PESTA ID: 8
		{NIK: "1212015509910008", KehamilanKe: 4, Trimester: "2", KunjunganKe: 2, UsiaKehamilan: 15, TanggalPeriksa: time.Date(2026, 4, 6, 0, 0, 0, 0, time.UTC), BeratBadan: 70.0, Kesimpulan: "Waspada diabetes"},
		{NIK: "1212015509910008", KehamilanKe: 4, Trimester: "2", KunjunganKe: 3, UsiaKehamilan: 18, TanggalPeriksa: time.Date(2026, 4, 15, 0, 0, 0, 0, time.UTC), BeratBadan: 71.5, Kesimpulan: "Kontrol rutin kembar"},

		// NURAINUN ID: 9
		{NIK: "1212016004960009", KehamilanKe: 2, Trimester: "1", KunjunganKe: 1, UsiaKehamilan: 5, TanggalPeriksa: time.Date(2026, 4, 7, 0, 0, 0, 0, time.UTC), BeratBadan: 57.5, Kesimpulan: "Konfirmasi hamil"},

		// HAMIDAH ID: 10
		{NIK: "1212014402990010", KehamilanKe: 1, Trimester: "1", KunjunganKe: 1, UsiaKehamilan: 11, TanggalPeriksa: time.Date(2025, 9, 1, 0, 0, 0, 0, time.UTC), BeratBadan: 55.0, Kesimpulan: "ANC T1"},
		{NIK: "1212014402990010", KehamilanKe: 1, Trimester: "2", KunjunganKe: 2, UsiaKehamilan: 26, TanggalPeriksa: time.Date(2025, 12, 15, 0, 0, 0, 0, time.UTC), BeratBadan: 60.0, Kesimpulan: "ANC T2"},
		{NIK: "1212014402990010", KehamilanKe: 1, Trimester: "3", KunjunganKe: 3, UsiaKehamilan: 38, TanggalPeriksa: time.Date(2026, 3, 10, 0, 0, 0, 0, time.UTC), BeratBadan: 64.5, Kesimpulan: "ANC T3"},
		{NIK: "1212014402990010", KehamilanKe: 1, Trimester: "3", KunjunganKe: 7, UsiaKehamilan: 42, TanggalPeriksa: time.Date(2026, 4, 9, 0, 0, 0, 0, time.UTC), BeratBadan: 66.0, Kesimpulan: "Post-term"},
	}

	now := time.Now()
	for _, d := range ancData {
		var kependudukanModel models.Kependudukan
		if err := db.Where("nik = ?", d.NIK).First(&kependudukanModel).Error; err != nil {
			continue
		}

		var ibuModel models.Ibu
		if err := db.Where("id_kependudukan = ?", kependudukanModel.IdKependudukan).First(&ibuModel).Error; err != nil {
			continue
		}

		var kehamilanModel models.Kehamilan
		if err := db.Where("id_ibu = ? AND kehamilan_ke = ?", ibuModel.IdIbu, d.KehamilanKe).First(&kehamilanModel).Error; err != nil {
			continue
		}

		tanggalKembali := d.TanggalKembali

		anc := models.PemeriksaanANC{
			FKIdKehamilan:             kehamilanModel.IdKehamilan,
			Trimester:                 d.Trimester,
			KunjunganKe:               d.KunjunganKe,
			UsiaKehamilan:             d.UsiaKehamilan,
			TanggalPeriksa:            d.TanggalPeriksa,
			TempatPeriksa:             d.TempatPeriksa,
			NamaDokter:                d.NamaDokter,
			TanggalKembali:            &tanggalKembali,
			BeratBadan:                d.BeratBadan,
			Lila:                      d.Lila,
			TinggiFundus:              d.TinggiFundus,
			TDSistolik:                d.TDSistolik,
			TDDiastolik:               d.TDDiastolik,
			Hemoglobin:                d.Hemoglobin,
			TesGulaDarah:              d.TesGulaDarah,
			ProteinUrin:               d.ProteinUrin,
			UrinReduksi:               d.UrinReduksi,
			GulaDarahPuasa:            d.GulaDarahPuasa,
			GulaDarah2JamPostPrandial: d.GulaDarah2JamPostPrandial,
			HIV:                       d.HIV,
			Sifilis:                   d.Sifilis,
			HepatitisB:                d.HepatitisB,
			CatatanPemeriksaanLanjut:  d.CatatanPemeriksaanLanjut,
			TataLaksanaKasus:          d.TataLaksanaKasus,
			CatatanPelayanan:          d.CatatanPelayanan,
			Kesimpulan:                d.Kesimpulan,
			CreatedAt:                 now,
			UpdatedAt:                 now,
		}

		if err := db.Where("id_kehamilan = ? AND kunjungan_ke = ?", anc.FKIdKehamilan, anc.KunjunganKe).
			FirstOrCreate(&anc).Error; err != nil {
			return err
		}
	}
	return nil
}
