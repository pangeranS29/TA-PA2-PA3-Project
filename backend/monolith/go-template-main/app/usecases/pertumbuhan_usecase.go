package usecases

import (
	"fmt"
	"math"
	"time"

	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

const (
	ParamBBU  = "bb_u"
	ParamTBU  = "tb_u"
	ParamIMTU = "imt_u"
	ParamBBTB = "bb_tb"
	ParamLKU  = "lk_u"
)

type PertumbuhanUseCase interface {
	AddCatatanPertumbuhan(req *models.CreatePertumbuhanRequest) error
	GetRiwayatPertumbuhan(anakID int32) ([]models.CatatanPertumbuhanResponse, error)
	GetDetailCatatanPertumbuhan(id int32) (*models.CatatanPertumbuhanResponse, error)
	UpdateCatatanPertumbuhan(id int32, req *models.UpdatePertumbuhanRequest) error
	DeleteCatatanPertumbuhan(id int32) error
	GetChartData(anakID int32) (*models.PertumbuhanChartResponse, error)
}

type pertumbuhanUseCase struct {
	repo *repositories.Main
}

func NewPertumbuhanUseCase(repo *repositories.Main) PertumbuhanUseCase {
	return &pertumbuhanUseCase{repo: repo}
}

// Helper untuk menghitung Z-Score berdasarkan data Master Standar
func hitungZScore(aktual float64, standar *models.MasterStandarAntropometri) float64 {
	if standar == nil || standar.Median == 0 {
		return 0
	}

	var sd float64
	if aktual < standar.Median {
		// Gunakan jarak Median ke -1 SD
		sd = standar.Median - standar.SD1Neg
	} else {
		// Gunakan jarak +1 SD ke Median
		sd = standar.SD1Pos - standar.Median
	}

	if sd == 0 {
		return 0
	}

	zScore := (aktual - standar.Median) / sd
	return math.Round(zScore*100) / 100
}

func (u *pertumbuhanUseCase) AddCatatanPertumbuhan(req *models.CreatePertumbuhanRequest) error {
	dataAnak, err := u.repo.Anak.FindByID(int32(req.AnakID))
	if err != nil {
		return err
	}

	tglUkur, _ := time.Parse("2006-01-02", req.TglUkur)
	
	catatan := &models.CatatanPertumbuhan{
		AnakID:        int32(req.AnakID),
		TglUkur:       tglUkur,
		BeratBadan:    req.BeratBadan,
		TinggiBadan:   req.TinggiBadan,
		LingkarKepala: req.LingkarKepala,
		CatatanNakes:  req.CatatanNakes,
	}

	var tglLahir time.Time
	var gender string
	if dataAnak.Penduduk != nil {
		tglLahir = dataAnak.Penduduk.TanggalLahir
		gender = dataAnak.Penduduk.JenisKelamin
	}

	catatan.UsiaUkurBulan = catatan.HitungUsiaBulan(tglLahir)
	catatan.IMT = catatan.HitungIMT()

	// Hitung Z-Scores dan Status
	u.calculateAllStatuses(catatan, gender)

	return u.repo.CreateCatatanPertumbuhan(catatan)
}

func (u *pertumbuhanUseCase) GetRiwayatPertumbuhan(anakID int32) ([]models.CatatanPertumbuhanResponse, error) {
	dataAnak, err := u.repo.Anak.FindByID(anakID)
	if err != nil {
		return nil, err
	}

	gender := ""
	if dataAnak.Penduduk != nil {
		gender = dataAnak.Penduduk.JenisKelamin
	}

	data, err := u.repo.GetRiwayatPertumbuhanByAnakID(uint(anakID))
	if err != nil {
		return nil, err
	}

	var res []models.CatatanPertumbuhanResponse
	for _, val := range data {
		// Re-calculate on the fly if status is missing
		if val.StatusBBU == "" {
			u.calculateAllStatuses(&val, gender)
		}

		response := models.CatatanPertumbuhanResponse{
			ID:            val.ID,
			AnakID:        val.AnakID,
			TglUkur:       val.TglUkur.Format("2006-01-02"),
			UsiaUkurBulan: val.UsiaUkurBulan,
			UsiaUkurYM:    fmt.Sprintf("%d:%d", val.UsiaUkurBulan/12, val.UsiaUkurBulan%12),
			KurvaKMS:      u.getKurvaKMSLabel(val.UsiaUkurBulan),
			BeratBadan:    val.BeratBadan,
			TinggiBadan:   val.TinggiBadan,
			LingkarKepala: val.LingkarKepala,
			IMT:           math.Round(val.IMT*100) / 100,
			StatusBBU:     val.StatusBBU,
			StatusTBU:     val.StatusTBU,
			StatusIMTU:    val.StatusIMTU,
			StatusBBTB:    val.StatusBBTB,
			StatusLKU:     val.StatusLKU,
			CatatanNakes:  val.CatatanNakes,
		}

		// Tambahkan Ideal Range
		u.enrichWithIdealRanges(&response, gender)

		res = append(res, response)
	}
	return res, nil
}

func (u *pertumbuhanUseCase) GetDetailCatatanPertumbuhan(id int32) (*models.CatatanPertumbuhanResponse, error) {
	val, err := u.repo.GetCatatanPertumbuhanByID(uint(id))
	if err != nil {
		return nil, err
	}

	dataAnak, _ := u.repo.Anak.FindByID(val.AnakID)
	gender := ""
	if dataAnak != nil && dataAnak.Penduduk != nil {
		gender = dataAnak.Penduduk.JenisKelamin
	}

	response := &models.CatatanPertumbuhanResponse{
		ID:            val.ID,
		AnakID:        val.AnakID,
		TglUkur:       val.TglUkur.Format("2006-01-02"),
		UsiaUkurBulan: val.UsiaUkurBulan,
		UsiaUkurYM:    fmt.Sprintf("%d:%d", val.UsiaUkurBulan/12, val.UsiaUkurBulan%12),
		KurvaKMS:      u.getKurvaKMSLabel(val.UsiaUkurBulan),
		BeratBadan:    val.BeratBadan,
		TinggiBadan:   val.TinggiBadan,
		LingkarKepala: val.LingkarKepala,
		IMT:           math.Round(val.IMT*100) / 100,
		StatusBBU:     val.StatusBBU,
		StatusTBU:     val.StatusTBU,
		StatusIMTU:    val.StatusIMTU,
		StatusBBTB:    val.StatusBBTB,
		StatusLKU:     val.StatusLKU,
		CatatanNakes:  val.CatatanNakes,
	}

	u.enrichWithIdealRanges(response, gender)

	return response, nil
}

func (u *pertumbuhanUseCase) UpdateCatatanPertumbuhan(id int32, req *models.UpdatePertumbuhanRequest) error {
	data, err := u.repo.GetCatatanPertumbuhanByID(uint(id))
	if err != nil {
		return err
	}

	dataAnak, _ := u.repo.Anak.FindByID(data.AnakID)
	gender := ""
	if dataAnak != nil && dataAnak.Penduduk != nil {
		gender = dataAnak.Penduduk.JenisKelamin
	}

	if req.TglUkur != "" {
		t, _ := time.Parse("2006-01-02", req.TglUkur)
		data.TglUkur = t
	}
	if req.BeratBadan > 0 {
		data.BeratBadan = req.BeratBadan
	}
	if req.TinggiBadan > 0 {
		data.TinggiBadan = req.TinggiBadan
	}
	if req.LingkarKepala > 0 {
		data.LingkarKepala = req.LingkarKepala
	}
	if req.CatatanNakes != "" {
		data.CatatanNakes = req.CatatanNakes
	}

	// Re-calculate statuses
	u.calculateAllStatuses(data, gender)

	return u.repo.UpdateCatatanPertumbuhan(data)
}

func (u *pertumbuhanUseCase) calculateAllStatuses(c *models.CatatanPertumbuhan, gender string) {
	// BB/U
	if std, err := u.repo.GetStandarAntropometri(ParamBBU, gender, float64(c.UsiaUkurBulan)); err == nil {
		c.ZScoreBBU = hitungZScore(c.BeratBadan, std)
		c.StatusBBU = u.interpretasiBBU(c.ZScoreBBU)
	} else {
		c.StatusBBU = "Data Standar Tidak Tersedia"
	}

	// TB/U
	if std, err := u.repo.GetStandarAntropometri(ParamTBU, gender, float64(c.UsiaUkurBulan)); err == nil {
		c.ZScoreTBU = hitungZScore(c.TinggiBadan, std)
		c.StatusTBU = u.interpretasiTBU(c.ZScoreTBU)
	} else {
		c.StatusTBU = "Data Standar Tidak Tersedia"
	}

	// IMT/U
	if std, err := u.repo.GetStandarAntropometri(ParamIMTU, gender, float64(c.UsiaUkurBulan)); err == nil {
		c.ZScoreIMTU = hitungZScore(c.IMT, std)
		c.StatusIMTU = u.interpretasiIMT(c.ZScoreIMTU)
	} else {
		c.StatusIMTU = "Data Standar Tidak Tersedia"
	}

	// BB/TB
	if std, err := u.repo.GetStandarAntropometri(ParamBBTB, gender, c.TinggiBadan); err == nil {
		c.ZScoreBBTB = hitungZScore(c.BeratBadan, std)
		c.StatusBBTB = u.interpretasiBBTB(c.ZScoreBBTB)
	} else {
		c.StatusBBTB = "Data Standar Tidak Tersedia"
	}

	// LK/U
	if std, err := u.repo.GetStandarAntropometri(ParamLKU, gender, float64(c.UsiaUkurBulan)); err == nil {
		c.ZScoreLKU = hitungZScore(c.LingkarKepala, std)
		c.StatusLKU = u.interpretasiLKU(c.ZScoreLKU)
	} else {
		c.StatusLKU = "Data Standar Tidak Tersedia"
	}
}

func (u *pertumbuhanUseCase) enrichWithIdealRanges(res *models.CatatanPertumbuhanResponse, gender string) {
	// Ideal BB (BBU)
	if std, err := u.repo.GetStandarAntropometri(ParamBBU, gender, float64(res.UsiaUkurBulan)); err == nil {
		res.IdealBeratMin = std.SD2Neg
		res.IdealBeratMax = std.SD1Pos
	}
	// Ideal TB (TBU)
	if std, err := u.repo.GetStandarAntropometri(ParamTBU, gender, float64(res.UsiaUkurBulan)); err == nil {
		res.IdealTinggiMin = std.SD2Neg
		res.IdealTinggiMax = std.SD1Pos
	}
}

// Permenkes 2/2020 Interpretation Logic
func (u *pertumbuhanUseCase) interpretasiBBU(z float64) string {
	if z < -3 {
		return "Sangat Kurang"
	} else if z < -2 {
		return "Kurang"
	} else if z <= 1 {
		return "Berat Badan Normal"
	}
	return "Risiko Berat Badan Lebih"
}

func (u *pertumbuhanUseCase) interpretasiTBU(z float64) string {
	if z < -3 {
		return "Sangat Pendek"
	} else if z < -2 {
		return "Pendek"
	} else if z <= 3 {
		return "Normal"
	}
	return "Tinggi"
}

func (u *pertumbuhanUseCase) interpretasiBBTB(z float64) string {
	if z < -3 {
		return "Gizi Buruk"
	} else if z < -2 {
		return "Gizi Kurang"
	} else if z <= 1 {
		return "Gizi Baik"
	} else if z <= 2 {
		return "Berisiko Gizi Lebih"
	} else if z <= 3 {
		return "Gizi Lebih"
	}
	return "Obesitas"
}

func (u *pertumbuhanUseCase) interpretasiIMT(z float64) string {
	return u.interpretasiBBTB(z) // Logicnya sama dengan BB/TB
}

func (u *pertumbuhanUseCase) interpretasiLKU(z float64) string {
	if z < -2 {
		return "Mikrosefali"
	} else if z <= 2 {
		return "Normal"
	}
	return "Makrosefali"
}

func (u *pertumbuhanUseCase) GetChartData(anakID int32) (*models.PertumbuhanChartResponse, error) {
	dataAnak, err := u.repo.Anak.FindByID(anakID)
	if err != nil {
		return nil, err
	}

	gender := ""
	namaAnak := ""
	if dataAnak.Penduduk != nil {
		gender = dataAnak.Penduduk.JenisKelamin
		namaAnak = dataAnak.Penduduk.NamaLengkap
	}

	// 1. Get Riwayat
	riwayat, err := u.GetRiwayatPertumbuhan(anakID)
	if err != nil {
		return nil, err
	}

	// 2. Get Standar BBU (0-60 months)
	stdBBU, _ := u.repo.GetMasterStandarByFilter(ParamBBU, gender)
	var resBBU []models.MasterStandarResponse
	for _, s := range stdBBU {
		resBBU = append(resBBU, models.MasterStandarResponse{
			ID:          s.ID,
			NilaiSumbuX: s.NilaiSumbuX,
			SD3Neg:      s.SD3Neg,
			SD2Neg:      s.SD2Neg,
			SD1Neg:      s.SD1Neg,
			Median:      s.Median,
			SD1Pos:      s.SD1Pos,
			SD2Pos:      s.SD2Pos,
			SD3Pos:      s.SD3Pos,
		})
	}

	// 3. Get Standar TBU
	stdTBU, _ := u.repo.GetMasterStandarByFilter(ParamTBU, gender)
	var resTBU []models.MasterStandarResponse
	for _, s := range stdTBU {
		resTBU = append(resTBU, models.MasterStandarResponse{
			ID:          s.ID,
			NilaiSumbuX: s.NilaiSumbuX,
			SD3Neg:      s.SD3Neg,
			SD2Neg:      s.SD2Neg,
			SD1Neg:      s.SD1Neg,
			Median:      s.Median,
			SD1Pos:      s.SD1Pos,
			SD2Pos:      s.SD2Pos,
			SD3Pos:      s.SD3Pos,
		})
	}

	return &models.PertumbuhanChartResponse{
		AnakID:       anakID,
		NamaAnak:     namaAnak,
		JenisKelamin: gender,
		Riwayat:      riwayat,
		StandarBBU:   resBBU,
		StandarTBU:   resTBU,
	}, nil
}

func (u *pertumbuhanUseCase) DeleteCatatanPertumbuhan(id int32) error {
	return u.repo.DeleteCatatanPertumbuhan(uint(id))
}

func (u *pertumbuhanUseCase) getKurvaKMSLabel(usiaBulan int) string {
	if usiaBulan <= 24 {
		return "0-2 Tahun"
	}
	return "2-5 Tahun"
}
