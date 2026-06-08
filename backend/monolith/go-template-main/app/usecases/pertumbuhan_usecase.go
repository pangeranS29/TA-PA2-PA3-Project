package usecases

import (
	"fmt"
	"math"
	"strconv"
	"strings"
	"time"

	"monitoring-service/app/models"
	"monitoring-service/pkg/customerror"
)

const (
	ParamBBU  = "bb_u"
	ParamTBU  = "tb_u"
	ParamIMTU = "imt_u"
	ParamBBTB = "bb_tb"
	ParamLKU  = "lk_u"
)

// Helper untuk menghitung Z-Score berdasarkan data Master Standar
func hitungZScore(aktual float64, standar *models.MasterStandarAntropometri) float64 {
	if standar == nil {
		return 0
	}

	var sd float64
	if aktual < standar.Median {
		sd = (standar.Median - standar.SD2Neg) / 2
	} else {
		sd = (standar.SD2Pos - standar.Median) / 2
	}

	if sd == 0 {
		return 0
	}

	zScore := (aktual - standar.Median) / sd
	return math.Round(zScore*100) / 100
}

// Interpretasi Status Gizi
func interpretasiStatusBBU(zScore float64) string {
	if zScore < -3 {
		return "Berat Badan Sangat Kurang (Severely Underweight)"
	} else if zScore >= -3 && zScore < -2 {
		return "Berat Badan Kurang (Underweight)"
	} else if zScore >= -2 && zScore <= 1 {
		return "Berat Badan Normal"
	}
	return "Risiko Berat Badan Lebih"
}

func interpretasiStatusTBU(zScore float64) string {
	if zScore < -3 {
		return "Sangat Pendek (Severely Stunted)"
	} else if zScore >= -3 && zScore < -2 {
		return "Pendek (Stunted)"
	} else if zScore >= -2 && zScore <= 3 {
		return "Normal"
	}
	return "Tinggi"
}

func interpretasiStatusIMTU(zScore float64) string {
	if zScore < -3 {
		return "Gizi Buruk (Severely Wasted)"
	} else if zScore >= -3 && zScore < -2 {
		return "Gizi Kurang (Wasted)"
	} else if zScore >= -2 && zScore <= 1 {
		return "Gizi Baik (Normal)"
	} else if zScore > 1 && zScore <= 2 {
		return "Berisiko Gizi Lebih (Possible Risk of Overweight)"
	} else if zScore > 2 && zScore <= 3 {
		return "Gizi Lebih (Overweight)"
	}
	return "Obesitas (Obese)"
}

func interpretasiStatusBBTB(zScore float64) string {
	if zScore < -3 {
		return "Gizi Buruk (Severely Wasted)"
	} else if zScore >= -3 && zScore < -2 {
		return "Gizi Kurang (Wasted)"
	} else if zScore >= -2 && zScore <= 1 {
		return "Gizi Baik (Normal)"
	} else if zScore > 1 && zScore <= 2 {
		return "Berisiko Gizi Lebih"
	} else if zScore > 2 && zScore <= 3 {
		return "Gizi Lebih"
	}
	return "Obesitas"
}

func interpretasiStatusLKU(zScore float64) string {
	if zScore < -2 {
		return "Lingkar Kepala Kecil"
	} else if zScore <= 2 {
		return "Lingkar Kepala Normal"
	}
	return "Lingkar Kepala Besar"
}

func parseTanggalLahir(value string) (time.Time, error) {
	formats := []string{"2006-01-02", "02-01-2006", "2006/01/02"}
	for _, f := range formats {
		t, err := time.Parse(f, value)
		if err == nil {
			return t, nil
		}
	}
	return time.Time{}, customerror.NewBadRequestError("format tanggal lahir tidak valid")
}

func sanitizeGender(raw string) string {
	v := strings.TrimSpace(strings.ToLower(raw))
	if v == "m" || v == "male" || v == "l" || strings.Contains(v, "laki") {
		return "M"
	}
	if v == "f" || v == "female" || v == "p" || strings.Contains(v, "perem") {
		return "F"
	}
	return raw
}

