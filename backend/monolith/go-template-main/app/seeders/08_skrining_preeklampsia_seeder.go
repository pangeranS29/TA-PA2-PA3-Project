package seeders

import (
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

func SeedSkriningPreeklampsia(db *gorm.DB) error {
	skriningPreklampsiaData := []struct {
		NIK             string
		KehamilanKe     uint8
		UsiaKehamilan   uint8
		Jawaban         models.JawabanPreeklampsia
		SkorTotal       int
		GulaDarahPuasa  float32
		GulaDarah2JamPP float32
		Kesimpulan      string
		Rekomendasi     string
	}{
		{
			NIK: "1212014405900001", KehamilanKe: 2, UsiaKehamilan: 39,
			Jawaban:   models.JawabanPreeklampsia{UsiaDiatas35: true},
			SkorTotal: 1, GulaDarahPuasa: 88, GulaDarah2JamPP: 110,
			Kesimpulan: "Risiko Rendah", Rekomendasi: "Kontrol rutin sesuai jadwal",
		},
		{
			NIK: "1212015208950002", KehamilanKe: 1, UsiaKehamilan: 22,
			Jawaban:   models.JawabanPreeklampsia{Nullipara: true},
			SkorTotal: 1, GulaDarahPuasa: 85, GulaDarah2JamPP: 105,
			Kesimpulan: "Risiko Rendah", Rekomendasi: "Konsumsi TTD dan nutrisi bergizi",
		},
		{
			NIK: "1212014101980003", KehamilanKe: 3, UsiaKehamilan: 8,
			Jawaban:   models.JawabanPreeklampsia{},
			SkorTotal: 0, GulaDarahPuasa: 90, GulaDarah2JamPP: 115,
			Kesimpulan: "Risiko Rendah", Rekomendasi: "Lanjutkan suplementasi asam folat",
		},
		{
			NIK: "1212016512920005", KehamilanKe: 2, UsiaKehamilan: 29,
			Jawaban:   models.JawabanPreeklampsia{MAPDiatas90: true, Proteinuria: true},
			SkorTotal: 2, GulaDarahPuasa: 95, GulaDarah2JamPP: 120,
			Kesimpulan: "Risiko Tinggi", Rekomendasi: "Rujuk RS, pemberian Aspirin dosis rendah sesuai instruksi dokter",
		},
		{
			NIK: "1212014203940004", KehamilanKe: 1, UsiaKehamilan: 34,
			Jawaban:   models.JawabanPreeklampsia{Nullipara: true},
			SkorTotal: 1, GulaDarahPuasa: 82, GulaDarah2JamPP: 100,
			Kesimpulan: "Risiko Rendah", Rekomendasi: "Pantau gerakan janin dan tekanan darah",
		},
		{
			NIK: "1212015006970006", KehamilanKe: 2, UsiaKehamilan: 13,
			Jawaban:   models.JawabanPreeklampsia{},
			SkorTotal: 0, GulaDarahPuasa: 85, GulaDarah2JamPP: 108,
			Kesimpulan: "Risiko Rendah", Rekomendasi: "Menjaga pola makan dan istirahat",
		},
		{
			NIK: "1212014811930007", KehamilanKe: 1, UsiaKehamilan: 25,
			Jawaban:   models.JawabanPreeklampsia{Nullipara: true},
			SkorTotal: 1, GulaDarahPuasa: 80, GulaDarah2JamPP: 95,
			Kesimpulan: "Risiko Rendah", Rekomendasi: "Pemberian PMT untuk atasi KEK",
		},
		{
			NIK: "1212015509910008", KehamilanKe: 4, UsiaKehamilan: 15,
			Jawaban:   models.JawabanPreeklampsia{UsiaDiatas35: true, Diabetes: true},
			SkorTotal: 3, GulaDarahPuasa: 110, GulaDarah2JamPP: 155,
			Kesimpulan: "Risiko Tinggi", Rekomendasi: "Diet rendah gula, konsul Sp.OG, pantau tekanan darah ketat",
		},
		{
			NIK: "1212016004960009", KehamilanKe: 2, UsiaKehamilan: 5,
			Jawaban:   models.JawabanPreeklampsia{},
			SkorTotal: 0, GulaDarahPuasa: 88, GulaDarah2JamPP: 112,
			Kesimpulan: "Risiko Rendah", Rekomendasi: "Kontrol ulang 4 minggu lagi",
		},
		{
			NIK: "1212014402990010", KehamilanKe: 1, UsiaKehamilan: 42,
			Jawaban:   models.JawabanPreeklampsia{Nullipara: true, RiwayatPreeklampsia: true, AntiPhospholipid: true},
			SkorTotal: 1, GulaDarahPuasa: 92, GulaDarah2JamPP: 118,
			Kesimpulan: "Risiko Rendah (Terkait Preeklampsia)", Rekomendasi: "Persiapan tindakan terminasi kehamilan (SC/Induksi)",
		},
	}

	now := time.Now()
	for _, d := range skriningPreklampsiaData {
		var kependudukan models.Kependudukan
		if err := db.Where("nik = ?", d.NIK).First(&kependudukan).Error; err != nil {
			continue;
		}

		var ibu models.Ibu
		if err := db.Where("id_kependudukan = ?", kependudukan.IdKependudukan).First(&ibu).Error; err != nil {
			continue;
		}

		var kehamilan models.Kehamilan
		if err := db.Where("id_ibu = ? AND kehamilan_ke = ?", ibu.IdIbu, d.KehamilanKe).First(&kehamilan).Error; err != nil {
			continue;
		}

		skrining := models.SkriningPreeklampsiaDanDiabetes{
			FKIdKehamilan:   kehamilan.IdKehamilan,
			UsiaKehamilan:   d.UsiaKehamilan,
			Jawaban:         d.Jawaban,
			SkorTotal:       d.SkorTotal,
			GulaDarahPuasa:  d.GulaDarahPuasa,
			GulaDarah2JamPP: d.GulaDarah2JamPP,
			Kesimpulan:      d.Kesimpulan,
			Rekomendasi:     d.Rekomendasi,
			CreatedAt:       now,
		}

		if err := db.Where("id_kehamilan = ?", skrining.FKIdKehamilan).FirstOrCreate(&skrining).Error; err != nil {
			return err
		}
	}
	return nil
}
