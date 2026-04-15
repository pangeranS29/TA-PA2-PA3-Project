package seeders

import (
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

func SeedUSGTrimester1(db *gorm.DB) error {
	usgT1Data := []struct {
		NIK         string
		KehamilanKe uint8
		KunjunganKe uint8
		LabelJanin  string

		JumlahGS                      string
		UmurKehamilanDiameterGSMinggu int
		UmurKehamilanDiameterGSHari   int
		DiameterGS                    float32
		UmurKehamilanCRLMinggu        int
		UmurKehamilanCRLHari          int
		CRL                           float32
		PulsasiJantung                string
		KecurigaanAbnormal            string
	}{
		{
			NIK:                           "1212014405900001",
			KehamilanKe:                   2,
			KunjunganKe:                   1,
			LabelJanin:                    "A",
			JumlahGS:                      "1",
			UmurKehamilanDiameterGSMinggu: 8,
			UmurKehamilanDiameterGSHari:   2,
			DiameterGS:                    28.0,
			UmurKehamilanCRLMinggu:        9,
			UmurKehamilanCRLHari:          1,
			CRL:                           23.0,
			PulsasiJantung:                "Ada",
			KecurigaanAbnormal:            "Tidak Ada",
		},
		{
			NIK:                           "1212015208950002",
			KehamilanKe:                   1,
			KunjunganKe:                   1,
			LabelJanin:                    "A",
			JumlahGS:                      "1",
			UmurKehamilanDiameterGSMinggu: 9,
			UmurKehamilanDiameterGSHari:   5,
			DiameterGS:                    35.0,
			UmurKehamilanCRLMinggu:        10,
			UmurKehamilanCRLHari:          2,
			CRL:                           32.0,
			PulsasiJantung:                "Ada",
			KecurigaanAbnormal:            "Tidak Ada",
		},
		{
			NIK:                           "1212014101980003",
			KehamilanKe:                   3,
			KunjunganKe:                   1,
			LabelJanin:                    "A",
			JumlahGS:                      "1",
			UmurKehamilanDiameterGSMinggu: 7,
			UmurKehamilanDiameterGSHari:   6,
			DiameterGS:                    25.0,
			UmurKehamilanCRLMinggu:        8,
			UmurKehamilanCRLHari:          0,
			CRL:                           16.0,
			PulsasiJantung:                "Ada",
			KecurigaanAbnormal:            "Tidak Ada",
		},
		{
			NIK:                           "1212016512920005",
			KehamilanKe:                   2,
			KunjunganKe:                   1,
			LabelJanin:                    "A",
			JumlahGS:                      "1",
			UmurKehamilanDiameterGSMinggu: 10,
			UmurKehamilanDiameterGSHari:   1,
			DiameterGS:                    40.0,
			UmurKehamilanCRLMinggu:        10,
			UmurKehamilanCRLHari:          4,
			CRL:                           38.0,
			PulsasiJantung:                "Ada",
			KecurigaanAbnormal:            "Tidak Ada",
		},
		{
			NIK:                           "1212014203940004",
			KehamilanKe:                   1,
			KunjunganKe:                   1,
			LabelJanin:                    "A",
			JumlahGS:                      "1",
			UmurKehamilanDiameterGSMinggu: 11,
			UmurKehamilanDiameterGSHari:   3,
			DiameterGS:                    48.0,
			UmurKehamilanCRLMinggu:        11,
			UmurKehamilanCRLHari:          6,
			CRL:                           52.0,
			PulsasiJantung:                "Ada",
			KecurigaanAbnormal:            "Tidak Ada",
		},
		{
			NIK:                           "1212015006970006",
			KehamilanKe:                   2,
			KunjunganKe:                   2,
			LabelJanin:                    "A",
			JumlahGS:                      "1",
			UmurKehamilanDiameterGSMinggu: 12,
			UmurKehamilanDiameterGSHari:   4,
			DiameterGS:                    55.0,
			UmurKehamilanCRLMinggu:        13,
			UmurKehamilanCRLHari:          0,
			CRL:                           65.0,
			PulsasiJantung:                "Ada",
			KecurigaanAbnormal:            "Tidak Ada",
		},
		{
			NIK:                           "1212014811930007",
			KehamilanKe:                   1,
			KunjunganKe:                   1,
			LabelJanin:                    "A",
			JumlahGS:                      "1",
			UmurKehamilanDiameterGSMinggu: 8,
			UmurKehamilanDiameterGSHari:   5,
			DiameterGS:                    30.0,
			UmurKehamilanCRLMinggu:        9,
			UmurKehamilanCRLHari:          0,
			CRL:                           24.0,
			PulsasiJantung:                "Ada",
			KecurigaanAbnormal:            "Tidak Ada",
		},
		{
			NIK:                           "1212015509910008",
			KehamilanKe:                   4,
			KunjunganKe:                   2,
			LabelJanin:                    "A",
			JumlahGS:                      "2",
			UmurKehamilanDiameterGSMinggu: 0,
			UmurKehamilanDiameterGSHari:   0,
			DiameterGS:                    0,
			UmurKehamilanCRLMinggu:        14,
			UmurKehamilanCRLHari:          5,
			CRL:                           85.0,
			PulsasiJantung:                "Ada",
			KecurigaanAbnormal:            "Tidak Ada",
		},
		{
			NIK:                           "1212015509910008",
			KehamilanKe:                   4,
			KunjunganKe:                   2,
			LabelJanin:                    "B",
			JumlahGS:                      "2",
			UmurKehamilanDiameterGSMinggu: 0,
			UmurKehamilanDiameterGSHari:   0,
			DiameterGS:                    0,
			UmurKehamilanCRLMinggu:        14,
			UmurKehamilanCRLHari:          3,
			CRL:                           83.0,
			PulsasiJantung:                "Ada",
			KecurigaanAbnormal:            "Tidak Ada",
		},
		{
			NIK:                           "1212016004960009",
			KehamilanKe:                   2,
			KunjunganKe:                   1,
			LabelJanin:                    "A",
			JumlahGS:                      "1",
			UmurKehamilanDiameterGSMinggu: 5,
			UmurKehamilanDiameterGSHari:   2,
			DiameterGS:                    10.0,
			UmurKehamilanCRLMinggu:        0,
			UmurKehamilanCRLHari:          0,
			CRL:                           0,
			PulsasiJantung:                "Belum Terlihat",
			KecurigaanAbnormal:            "Tidak Ada",
		},
		{
			NIK:                           "1212014402990010",
			KehamilanKe:                   1,
			KunjunganKe:                   1,
			LabelJanin:                    "A",
			JumlahGS:                      "1",
			UmurKehamilanDiameterGSMinggu: 11,
			UmurKehamilanDiameterGSHari:   0,
			DiameterGS:                    45.0,
			UmurKehamilanCRLMinggu:        11,
			UmurKehamilanCRLHari:          4,
			CRL:                           48.0,
			PulsasiJantung:                "Ada",
			KecurigaanAbnormal:            "Tidak Ada",
		},
	}

	now := time.Now()
	for _, d := range usgT1Data {
		var kependudukan models.Kependudukan
		if err := db.Where("nik = ?", d.NIK).First(&kependudukan).Error; err != nil {
			continue
		}
		var ibu models.Ibu
		if err := db.Where("id_kependudukan = ?", kependudukan.IdKependudukan).First(&ibu).Error; err != nil {
			continue
		}

		var kehamilan models.Kehamilan
		if err := db.Where("id_ibu = ? AND kehamilan_ke = ?", ibu.IdIbu, d.KehamilanKe).First(&kehamilan).Error; err != nil {
			continue
		}

		var janin models.Janin
		if err := db.Where("id_kehamilan = ? AND label_janin = ?", kehamilan.IdKehamilan, d.LabelJanin).First(&janin).Error; err != nil {
			continue
		}

		var anc models.PemeriksaanANC
		if err := db.Where("id_kehamilan = ? AND kunjungan_ke = ?", kehamilan.IdKehamilan, d.KunjunganKe).First(&anc).Error; err != nil {
			continue
		}

		usg := models.USGTrimester1{
			FKIdPemeriksaanAnc:            anc.IdPemeriksaanANC,
			FKIdJanin:                     janin.IdJanin,
			JumlahGS:                      d.JumlahGS,
			UmurKehamilanDiameterGSMinggu: d.UmurKehamilanDiameterGSMinggu,
			UmurKehamilanDiameterGSHari:   d.UmurKehamilanDiameterGSHari,
			DiameterGS:                    d.DiameterGS,
			UmurKehamilanCRLMinggu:        d.UmurKehamilanCRLMinggu,
			UmurKehamilanCRLHari:          d.UmurKehamilanCRLHari,
			CRL:                           d.CRL,
			PulsasiJantung:                d.PulsasiJantung,
			KecurigaanAbnormal:            d.KecurigaanAbnormal,
			CreatedAt:                     now,
			UpdatedAt:                     now,
		}

		if err := db.Where("id_anc = ? AND id_janin = ?", usg.FKIdPemeriksaanAnc, usg.FKIdJanin).
			FirstOrCreate(&usg).Error; err != nil {
			return err
		}
	}
	return nil
}
