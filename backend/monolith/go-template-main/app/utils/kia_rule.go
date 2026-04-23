package utils

import (
	"monitoring-service/app/models"
	"time"
)

// // AGE WEIGHT (dipakai terbatas untuk domain tertentu)
// func getAgeWeight(month int) float64 {
// 	switch {
// 	case month <= 6:
// 		return 1.2
// 	case month <= 12:
// 		return 1.1
// 	case month <= 24:
// 		return 1.0
// 	case month <= 60:
// 		return 0.9
// 	default:
// 		return 1.0
// 	}
// }

// // RED FLAG CHECK (STRICT OVERRIDE)
// func isRedFlag(d models.DeteksiDiniPenyimpangan) bool {
// 	return d.BBperU == "SK" ||
// 		d.BBperTB == "GB" ||
// 		d.LILA == "GB" ||
// 		d.TBperU == "SP" ||
// 		d.LKperU == "Mi" ||
// 		d.LKperU == "Ma" ||
// 		d.KPSP == "Dp" ||
// 		d.MCHATRevised == "R" ||
// 		d.KMPE == "R" ||
// 		d.ACTRS == "R"
// }

// // MAIN RULE ENGINE
// func TentukanHasilKIA(d models.DeteksiDiniPenyimpangan) (string, string) {

// 	ageWeight := getAgeWeight(d.BulanKe)
// 	score := 0.0


// 	// RED FLAG OVERRIDE

// 	if isRedFlag(d) {
// 		return "Penyimpangan",
// 			"RUJUK: red flag SDIDTK (gizi/perkembangan/perilaku)"
// 	}


// 	// NUTRISI (BB/U)

// 	switch d.BBperU {
// 	case "SK":
// 		score += 4 * ageWeight
// 	case "K":
// 		score += 3 * ageWeight
// 	case "RBBL":
// 		score += 2 * ageWeight
// 	case "N":
// 		score += 0
// 	}


// 	// BB/TB (GIZI AKUT)

// 	switch d.BBperTB {
// 	case "GB":
// 		score += 4 * ageWeight
// 	case "GK":
// 		score += 3 * ageWeight
// 	case "RGL":
// 		score += 2 * ageWeight
// 	case "GL":
// 		score += 1 * ageWeight
// 	case "O":
// 		score += 1 * ageWeight
// 	case "N":
// 		score += 0
// 	}


// 	// TB/U (STUNTING)

// 	switch d.TBperU {
// 	case "SP":
// 		score += 4 * ageWeight
// 	case "P":
// 		score += 2 * ageWeight
// 	case "N", "Ti":
// 		score += 0
// 	}


// 	// LILA

// 	switch d.LILA {
// 	case "GB":
// 		score += 4 * ageWeight
// 	case "GK":
// 		score += 3 * ageWeight
// 	case "N":
// 		score += 0
// 	}


// 	// LK PER U (KEPALA)

// 	switch d.LKperU {
// 	case "Mi", "Ma":
// 		score += 3 * ageWeight
// 	case "N":
// 		score += 0
// 	}


// 	// KPSP (DEVELOPMENT - PRIORITY DOMAIN)

// 	switch d.KPSP {
// 	case "Dp":
// 		score += 5 * ageWeight
// 	case "Dm":
// 		score += 3 * ageWeight
// 	case "Ds":
// 		score += 0
// 	}


// 	// SENSORIK

// 	if d.TDD == "R" {
// 		score += 2
// 	}
// 	if d.TDL == "R" {
// 		score += 2
// 	}


// 	// EMOSI & PERILAKU

// 	if d.MCHATRevised == "R" {
// 		score += 4
// 	}
// 	if d.KMPE == "R" {
// 		score += 3
// 	}
// 	if d.ACTRS == "R" {
// 		score += 3
// 	}


// 	// DECISION ENGINE (FINAL KIA STANDARD)

// 	switch {
// 	case score >= 12:
// 		return "Rujuk",
// 			"Risiko sangat tinggi multi-domain → rujuk segera"

// 	case score >= 7:
// 		return "Meragukan",
// 			"Stimulasi intensif + evaluasi 2–4 minggu"

// 	case score >= 3:
// 		return "/Tindak lanjut",
// 			"Stimulasi di rumah + pemantauan"

// 	default:
// 		return "Tidak ada masalah",
// 			"Perkembangan sesuai usia"
// 	}
// }

// // FOLLOW UP RULE
// func TentukanKunjunganUlang(status string, now time.Time) time.Time {

// 	switch status {

// 	case "Penyimpangan":
// 		return time.Time{} // langsung rujuk

// 	case "Meragukan":
// 		return now.AddDate(0, 0, 14)

// 	case "Risiko":
// 		return now.AddDate(0, 0, 30)

// 	case "Normal":
// 		return now.AddDate(0, 2, 0)

// 	default:
// 		return now.AddDate(0, 1, 0)
// 	}
// }

// // RISK LEVEL MAPPING (FOR DASHBOARD / DB)
// func TentukanRisikoLevel(status string) string {
// 	switch status {
// 	case "Normal":
// 		return "LOW"
// 	case "Risiko":
// 		return "MEDIUM"
// 	case "Meragukan":
// 		return "HIGH"
// 	case "Penyimpangan":
// 		return "CRITICAL"
// 	default:
// 		return "UNKNOWN"
// 	}
// }
type HasilKIA struct {
	PKAT     string   `json:"pkat"`
	Tindakan string   `json:"tindakan"`
	Alasan   []string `json:"alasan"`
}

