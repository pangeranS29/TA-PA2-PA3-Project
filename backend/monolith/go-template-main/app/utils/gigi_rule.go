package utils

func HitungRisikoGigi(usiaBulan int, jumlahGigi int, berlubang int, plak string) string {
	if jumlahGigi == 0 {
		return "Rendah"
	}

	rasio := float64(berlubang) / float64(jumlahGigi)

	risiko := "Rendah"

	// Base risk
	if rasio >= 0.3 {
		risiko = "Tinggi"
	} else if rasio >= 0.1 {
		risiko = "Sedang"
	}

	// Adjustment plak
	if plak == "Kotor" {
		if risiko == "Rendah" {
			risiko = "Sedang"
		} else if risiko == "Sedang" {
			risiko = "Tinggi"
		}
	}

	// Early childhood
	if usiaBulan < 24 && berlubang > 0 {
		if risiko == "Rendah" {
			risiko = "Sedang"
		}
	}

	return risiko
}