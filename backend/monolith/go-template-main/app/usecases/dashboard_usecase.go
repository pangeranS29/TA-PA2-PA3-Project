package usecases

import (
	"fmt"
	"log"
	"monitoring-service/app/middlewares"
	"monitoring-service/app/models"
	"monitoring-service/app/utils"
	"time"
)

type DashboardUsecase interface {
	GetJumlahPerKelompokUsia(desaID *int32, role string) (*models.JumlahKelompokUsia, error)
	GetKesehatanPerKelompok(desaID *int32, role string) (models.KesehatanKelompokResponse, error)
	GetCakupanPemeriksaan(desaID *int32, role string) ([]models.CakupanPemeriksaan, error)
}

type dashboardUsecase struct {
	kependudukanUsecase KependudukanUsecase
	pemeriksaanUsecase  PemeriksaanUsecase
	anakUseCase         *AnakUseCase
}

func NewDashboardUsecase(
	kependudukanUsecase KependudukanUsecase,
	pemeriksaanUsecase PemeriksaanUsecase,
	anakUseCase *AnakUseCase,
) DashboardUsecase {
	return &dashboardUsecase{
		kependudukanUsecase: kependudukanUsecase,
		pemeriksaanUsecase:  pemeriksaanUsecase,
		anakUseCase:         anakUseCase,
	}
}

func safePercent(done, total int64) float64 {
	if total == 0 {
		return 0
	}
	return float64(done) / float64(total) * 100
}

// getFilteredPenduduk mengembalikan daftar penduduk aktif dengan filter desa jika diperlukan
func (u *dashboardUsecase) getFilteredPenduduk(desaID *int32, role string) ([]models.Kependudukan, error) {
	if middlewares.HasFullAccess(role) {
		return u.kependudukanUsecase.GetAllActive()
	}
	if desaID != nil {
		return u.kependudukanUsecase.GetAllActiveByDesaID(*desaID)
	}
	return []models.Kependudukan{}, nil
}

// getFilteredAnak mengembalikan daftar anak dengan filter desa jika diperlukan
func (u *dashboardUsecase) getFilteredAnak(desaID *int32, role string) ([]models.AnakResponse, error) {
	var targetDesaID *int32
	if !middlewares.HasFullAccess(role) {
		targetDesaID = desaID
	}
	return u.anakUseCase.ListAnakByDesa(targetDesaID, 0)
}

func (u *dashboardUsecase) GetJumlahPerKelompokUsia(desaID *int32, role string) (*models.JumlahKelompokUsia, error) {
	penduduks, err := u.getFilteredPenduduk(desaID, role)
	if err != nil {
		return nil, err
	}

	result := &models.JumlahKelompokUsia{}
	for _, p := range penduduks {
		umur := utils.HitungUmur(p.TanggalLahir)
		switch {
		case umur <= 5:
			// Dihitung terpisah dari daftar pencatatan anak
		case umur <= 12:
			// Dihitung terpisah dari daftar pencatatan anak
		case umur <= 18:
			result.Remaja++
		case umur <= 59:
			result.Dewasa++
		default:
			result.Lansia++
		}
	}

	anaks, err := u.getFilteredAnak(desaID, role)
	if err != nil {
		return nil, err
	}
	for _, a := range anaks {
		tglLahir, parseErr := time.Parse("2006-01-02", a.TanggalLahir)
		if parseErr != nil {
			continue
		}
		umur := utils.HitungUmur(tglLahir)
		if umur <= 5 {
			result.Balita++
		} else if umur <= 12 {
			result.Anak++
		}
	}

	return result, nil
}