func isRedFlag(d models.DeteksiDiniPenyimpangan) bool {
	return d.BBperU == "SK" ||   // gizi buruk
		d.BBperTB == "GB" ||     // gizi buruk akut
		d.LILA == "GB" ||
		d.TBperU == "SP" ||     // stunting berat
		d.LKperU == "Mi" ||
		d.LKperU == "Ma" ||
		d.KPSP == "Dp" ||       // penyimpangan perkembangan
		d.MCHATRevised == "R"
}
func analisaMasalah(d models.DeteksiDiniPenyimpangan) (int, bool, []string) {

	problemCount := 0
	moderate := false
	alasan := []string{}

	// ======================
	// GIZI
	// ======================

	if d.BBperU == "K" {
		problemCount++
		moderate = true
		alasan = append(alasan, "BB/U kurang (gizi kurang)")
	}

	if d.BBperU == "RBBL" {
		problemCount++
		alasan = append(alasan, "BB/U berisiko")
	}

	if d.BBperTB == "GK" {
		problemCount++
		moderate = true
		alasan = append(alasan, "BB/TB gizi kurang")
	}

	if d.BBperTB == "GL" || d.BBperTB == "O" {
		problemCount++
		alasan = append(alasan, "BB/TB tidak normal")
	}

	// ======================
	// STUNTING
	// ======================

	if d.TBperU == "P" {
		problemCount++
		moderate = true
		alasan = append(alasan, "TB/U pendek (stunting)")
	}

	// ======================
	// LILA
	// ======================

	if d.LILA == "GK" {
		problemCount++
		moderate = true
		alasan = append(alasan, "LILA kurang")
	}

	// ======================
	// KEPALA
	// ======================

	if d.LKperU == "Mi" {
		problemCount++
		moderate = true
		alasan = append(alasan, "Lingkar kepala mikro")
	}

	if d.LKperU == "Ma" {
		problemCount++
		moderate = true
		alasan = append(alasan, "Lingkar kepala makro")
	}

	// ======================
	// PERKEMBANGAN
	// ======================

	if d.KPSP == "Dm" {
		problemCount++
		moderate = true
		alasan = append(alasan, "Perkembangan meragukan (KPSP)")
	}

	// ======================
	// SENSORIK
	// ======================

	if d.TDD == "R" {
		problemCount++
		moderate = true
		alasan = append(alasan, "Gangguan pendengaran")
	}

	if d.TDL == "R" {
		problemCount++
		moderate = true
		alasan = append(alasan, "Gangguan penglihatan")
	}

	// ======================
	// EMOSI / PERILAKU
	// ======================

	if d.KMPE == "R" {
		problemCount++
		moderate = true
		alasan = append(alasan, "Masalah mental emosional")
	}

	if d.ACTRS == "R" {
		problemCount++
		moderate = true
		alasan = append(alasan, "Gangguan perilaku")
	}

	return problemCount, moderate, alasan
}

func TentukanHasilKIA(d models.DeteksiDiniPenyimpangan) HasilKIA {

	// 🔴 RED FLAG
	if isRedFlag(d) {
		return HasilKIA{
			PKAT:     "Rujukan",
			Tindakan: "Rujukan",
			Alasan:   []string{"Ditemukan penyimpangan berat (red flag)"},
		}
	}

	// 🧩 ANALISA
	count, moderate, alasan := analisaMasalah(d)

	// 🟢 NORMAL
	if count == 0 {
		return HasilKIA{
			PKAT:     "Tidak ada masalah",
			Tindakan: "Stimulasi di rumah",
			Alasan:   []string{"Semua indikator normal"},
		}
	}

	// 🟡 1 MASALAH RINGAN
	if count == 1 && !moderate {
		return HasilKIA{
			PKAT:     "Tindak lanjut",
			Tindakan: "Stimulasi di rumah",
			Alasan:   alasan,
		}
	}

	// 🟠 INTERVENSI
	return HasilKIA{
		PKAT:     "Tindak lanjut",
		Tindakan: "Intervensi",
		Alasan:   alasan,
	}
}

func TentukanKunjunganUlang(pkat string, now time.Time) time.Time {

	switch pkat {

	case "Rujukan":
		return time.Time{} // langsung rujuk

	case "Tindak lanjut":
		return now.AddDate(0, 0, 14) // 2 minggu

	case "Tidak ada masalah":
		return now.AddDate(0, 2, 0) // 2 bulan

	default:
		return now.AddDate(0, 1, 0)
	}
}

func TentukanRisikoLevel(pkat string, tindakan string) string {

	switch {

	case pkat == "Rujukan":
		return "CRITICAL"

	case tindakan == "Intervensi":
		return "HIGH"

	case tindakan == "Stimulasi di rumah" && pkat == "Tindak lanjut":
		return "MEDIUM"

	case pkat == "Tidak ada masalah":
		return "LOW"

	default:
		return "UNKNOWN"
	}
}