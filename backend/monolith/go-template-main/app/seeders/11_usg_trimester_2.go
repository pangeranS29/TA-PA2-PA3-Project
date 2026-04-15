package seeders

import (
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

func SeedUSGTrimester2(db *gorm.DB) error {
	usgT2Data := []struct {
		NIK         string
		KehamilanKe uint8
		KunjunganKe uint8
		LabelJanin  string

		BPD                  float32
		BPDMinggu            int
		HC                   int
		HCMinggu             int
		AC                   int
		ACMinggu             int
		FL                   float32
		FLMinggu             int
		EfwTbj               int
		EfwTbjMinggu         int
		PresentilPertumbuhan int
	}{
		//
		{
			NIK:                  "1212014405900001",
			KehamilanKe:          2,
			KunjunganKe:          2,
			LabelJanin:           "A",
			BPD:                  45.5,
			BPDMinggu:            19,
			HC:                   170,
			HCMinggu:             19,
			AC:                   145,
			ACMinggu:             19,
			FL:                   30.0,
			FLMinggu:             19,
			EfwTbj:               300,
			EfwTbjMinggu:         19,
			PresentilPertumbuhan: 50,
		},
		{
			NIK:                  "1212015208950002",
			KehamilanKe:          1,
			KunjunganKe:          2,
			LabelJanin:           "A",
			BPD:                  54.0,
			BPDMinggu:            22,
			HC:                   200,
			HCMinggu:             22,
			AC:                   175,
			ACMinggu:             22,
			FL:                   38.0,
			FLMinggu:             22,
			EfwTbj:               480,
			EfwTbjMinggu:         22,
			PresentilPertumbuhan: 45,
		},
		{
			NIK:                  "1212016512920005",
			KehamilanKe:          2,
			KunjunganKe:          2,
			LabelJanin:           "A",
			BPD:                  68.0,
			BPDMinggu:            27,
			HC:                   255,
			HCMinggu:             27,
			AC:                   230,
			ACMinggu:             27,
			FL:                   52.0,
			FLMinggu:             27,
			EfwTbj:               1000,
			EfwTbjMinggu:         27,
			PresentilPertumbuhan: 55,
		},
		{
			NIK:                  "1212014203940004",
			KehamilanKe:          1,
			KunjunganKe:          2,
			LabelJanin:           "A",
			BPD:                  62.0,
			BPDMinggu:            25,
			HC:                   230,
			HCMinggu:             25,
			AC:                   205,
			ACMinggu:             25,
			FL:                   46.0,
			FLMinggu:             25,
			EfwTbj:               750,
			EfwTbjMinggu:         25,
			PresentilPertumbuhan: 50,
		},
		{
			NIK:                  "1212014811930007",
			KehamilanKe:          1,
			KunjunganKe:          2,
			LabelJanin:           "A",
			BPD:                  60.5,
			BPDMinggu:            24,
			HC:                   220,
			HCMinggu:             24,
			AC:                   195,
			ACMinggu:             24,
			FL:                   44.0,
			FLMinggu:             24,
			EfwTbj:               650,
			EfwTbjMinggu:         24,
			PresentilPertumbuhan: 40,
		},
		{
			NIK:                  "1212015509910008",
			KehamilanKe:          4,
			KunjunganKe:          3,
			LabelJanin:           "A",
			BPD:                  42.0,
			BPDMinggu:            18,
			HC:                   155,
			HCMinggu:             18,
			AC:                   130,
			ACMinggu:             18,
			FL:                   27.0,
			FLMinggu:             18,
			EfwTbj:               230,
			EfwTbjMinggu:         18,
			PresentilPertumbuhan: 48,
		},
		{
			NIK:                  "1212015509910008",
			KehamilanKe:          4,
			KunjunganKe:          3,
			LabelJanin:           "B",
			BPD:                  41.5,
			BPDMinggu:            18,
			HC:                   150,
			HCMinggu:             18,
			AC:                   128,
			ACMinggu:             18,
			FL:                   26.5,
			FLMinggu:             18,
			EfwTbj:               220,
			EfwTbjMinggu:         18,
			PresentilPertumbuhan: 45,
		},
		{
			NIK:                  "1212014402990010",
			KehamilanKe:          1,
			KunjunganKe:          2,
			LabelJanin:           "A",
			BPD:                  65.0,
			BPDMinggu:            26,
			HC:                   245,
			HCMinggu:             26,
			AC:                   215,
			ACMinggu:             26,
			FL:                   49.0,
			FLMinggu:             26,
			EfwTbj:               900,
			EfwTbjMinggu:         26,
			PresentilPertumbuhan: 50,
		},
	}

	now := time.Now()
	for _, d := range usgT2Data {
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

		usg := models.USGTrimester2{
			FKIdPemeriksaanAnc:   anc.IdPemeriksaanANC,
			FKIdJanin:            janin.IdJanin,
			BPD:                  d.BPD,
			BPDMinggu:            d.BPDMinggu,
			HC:                   d.HC,
			HCMinggu:             d.HCMinggu,
			AC:                   d.AC,
			ACMinggu:             d.ACMinggu,
			FL:                   d.FL,
			FLMinggu:             d.FLMinggu,
			EfwTbj:               d.EfwTbj,
			EfwTbjMinggu:         d.EfwTbjMinggu,
			PresentilPertumbuhan: d.PresentilPertumbuhan,
			CreatedAt:            now,
			UpdatedAt:            now,
		}

		if err := db.Where("id_anc = ? AND id_janin = ?", usg.FKIdPemeriksaanAnc, usg.FKIdJanin).
			FirstOrCreate(&usg).Error; err != nil {
			return err
		}
	}
	return nil
}