func (u *dashboardUsecase) GetKesehatanPerKelompok(desaID *int32, role string) (models.KesehatanKelompokResponse, error) {
	penduduks, err := u.getFilteredPenduduk(desaID, role)
	if err != nil {
		return nil, err
	}

	// Kelompokkan ID per kelompok (sama seperti sebelumnya)
	kelompokIDs := map[string][]int32{
		"balita": {}, "anak": {}, "remaja": {}, "dewasa": {}, "lansia": {},
	}
	for _, p := range penduduks {
		umur := utils.HitungUmur(p.TanggalLahir)
		id := p.IDKependudukan
		switch {
		case umur <= 5:
			// Dihitung terpisah dari daftar pencatatan anak
		case umur <= 12:
			// Dihitung terpisah dari daftar pencatatan anak
		case umur <= 18:
			kelompokIDs["remaja"] = append(kelompokIDs["remaja"], id)
		case umur <= 59:
			kelompokIDs["dewasa"] = append(kelompokIDs["dewasa"], id)
		default:
			kelompokIDs["lansia"] = append(kelompokIDs["lansia"], id)
		}
	}

	anaks, err := u.getFilteredAnak(desaID, role)
	if err != nil {
		return nil, err
	}
	for _, a := range anaks {
		tglLahir, parseErr := time.Parse("2006-01-02", a.TanggalLahir)
		if parseErr != nil {
			continue
		}
		umur := utils.HitungUmur(tglLahir)
		if umur <= 5 {
			kelompokIDs["balita"] = append(kelompokIDs["balita"], a.PendudukID)
		} else if umur <= 12 {
			kelompokIDs["anak"] = append(kelompokIDs["anak"], a.PendudukID)
		}
	}

	result := make(models.KesehatanKelompokResponse)

	// Loop untuk kelompok yang memiliki data pemeriksaan
	for _, kelompok := range []string{"balita", "anak", "remaja", "dewasa", "lansia"} {
		if kelompok == "balita" {
			balitaRisk := models.RiskCount{"Rendah": 0, "Sedang": 0, "Tinggi": 0}
			for _, a := range anaks {
				tglLahir, parseErr := time.Parse("2006-01-02", a.TanggalLahir)
				if parseErr != nil {
					continue
				}
				umur := utils.HitungUmur(tglLahir)
				if umur <= 5 {
					switch a.StatusPrediksi {
					case "Stunting":
						balitaRisk["Tinggi"]++
					case "Risiko Stunting":
						balitaRisk["Sedang"]++
					case "Normal":
						balitaRisk["Rendah"]++
					}
				}
			}
			result[kelompok] = balitaRisk
		} else {
			ids := kelompokIDs[kelompok]
			riskCount, err := u.pemeriksaanUsecase.GetLatestRiskCountByPendudukIDs(kelompok, ids)
			if err != nil {
				// log error jika perlu, lalu default 0
				result[kelompok] = models.RiskCount{"Rendah": 0, "Sedang": 0, "Tinggi": 0}
			} else {
				result[kelompok] = riskCount
			}
		}
	}

	return result, nil
}

func (u *dashboardUsecase) GetCakupanPemeriksaan(desaID *int32, role string) ([]models.CakupanPemeriksaan, error) {
	log.Println(">>> GetCakupanPemeriksaan called")
	penduduks, err := u.getFilteredPenduduk(desaID, role)
	if err != nil {
		return nil, err
	}

	// Sama: kelompokkan ID per kelompok usia
	kelompokIDs := map[string][]int32{
		"balita": {}, "anak": {}, "remaja": {}, "dewasa": {}, "lansia": {},
	}
	for _, p := range penduduks {
		umur := utils.HitungUmur(p.TanggalLahir)
		id := p.IDKependudukan
		switch {
		case umur <= 5:
			// Dihitung terpisah dari daftar pencatatan anak
		case umur <= 12:
			// Dihitung terpisah dari daftar pencatatan anak
		case umur <= 18:
			kelompokIDs["remaja"] = append(kelompokIDs["remaja"], id)
		case umur <= 59:
			kelompokIDs["dewasa"] = append(kelompokIDs["dewasa"], id)
		default:
			kelompokIDs["lansia"] = append(kelompokIDs["lansia"], id)
		}
	}

	anaks, err := u.getFilteredAnak(desaID, role)
	if err != nil {
		return nil, err
	}
	for _, a := range anaks {
		tglLahir, parseErr := time.Parse("2006-01-02", a.TanggalLahir)
		if parseErr != nil {
			continue
		}
		umur := utils.HitungUmur(tglLahir)
		if umur <= 5 {
			kelompokIDs["balita"] = append(kelompokIDs["balita"], a.PendudukID)
		} else if umur <= 12 {
			kelompokIDs["anak"] = append(kelompokIDs["anak"], a.PendudukID)
		}
	}

	var result []models.CakupanPemeriksaan

	// Kelompok dengan data pemeriksaan
	for _, kelompok := range []string{"balita", "anak", "remaja", "dewasa", "lansia"} {
		ids := kelompokIDs[kelompok]
		total := int64(len(ids))
		var sudah int64 = 0
		if kelompok == "balita" {
			for _, a := range anaks {
				tglLahir, parseErr := time.Parse("2006-01-02", a.TanggalLahir)
				if parseErr != nil {
					continue
				}
				umur := utils.HitungUmur(tglLahir)
				if umur <= 5 && a.StatusPrediksi != "" {
					sudah++
				}
			}
		} else {
			if total > 0 {
				count, err := u.pemeriksaanUsecase.CountPendudukWithExamination(kelompok, ids)
				if err != nil {
					return nil, fmt.Errorf("gagal hitung pemeriksaan %s: %w", kelompok, err)
				}
				sudah = count
			}
		}
		result = append(result, models.CakupanPemeriksaan{
			Kelompok:       kelompok,
			TotalSasaran:   total,
			SudahDiperiksa: sudah,
			BelumDiperiksa: total - sudah,
			Persentase:     safePercent(sudah, total),
		})
	}

	return result, nil
}
