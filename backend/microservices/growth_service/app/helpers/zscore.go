package helpers

import (
	"math"
	"monitoring-service/app/models"
)

// ZScoreCalculator menghitung Z-Score berdasarkan standar WHO
type ZScoreCalculator struct {
	standards []models.MasterStandarAntropometri
}

func NewZScoreCalculator(standards []models.MasterStandarAntropometri) *ZScoreCalculator {
	return &ZScoreCalculator{
		standards: standards,
	}
}

// FindStandard mencari standar berdasarkan parameter, jenis kelamin, dan nilai sumbu x
func (c *ZScoreCalculator) FindStandard(parameter string, jenisKelamin models.GenderType, nilaiSumbuX float64) *models.MasterStandarAntropometri {
	for _, std := range c.standards {
		if std.Parameter == parameter &&
			std.JenisKelamin == jenisKelamin &&
			math.Abs(std.NilaiSumbuX-nilaiSumbuX) < 0.01 {
			return &std
		}
	}
	return nil
}

// CalculateZScore menghitung Z-Score berdasarkan nilai yang diukur
func (c *ZScoreCalculator) CalculateZScore(standard *models.MasterStandarAntropometri, nilaiTerukur float64) float64 {
	if standard == nil {
		return 0
	}

	// Formula Z-Score = (nilai_terukur - median) / (SD)
	// Untuk nilai di atas median, gunakan SD positif
	// Untuk nilai di bawah median, gunakan SD negatif
	if nilaiTerukur >= standard.Median {
		sd := standard.SD2Pos
		if sd == 0 {
			return 0
		}
		return (nilaiTerukur - standard.Median) / sd
	}

	sd := standard.SD2Neg
	if sd == 0 {
		return 0
	}
	return (nilaiTerukur - standard.Median) / sd
}

// GetStatusGizi menentukan status gizi berdasarkan Z-Score IMT/U
func GetStatusGizi(zScore float64) models.StatusGizi {
	if zScore < -3 {
		return models.StatusGiziBuruk
	} else if zScore < -2 {
		return models.StatusGiziKurang
	} else if zScore <= 1 {
		return models.StatusGiziBaik
	} else if zScore <= 2 {
		return models.StatusGiziLebih
	}
	return models.StatusGiziObesitas
}

// GetStatusTBU menentukan status tinggi badan berdasarkan Z-Score TB/U
func GetStatusTBU(zScore float64) string {
	if zScore < -3 {
		return "sangat_pendek"
	} else if zScore < -2 {
		return "pendek"
	} else if zScore <= 2 {
		return "normal"
	}
	return "tinggi"
}

// GetStatusBBU menentukan status berat badan berdasarkan Z-Score BB/U
func GetStatusBBU(zScore float64) string {
	if zScore < -3 {
		return "berat_badan_sangat_kurang"
	} else if zScore < -2 {
		return "berat_badan_kurang"
	} else if zScore <= 2 {
		return "normal"
	}
	return "berat_badan_lebih"
}
