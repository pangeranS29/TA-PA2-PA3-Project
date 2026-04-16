package seeders

import (
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

func SeedUSGTrimester3(db *gorm.DB) error {
	usgT3Data := []struct {
		NIK         string
		KehamilanKe uint8
		KunjunganKe uint8
		LabelJanin  string

		KeadaanBayi             string
		LokasiPlasenta          string
		JumlahCairanKetubanSdp  float32
		HasilCairanKetuban      string
		BPD                     float32
		BPDMinggu               int
		HC                      int
		HCMinggu                int
		AC                      int
		ACMinggu                int
		FL                      float32
		FLMinggu                int
		EfwTbj                  int
		EfwTbjMinggu            int
		KonsultasiLanjut        string
		RencanaProsesMelahirkan string
	}{
		//
		{
			NIK:                     "1212014405900001",
			KehamilanKe:             2,
			KunjunganKe:             3,
			LabelJanin:              "A",
			KeadaanBayi:             "Hidup, Presentasi Kepala",
			LokasiPlasenta:          "Fundus",
			JumlahCairanKetubanSdp:  5.5,
			HasilCairanKetuban:      "Cukup",
			BPD:                     90.5,
			BPDMinggu:               37,
			HC:                      330,
			HCMinggu:                37,
			AC:                      310,
			ACMinggu:                37,
			FL:                      71.0,
			FLMinggu:                37,
			EfwTbj:                  2900,
			EfwTbjMinggu:            37,
			KonsultasiLanjut:        "Rutin",
			RencanaProsesMelahirkan: "Normal/Pervaginam",
		},
		{
			NIK:                     "1212016512920005",
			KehamilanKe:             2,
			KunjunganKe:             3,
			LabelJanin:              "A",
			KeadaanBayi:             "Hidup, Presentasi Kepala",
			LokasiPlasenta:          "Corpus Posterior",
			JumlahCairanKetubanSdp:  4.2,
			HasilCairanKetuban:      "Cukup",
			BPD:                     82.0,
			BPDMinggu:               33,
			HC:                      305,
			HCMinggu:                33,
			AC:                      285,
			ACMinggu:                33,
			FL:                      64.0,
			FLMinggu:                33,
			EfwTbj:                  2100,
			EfwTbjMinggu:            33,
			KonsultasiLanjut:        "Evaluasi Ketat (Risiko Preeklampsia)",
			RencanaProsesMelahirkan: "Normal dengan Pemantauan",
		},
		{
			NIK:                     "1212014203940004",
			KehamilanKe:             1,
			KunjunganKe:             3,
			LabelJanin:              "A",
			KeadaanBayi:             "Hidup, Presentasi Kepala",
			LokasiPlasenta:          "Corpus Anterior",
			JumlahCairanKetubanSdp:  6.0,
			HasilCairanKetuban:      "Cukup",
			BPD:                     85.5,
			BPDMinggu:               35,
			HC:                      315,
			HCMinggu:                35,
			AC:                      295,
			ACMinggu:                35,
			FL:                      67.0,
			FLMinggu:                35,
			EfwTbj:                  2450,
			EfwTbjMinggu:            35,
			KonsultasiLanjut:        "Rutin",
			RencanaProsesMelahirkan: "Normal/Pervaginam",
		},
		{
			NIK:                     "1212014402990010",
			KehamilanKe:             1,
			KunjunganKe:             3,
			LabelJanin:              "A",
			KeadaanBayi:             "Hidup, Presentasi Kepala",
			LokasiPlasenta:          "Fundus",
			JumlahCairanKetubanSdp:  3.5,
			HasilCairanKetuban:      "Kurang (Oligohidramnion)",
			BPD:                     95.0,
			BPDMinggu:               40,
			HC:                      345,
			HCMinggu:                40,
			AC:                      340,
			ACMinggu:                40,
			FL:                      76.0,
			FLMinggu:                40,
			EfwTbj:                  3400,
			EfwTbjMinggu:            40,
			KonsultasiLanjut:        "Segera (Post-term)",
			RencanaProsesMelahirkan: "Tindakan Induksi/SC",
		},
	}

	now := time.Now()
	for _, d := range usgT3Data {
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

		usg := models.USGTrimester3{
			FKIdPemeriksaanAnc:      anc.IdPemeriksaanANC,
			FKIdJanin:               janin.IdJanin,
			KeadaanBayi:             d.KeadaanBayi,
			LokasiPlasenta:          d.LokasiPlasenta,
			JumlahCairanKetubanSdp:  d.JumlahCairanKetubanSdp,
			HasilCairanKetuban:      d.HasilCairanKetuban,
			BPD:                     d.BPD,
			BPDMinggu:               d.BPDMinggu,
			HC:                      d.HC,
			HCMinggu:                d.HCMinggu,
			AC:                      d.AC,
			ACMinggu:                d.ACMinggu,
			FL:                      d.FL,
			FLMinggu:                d.FLMinggu,
			EfwTbj:                  d.EfwTbj,
			EfwTbjMinggu:            d.EfwTbjMinggu,
			KonsultasiLanjut:        d.KonsultasiLanjut,
			RencanaProsesMelahirkan: d.RencanaProsesMelahirkan,
			CreatedAt:               now,
			UpdatedAt:               now,
		}

		if err := db.Where("id_anc = ? AND id_janin = ?", usg.FKIdPemeriksaanAnc, usg.FKIdJanin).
			FirstOrCreate(&usg).Error; err != nil {
			return err
		}
	}
	return nil
}