func parseUsiaReferensiToBulan(raw string) (float64, error) {
	v := strings.TrimSpace(raw)
	if v == "" {
		return 0, customerror.NewBadRequestError("usia_referensi tidak boleh kosong")
	}

	if strings.Contains(v, ":") {
		parts := strings.Split(v, ":")
		if len(parts) != 2 {
			return 0, customerror.NewBadRequestError("format usia_referensi tidak valid, gunakan tahun:bulan atau bulan")
		}

		tahun, err := strconv.Atoi(strings.TrimSpace(parts[0]))
		if err != nil || tahun < 0 {
			return 0, customerror.NewBadRequestError("tahun pada usia_referensi harus angka >= 0")
		}

		bulan, err := strconv.Atoi(strings.TrimSpace(parts[1]))
		if err != nil || bulan < 0 || bulan > 11 {
			return 0, customerror.NewBadRequestError("bulan pada usia_referensi harus angka 0 sampai 11")
		}

		return float64((tahun * 12) + bulan), nil
	}

	totalBulan, err := strconv.Atoi(v)
	if err != nil || totalBulan < 0 {
		return 0, customerror.NewBadRequestError("usia_referensi harus angka bulan >= 0 atau format tahun:bulan")
	}

	return float64(totalBulan), nil
}

func formatBulanToYM(nilaiSumbuX float64) string {
	totalBulan := int(math.Round(nilaiSumbuX))
	if totalBulan < 0 {
		totalBulan = 0
	}
	return fmt.Sprintf("%d:%d", totalBulan/12, totalBulan%12)
}

func extractAnakTanggalLahirDanGender(anak *models.Anak) (string, string, error) {
	if anak == nil {
		return "", "", customerror.NewBadRequestError("data anak tidak ditemukan")
	}

	var tanggalLahir string
	var jenisKelamin string

	if anak.Penduduk != nil {
		if !anak.Penduduk.TanggalLahir.IsZero() {
			tanggalLahir = anak.Penduduk.TanggalLahir.Format("2006-01-02")
		}
		jenisKelamin = strings.TrimSpace(anak.Penduduk.JenisKelamin)
	}

	if tanggalLahir == "" {
		return "", "", customerror.NewBadRequestError("tanggal lahir anak belum tersedia")
	}
	if jenisKelamin == "" {
		return "", "", customerror.NewBadRequestError("jenis kelamin anak belum tersedia")
	}

	return tanggalLahir, jenisKelamin, nil
}

func getKurvaKMSLabel(usiaBulan int) string {
	if usiaBulan <= 24 {
		return "KMS 0-2 Tahun"
	}
	return "KMS 2-5 Tahun"
}

func getKBMPerBulanGram(usiaBulan int) int {
	switch {
	case usiaBulan <= 0:
		return 0
	case usiaBulan == 1:
		return 800
	case usiaBulan == 2:
		return 900
	case usiaBulan == 3:
		return 800
	case usiaBulan == 4:
		return 600
	case usiaBulan == 5:
		return 500
	case usiaBulan == 6:
		return 400
	case usiaBulan == 7:
		return 300
	default:
		return 200
	}
}

func hitungKMSStatus(current models.CatatanPertumbuhan, prev *models.CatatanPertumbuhan, stdBBU *models.MasterStandarAntropometri) (string, string, int, float64, string) {
	statusNaik := "Data Awal"
	kbmMinGram := 0
	kenaikanGram := 0.0

	if prev != nil {
		deltaUsia := current.UsiaUkurBulan - prev.UsiaUkurBulan
		if deltaUsia <= 0 {
			deltaUsia = 1
		}

		kbmMinGram = getKBMPerBulanGram(prev.UsiaUkurBulan) * deltaUsia
		kenaikanGram = math.Round((current.BeratBadan-prev.BeratBadan)*1000*100) / 100

		if kenaikanGram >= float64(kbmMinGram) {
			statusNaik = "Naik (N)"
		} else {
			statusNaik = "Tidak Naik (T)"
		}
	}

	statusBGM := "Tidak"
	if stdBBU != nil && current.BeratBadan < stdBBU.SD3Neg {
		statusBGM = "Di bawah garis merah"
	}

	statusInfo := "Pertumbuhan sesuai KMS"
	if statusNaik == "Tidak Naik (T)" && statusBGM == "Di bawah garis merah" {
		statusInfo = "Perlu rujukan: berat tidak naik dan di bawah garis merah"
	} else if statusNaik == "Tidak Naik (T)" {
		statusInfo = "Perlu evaluasi: berat tidak naik"
	} else if statusBGM == "Di bawah garis merah" {
		statusInfo = "Perlu rujukan: di bawah garis merah"
	}

	return statusNaik, statusBGM, kbmMinGram, kenaikanGram, statusInfo
}

func validateCreatePertumbuhanRequest(req *models.CreatePertumbuhanRequest) error {
	if req == nil {
		return customerror.NewBadRequestError("request tidak boleh kosong")
	}

	if req.AnakID == 0 {
		return customerror.NewBadRequestError("anak_id wajib diisi")
	}

	if strings.TrimSpace(req.TglUkur) == "" {
		return customerror.NewBadRequestError("tgl_ukur wajib diisi")
	}

	if req.BeratBadan <= 0 {
		return customerror.NewBadRequestError("berat_badan wajib diisi dan harus lebih dari 0")
	}

	if req.TinggiBadan <= 0 {
		return customerror.NewBadRequestError("tinggi_badan wajib diisi dan harus lebih dari 0")
	}

	if req.LingkarKepala < 0 {
		return customerror.NewBadRequestError("lingkar_kepala tidak boleh bernilai negatif")
	}

	return nil
}

func (m *Main) recalculateAntropometri(catatan *models.CatatanPertumbuhan, gender string) {
	if catatan == nil {
		return
	}

	stdBBU, _ := m.repository.GetStandarAntropometri(ParamBBU, gender, float64(catatan.UsiaUkurBulan))
	if stdBBU != nil {
		catatan.ZScoreBBU = hitungZScore(catatan.BeratBadan, stdBBU)
		catatan.StatusBBU = interpretasiStatusBBU(catatan.ZScoreBBU)
	}

	stdTBU, _ := m.repository.GetStandarAntropometri(ParamTBU, gender, float64(catatan.UsiaUkurBulan))
	if stdTBU != nil {
		catatan.ZScoreTBU = hitungZScore(catatan.TinggiBadan, stdTBU)
		catatan.StatusTBU = interpretasiStatusTBU(catatan.ZScoreTBU)
	}

	stdBBTB, _ := m.repository.GetStandarAntropometri(ParamBBTB, gender, catatan.TinggiBadan)
	if stdBBTB != nil {
		catatan.ZScoreBBTB = hitungZScore(catatan.BeratBadan, stdBBTB)
		catatan.StatusBBTB = interpretasiStatusBBTB(catatan.ZScoreBBTB)
	}
}

func (m *Main) AddCatatanPertumbuhan(req *models.CreatePertumbuhanRequest) error {
	if err := validateCreatePertumbuhanRequest(req); err != nil {
		return err
	}

	dataAnak, err := m.repository.GetAnakByID(req.AnakID)
	if err != nil {
		return err
	}

	tglUkur, err := time.Parse("2006-01-02", req.TglUkur)
	if err != nil {
		return customerror.NewBadRequestError("format tanggal ukur tidak valid, gunakan YYYY-MM-DD")
	}

	catatan := &models.CatatanPertumbuhan{
		AnakID:        int32(req.AnakID),
		TglUkur:       tglUkur,
		BeratBadan:    req.BeratBadan,
		TinggiBadan:   req.TinggiBadan,
		LingkarKepala: req.LingkarKepala,
		HasilLila:     req.HasilLila,
		CatatanNakes:  req.CatatanNakes,
	}

	catatan.IMT = catatan.HitungIMT()

	rawTanggalLahir, rawGender, extractErr := extractAnakTanggalLahirDanGender(dataAnak)
	if extractErr == nil && rawTanggalLahir != "" && rawGender != "" {
		tanggalLahir, parseErr := parseTanggalLahir(rawTanggalLahir)
		if parseErr == nil {
			gender := sanitizeGender(rawGender)

			catatan.UsiaUkurBulan = catatan.HitungUsiaBulan(tanggalLahir)
			m.recalculateAntropometri(catatan, gender)

			stdIMTU, _ := m.repository.GetStandarAntropometri(ParamIMTU, gender, float64(catatan.UsiaUkurBulan))
			if stdIMTU != nil {
				catatan.ZScoreIMTU = hitungZScore(catatan.IMT, stdIMTU)
				catatan.StatusIMTU = interpretasiStatusIMTU(catatan.ZScoreIMTU)
			}

			if catatan.LingkarKepala > 0 {
				stdLKU, _ := m.repository.GetStandarAntropometri(ParamLKU, gender, float64(catatan.UsiaUkurBulan))
				if stdLKU != nil {
					catatan.ZScoreLKU = hitungZScore(catatan.LingkarKepala, stdLKU)
					catatan.StatusLKU = interpretasiStatusLKU(catatan.ZScoreLKU)
				}
			}
		}
	}

	if err := m.repository.CreateCatatanPertumbuhan(catatan); err != nil {
		return err
	}

	return nil
}

// =============================================================================
// GRAFIK CHART — ENDPOINT LAMA (DEPRECATED, tetap berjalan untuk backward compat)
// GetPertumbuhanChart returns riwayat + standar bb_u + standar tb_u (response gabungan)
// Gunakan endpoint per-kategori di bawah untuk integrasi baru.
// =============================================================================
func (m *Main) GetPertumbuhanChart(anakID uint) (map[string]interface{}, error) {
	dataAnak, err := m.repository.GetAnakByID(anakID)
	if err != nil {
		return nil, err
	}

	_, rawGender, err := extractAnakTanggalLahirDanGender(dataAnak)
	if err != nil {
		return nil, err
	}
	gender := sanitizeGender(rawGender)
	genderNorm := normalizeGenderStr(gender)

	riwayat, _ := m.repository.GetRiwayatPertumbuhanByAnakID(anakID)

	type RiwayatItem struct {
		UsiaUkurBulan int     `json:"usia_ukur_bulan"`
		BeratBadan    float64 `json:"berat_badan"`
		TinggiBadan   float64 `json:"tinggi_badan"`
		HasilLila     float64 `json:"hasil_lila"`
		LingkarKepala float64 `json:"lingkar_kepala"`
		TglUkur       string  `json:"tgl_ukur"`
	}
	riwayatList := make([]RiwayatItem, 0, len(riwayat))
	for _, r := range riwayat {
		riwayatList = append(riwayatList, RiwayatItem{
			UsiaUkurBulan: r.UsiaUkurBulan,
			BeratBadan:    r.BeratBadan,
			TinggiBadan:   r.TinggiBadan,
			HasilLila:     r.HasilLila,
			LingkarKepala: r.LingkarKepala,
			TglUkur:       r.TglUkur.Format("2006-01-02"),
		})
	}

	standarBBU, _ := m.repository.GetMasterStandarByFilter(ParamBBU, genderNorm)
	standarTBU, _ := m.repository.GetMasterStandarByFilter(ParamTBU, genderNorm)

	return map[string]interface{}{
		"riwayat":      riwayatList,
		"standar_bb_u": standarBBU,
		"standar_tb_u": standarTBU,
	}, nil
}

// =============================================================================
// GRAFIK CHART — ENDPOINT BARU PER KATEGORI
// =============================================================================

// riwayatChartBase adalah data riwayat dasar yang dipakai di semua chart
type riwayatChartBase struct {
	ID            uint    `json:"id"`
	AnakID        int32   `json:"anak_id"`
	TglUkur       string  `json:"tgl_ukur"`
	UsiaUkurBulan int     `json:"usia_ukur_bulan"`
	UsiaUkurYM    string  `json:"usia_ukur_tahun_bulan"`
	BeratBadan    float64 `json:"berat_badan"`
	TinggiBadan   float64 `json:"tinggi_badan"`
}

// GetChartBBTB mengembalikan data grafik Berat Badan/Tinggi Badan
// GET /pertumbuhan/chart/bb-tb/:anak_id
func (m *Main) GetChartBBTB(anakID uint) (map[string]interface{}, error) {
	dataAnak, err := m.repository.GetAnakByID(anakID)
	if err != nil {
		return nil, err
	}

	_, rawGender, err := extractAnakTanggalLahirDanGender(dataAnak)
	if err != nil {
		return nil, err
	}
	gender := sanitizeGender(rawGender)
	genderNorm := normalizeGenderStr(gender)

	riwayat, _ := m.repository.GetRiwayatPertumbuhanByAnakID(anakID)

	type ItemBBTB struct {
		riwayatChartBase
		ZScoreBBTB float64 `json:"z_score_bb_tb"`
		StatusBBTB string  `json:"status_bb_tb"`
	}

	list := make([]ItemBBTB, 0, len(riwayat))
	for _, r := range riwayat {
		item := ItemBBTB{
			riwayatChartBase: riwayatChartBase{
				ID:            uint(r.ID),
				AnakID:        r.AnakID,
				TglUkur:       r.TglUkur.Format("2006-01-02"),
				UsiaUkurBulan: r.UsiaUkurBulan,
				UsiaUkurYM:    fmt.Sprintf("%d:%d", r.UsiaUkurBulan/12, r.UsiaUkurBulan%12),
				BeratBadan:    r.BeratBadan,
				TinggiBadan:   r.TinggiBadan,
			},
			ZScoreBBTB: r.ZScoreBBTB,
			StatusBBTB: r.StatusBBTB,
		}
		// Recalculate jika z_score belum tersimpan (misal data lama)
		if r.ZScoreBBTB == 0 {
			std, _ := m.repository.GetStandarAntropometri(ParamBBTB, gender, r.TinggiBadan)
			if std != nil {
				item.ZScoreBBTB = hitungZScore(r.BeratBadan, std)
				item.StatusBBTB = interpretasiStatusBBTB(item.ZScoreBBTB)
			}
		}
		list = append(list, item)
	}

	standar, _ := m.repository.GetMasterStandarByFilter(ParamBBTB, genderNorm)

	return map[string]interface{}{
		"kategori":       "BB/TB",
		"deskripsi":      "Berat Badan menurut Tinggi Badan",
		"riwayat":        list,
		"standar_bb_tb":  standar,
	}, nil
}

// GetChartBBU mengembalikan data grafik Berat Badan/Umur
// GET /pertumbuhan/chart/bb-u/:anak_id
func (m *Main) GetChartBBU(anakID uint) (map[string]interface{}, error) {
	dataAnak, err := m.repository.GetAnakByID(anakID)
	if err != nil {
		return nil, err
	}

	_, rawGender, err := extractAnakTanggalLahirDanGender(dataAnak)
	if err != nil {
		return nil, err
	}
	gender := sanitizeGender(rawGender)
	genderNorm := normalizeGenderStr(gender)

	riwayat, _ := m.repository.GetRiwayatPertumbuhanByAnakID(anakID)

	type ItemBBU struct {
		riwayatChartBase
		ZScoreBBU  float64 `json:"z_score_bb_u"`
		StatusBBU  string  `json:"status_bb_u"`
		// KMS fields
		StatusKMSNaik string  `json:"status_kms_naik,omitempty"`
		StatusKMSBGM  string  `json:"status_kms_bgm,omitempty"`
		KBMMinGram    int     `json:"kbm_min_gram,omitempty"`
		KenaikanGram  float64 `json:"kenaikan_bb_gram,omitempty"`
		StatusKMSInfo string  `json:"status_kms_info,omitempty"`
	}

	list := make([]ItemBBU, 0, len(riwayat))
	var prev *models.CatatanPertumbuhan
	for _, r := range riwayat {
		zScore := r.ZScoreBBU
		status := r.StatusBBU

		// Recalculate jika z_score belum tersimpan
		if zScore == 0 {
			std, _ := m.repository.GetStandarAntropometri(ParamBBU, gender, float64(r.UsiaUkurBulan))
			if std != nil {
				zScore = hitungZScore(r.BeratBadan, std)
				status = interpretasiStatusBBU(zScore)
			}
		}

		stdBBU, _ := m.repository.GetStandarAntropometri(ParamBBU, gender, float64(r.UsiaUkurBulan))
		statusNaik, statusBGM, kbmMin, kenaikan, statusInfo := hitungKMSStatus(r, prev, stdBBU)

		item := ItemBBU{
			riwayatChartBase: riwayatChartBase{
				ID:            uint(r.ID),
				AnakID:        r.AnakID,
				TglUkur:       r.TglUkur.Format("2006-01-02"),
				UsiaUkurBulan: r.UsiaUkurBulan,
				UsiaUkurYM:    fmt.Sprintf("%d:%d", r.UsiaUkurBulan/12, r.UsiaUkurBulan%12),
				BeratBadan:    r.BeratBadan,
				TinggiBadan:   r.TinggiBadan,
			},
			ZScoreBBU:     zScore,
			StatusBBU:     status,
			StatusKMSNaik: statusNaik,
			StatusKMSBGM:  statusBGM,
			KBMMinGram:    kbmMin,
			KenaikanGram:  kenaikan,
			StatusKMSInfo: statusInfo,
		}
		list = append(list, item)

		cur := r
		prev = &cur
	}

	standar, _ := m.repository.GetMasterStandarByFilter(ParamBBU, genderNorm)

	return map[string]interface{}{
		"kategori":     "BB/U",
		"deskripsi":    "Berat Badan menurut Umur",
		"riwayat":      list,
		"standar_bb_u": standar,
	}, nil
}

// GetChartTBU mengembalikan data grafik Tinggi Badan/Umur
// GET /pertumbuhan/chart/tb-u/:anak_id
func (m *Main) GetChartTBU(anakID uint) (map[string]interface{}, error) {
	dataAnak, err := m.repository.GetAnakByID(anakID)
	if err != nil {
		return nil, err
	}

	_, rawGender, err := extractAnakTanggalLahirDanGender(dataAnak)
	if err != nil {
		return nil, err
	}
	gender := sanitizeGender(rawGender)
	genderNorm := normalizeGenderStr(gender)

	riwayat, _ := m.repository.GetRiwayatPertumbuhanByAnakID(anakID)

	type ItemTBU struct {
		riwayatChartBase
		ZScoreTBU float64 `json:"z_score_tb_u"`
		StatusTBU string  `json:"status_tb_u"`
	}

	list := make([]ItemTBU, 0, len(riwayat))
	for _, r := range riwayat {
		zScore := r.ZScoreTBU
		status := r.StatusTBU

		// Recalculate jika z_score belum tersimpan
		if zScore == 0 {
			std, _ := m.repository.GetStandarAntropometri(ParamTBU, gender, float64(r.UsiaUkurBulan))
			if std != nil {
				zScore = hitungZScore(r.TinggiBadan, std)
				status = interpretasiStatusTBU(zScore)
			}
		}

		list = append(list, ItemTBU{
			riwayatChartBase: riwayatChartBase{
				ID:            uint(r.ID),
				AnakID:        r.AnakID,
				TglUkur:       r.TglUkur.Format("2006-01-02"),
				UsiaUkurBulan: r.UsiaUkurBulan,
				UsiaUkurYM:    fmt.Sprintf("%d:%d", r.UsiaUkurBulan/12, r.UsiaUkurBulan%12),
				BeratBadan:    r.BeratBadan,
				TinggiBadan:   r.TinggiBadan,
			},
			ZScoreTBU: zScore,
			StatusTBU: status,
		})
	}

	standar, _ := m.repository.GetMasterStandarByFilter(ParamTBU, genderNorm)

	return map[string]interface{}{
		"kategori":     "TB/U",
		"deskripsi":    "Tinggi Badan menurut Umur",
		"riwayat":      list,
		"standar_tb_u": standar,
	}, nil
}

// GetChartIMTU mengembalikan data grafik Indeks Massa Tubuh/Umur
// GET /pertumbuhan/chart/imt-u/:anak_id
func (m *Main) GetChartIMTU(anakID uint) (map[string]interface{}, error) {
	dataAnak, err := m.repository.GetAnakByID(anakID)
	if err != nil {
		return nil, err
	}

	_, rawGender, err := extractAnakTanggalLahirDanGender(dataAnak)
	if err != nil {
		return nil, err
	}
	gender := sanitizeGender(rawGender)
	genderNorm := normalizeGenderStr(gender)

	riwayat, _ := m.repository.GetRiwayatPertumbuhanByAnakID(anakID)

	type ItemIMTU struct {
		riwayatChartBase
		IMT        float64 `json:"imt"`
		ZScoreIMTU float64 `json:"z_score_imt_u"`
		StatusIMTU string  `json:"status_imt_u"`
	}

	list := make([]ItemIMTU, 0, len(riwayat))
	for _, r := range riwayat {
		zScore := r.ZScoreIMTU
		status := r.StatusIMTU
		imt := math.Round(r.IMT*100) / 100

		// Recalculate jika z_score belum tersimpan
		if zScore == 0 && imt > 0 {
			std, _ := m.repository.GetStandarAntropometri(ParamIMTU, gender, float64(r.UsiaUkurBulan))
			if std != nil {
				zScore = hitungZScore(imt, std)
				status = interpretasiStatusIMTU(zScore)
			}
		}

		list = append(list, ItemIMTU{
			riwayatChartBase: riwayatChartBase{
				ID:            uint(r.ID),
				AnakID:        r.AnakID,
				TglUkur:       r.TglUkur.Format("2006-01-02"),
				UsiaUkurBulan: r.UsiaUkurBulan,
				UsiaUkurYM:    fmt.Sprintf("%d:%d", r.UsiaUkurBulan/12, r.UsiaUkurBulan%12),
				BeratBadan:    r.BeratBadan,
				TinggiBadan:   r.TinggiBadan,
			},
			IMT:        imt,
			ZScoreIMTU: zScore,
			StatusIMTU: status,
		})
	}

	standar, _ := m.repository.GetMasterStandarByFilter(ParamIMTU, genderNorm)

	return map[string]interface{}{
		"kategori":      "IMT/U",
		"deskripsi":     "Indeks Massa Tubuh menurut Umur",
		"riwayat":       list,
		"standar_imt_u": standar,
	}, nil
}

func normalizeGenderStr(gender string) string {
	v := strings.TrimSpace(strings.ToLower(gender))
	if v == "m" || v == "male" || v == "l" || strings.Contains(v, "laki") {
		return "Laki-laki"
	}
	if v == "f" || v == "female" || v == "p" || strings.Contains(v, "perem") {
		return "Perempuan"
	}
	return gender
}

func (m *Main) GetRiwayatPertumbuhan(anakID uint) ([]models.CatatanPertumbuhanResponse, error) {
	data, err := m.repository.GetRiwayatPertumbuhanByAnakID(anakID)
	if err != nil {
		return nil, customerror.NewInternalServiceError("gagal mengambil riwayat pertumbuhan")
	}

	dataAnak, err := m.repository.GetAnakByID(anakID)
	if err != nil {
		return nil, err
	}

	_, rawGender, err := extractAnakTanggalLahirDanGender(dataAnak)
	if err != nil {
		return nil, err
	}

	gender := sanitizeGender(rawGender)

	var res []models.CatatanPertumbuhanResponse
	var prev *models.CatatanPertumbuhan
	for _, val := range data {
		m.recalculateAntropometri(&val, gender)
		stdBBU, _ := m.repository.GetStandarAntropometri(ParamBBU, gender, float64(val.UsiaUkurBulan))

		statusNaik, statusBGM, kbmMinGram, kenaikanGram, statusInfo := hitungKMSStatus(val, prev, stdBBU)

		res = append(res, models.CatatanPertumbuhanResponse{
			ID:            uint(val.ID),
			AnakID:        uint(val.AnakID),
			TglUkur:       val.TglUkur.Format("2006-01-02"),
			UsiaUkurBulan: val.UsiaUkurBulan,
			UsiaUkurYM:    fmt.Sprintf("%d:%d", val.UsiaUkurBulan/12, val.UsiaUkurBulan%12),
			KurvaKMS:      getKurvaKMSLabel(val.UsiaUkurBulan),
			BeratBadan:    val.BeratBadan,
			TinggiBadan:   val.TinggiBadan,
			LingkarKepala: val.LingkarKepala,
			HasilLila:     val.HasilLila,
			IMT:           math.Round(val.IMT*100) / 100,
			StatusBBU:     val.StatusBBU,
			StatusTBU:     val.StatusTBU,
			StatusIMTU:    val.StatusIMTU,
			StatusBBTB:    val.StatusBBTB,
			StatusLKU:     val.StatusLKU,
			StatusKMSNaik: statusNaik,
			StatusKMSBGM:  statusBGM,
			KBMMinGram:    kbmMinGram,
			KenaikanGram:  kenaikanGram,
			StatusKMSInfo: statusInfo,
			CatatanNakes:  val.CatatanNakes,
		})

		cur := val
		prev = &cur
	}

	return res, nil
}

func (m *Main) GetDetailCatatanPertumbuhan(id uint) (*models.CatatanPertumbuhanResponse, error) {
	data, err := m.repository.GetCatatanPertumbuhanByID(id)
	if err != nil {
		return nil, err
	}

	dataAnak, err := m.repository.GetAnakByID(uint(data.AnakID))
	if err != nil {
		return nil, err
	}

	_, rawGender, err := extractAnakTanggalLahirDanGender(dataAnak)
	if err != nil {
		return nil, err
	}

	gender := sanitizeGender(rawGender)

	dataRiwayat, _ := m.repository.GetRiwayatPertumbuhanByAnakID(uint(data.AnakID))
	var prev *models.CatatanPertumbuhan
	for i := range dataRiwayat {
		if dataRiwayat[i].ID == data.ID {
			break
		}
		tmp := dataRiwayat[i]
		prev = &tmp
	}

	stdBBU, _ := m.repository.GetStandarAntropometri(ParamBBU, gender, float64(data.UsiaUkurBulan))
	m.recalculateAntropometri(data, gender)
	statusNaik, statusBGM, kbmMinGram, kenaikanGram, statusInfo := hitungKMSStatus(*data, prev, stdBBU)

	return &models.CatatanPertumbuhanResponse{
		ID:            uint(data.ID),
		AnakID:        uint(data.AnakID),
		TglUkur:       data.TglUkur.Format("2006-01-02"),
		UsiaUkurBulan: data.UsiaUkurBulan,
		UsiaUkurYM:    fmt.Sprintf("%d:%d", data.UsiaUkurBulan/12, data.UsiaUkurBulan%12),
		KurvaKMS:      getKurvaKMSLabel(data.UsiaUkurBulan),
		BeratBadan:    data.BeratBadan,
		TinggiBadan:   data.TinggiBadan,
		LingkarKepala: data.LingkarKepala,
		HasilLila:     data.HasilLila,
		IMT:           math.Round(data.IMT*100) / 100,
		StatusBBU:     data.StatusBBU,
		StatusTBU:     data.StatusTBU,
		StatusIMTU:    data.StatusIMTU,
		StatusBBTB:    data.StatusBBTB,
		StatusLKU:     data.StatusLKU,
		StatusKMSNaik: statusNaik,
		StatusKMSBGM:  statusBGM,
		KBMMinGram:    kbmMinGram,
		KenaikanGram:  kenaikanGram,
		StatusKMSInfo: statusInfo,
		CatatanNakes:  data.CatatanNakes,
	}, nil
}

func (m *Main) UpdateCatatanPertumbuhan(id uint, req *models.UpdatePertumbuhanRequest) error {
	data, err := m.repository.GetCatatanPertumbuhanByID(id)
	if err != nil {
		return err
	}

	dataAnak, err := m.repository.GetAnakByID(uint(data.AnakID))
	if err != nil {
		return err
	}

	if req.TglUkur != "" {
		t, parseErr := time.Parse("2006-01-02", req.TglUkur)
		if parseErr != nil {
			return customerror.NewBadRequestError("format tanggal ukur tidak valid, gunakan YYYY-MM-DD")
		}
		data.TglUkur = t
	}
	if req.BeratBadan > 0 {
		data.BeratBadan = req.BeratBadan
	}
	if req.TinggiBadan > 0 {
		data.TinggiBadan = req.TinggiBadan
	}
	if req.LingkarKepala != 0 {
		data.LingkarKepala = req.LingkarKepala
	}
	if req.HasilLila != 0 {
		data.HasilLila = req.HasilLila
	}
	if req.CatatanNakes != "" {
		data.CatatanNakes = req.CatatanNakes
	}

	rawTanggalLahir, rawGender, err := extractAnakTanggalLahirDanGender(dataAnak)
	if err != nil {
		return err
	}

	tanggalLahir, err := parseTanggalLahir(rawTanggalLahir)
	if err != nil {
		return err
	}
	gender := sanitizeGender(rawGender)

	data.UsiaUkurBulan = data.HitungUsiaBulan(tanggalLahir)
	data.IMT = data.HitungIMT()
	m.recalculateAntropometri(data, gender)

	stdIMTU, _ := m.repository.GetStandarAntropometri(ParamIMTU, gender, float64(data.UsiaUkurBulan))
	if stdIMTU != nil {
		data.ZScoreIMTU = hitungZScore(data.IMT, stdIMTU)
		data.StatusIMTU = interpretasiStatusIMTU(data.ZScoreIMTU)
	}
	if data.LingkarKepala > 0 {
		stdLKU, _ := m.repository.GetStandarAntropometri(ParamLKU, gender, float64(data.UsiaUkurBulan))
		if stdLKU != nil {
			data.ZScoreLKU = hitungZScore(data.LingkarKepala, stdLKU)
			data.StatusLKU = interpretasiStatusLKU(data.ZScoreLKU)
		}
	}

	return m.repository.UpdateCatatanPertumbuhan(data)
}

func (m *Main) DeleteCatatanPertumbuhan(id uint) error {
	return m.repository.DeleteCatatanPertumbuhan(id)
}

func (m *Main) IsAnakMilikOrangtua(userID, anakID uint) (bool, error) {
	return m.repository.IsAnakMilikOrangtua(userID, anakID)
}

func (m *Main) IsCatatanMilikOrangtua(userID, catatanID uint) (bool, error) {
	return m.repository.IsCatatanMilikOrangtua(userID, catatanID)
}