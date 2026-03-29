package usecases

import (
	"context"
	"errors"
	"fmt"
	"monitoring-service/app/helpers"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"time"

	"gorm.io/gorm"
)

type CatatanPertumbuhanUsecase struct {
	catatanRepo *repositories.CatatanPertumbuhanRepository
	standarRepo *repositories.MasterStandarRepository
	zScoreCalc  *helpers.ZScoreCalculator
}

func NewCatatanPertumbuhanUsecase(
	catatanRepo *repositories.CatatanPertumbuhanRepository,
	standarRepo *repositories.MasterStandarRepository,
) *CatatanPertumbuhanUsecase {
	return &CatatanPertumbuhanUsecase{
		catatanRepo: catatanRepo,
		standarRepo: standarRepo,
	}
}

// Request/Response DTOs
type CreateCatatanPertumbuhanRequest struct {
	AnakID        int     `json:"anak_id" validate:"required"`
	TglUkur       string  `json:"tgl_ukur" validate:"required"`
	BeratBadan    float64 `json:"berat_badan"`
	TinggiBadan   float64 `json:"tinggi_badan"`
	LingkarKepala float64 `json:"lingkar_kepala,omitempty"`
	JenisKelamin  string  `json:"jenis_kelamin" validate:"required,oneof=M F"`
	TanggalLahir  string  `json:"tanggal_lahir" validate:"required"`
	CatatanNakes  string  `json:"catatan_nakes,omitempty"`
}

type CatatanPertumbuhanResponse struct {
	ID            uint    `json:"id"`
	AnakID        int     `json:"anak_id"`
	TglUkur       string  `json:"tgl_ukur"`
	BeratBadan    float64 `json:"berat_badan"`
	TinggiBadan   float64 `json:"tinggi_badan"`
	LingkarKepala float64 `json:"lingkar_kepala,omitempty"`
	IMT           float64 `json:"imt"`
	UsiaUkurBulan int     `json:"usia_ukur_bulan"`
	StatusBBU     string  `json:"status_bb_u,omitempty"`
	StatusTBU     string  `json:"status_tb_u,omitempty"`
	StatusIMTU    string  `json:"status_imt_u,omitempty"`
	ZScoreBBU     float64 `json:"z_score_bb_u,omitempty"`
	ZScoreTBU     float64 `json:"z_score_tb_u,omitempty"`
	ZScoreIMTU    float64 `json:"z_score_imt_u,omitempty"`
	CatatanNakes  string  `json:"catatan_nakes,omitempty"`
}

func (u *CatatanPertumbuhanUsecase) Create(ctx context.Context, req *CreateCatatanPertumbuhanRequest) (*CatatanPertumbuhanResponse, error) {
	// Parse tanggal
	tglUkur, err := time.Parse("2006-01-02", req.TglUkur)
	if err != nil {
		return nil, errors.New("invalid tgl_ukur format, use YYYY-MM-DD")
	}

	tanggalLahir, err := time.Parse("2006-01-02", req.TanggalLahir)
	if err != nil {
		return nil, errors.New("invalid tanggal_lahir format, use YYYY-MM-DD")
	}

	// Load semua standar untuk perhitungan
	standards, err := u.standarRepo.FindAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to load standards: %w", err)
	}
	zScoreCalc := helpers.NewZScoreCalculator(standards)

	// Hitung usia
	usiaBulan := u.hitungUsiaBulan(tanggalLahir, tglUkur)

	// Hitung IMT
	imt := u.hitungIMT(req.BeratBadan, req.TinggiBadan)

	// Hitung Z-Score dan status
	zScoreBBU, statusBBU := u.hitungZScoreBBU(zScoreCalc, req.JenisKelamin, float64(usiaBulan), req.BeratBadan)
	zScoreTBU, statusTBU := u.hitungZScoreTBU(zScoreCalc, req.JenisKelamin, float64(usiaBulan), req.TinggiBadan)
	zScoreIMTU, statusIMTU := u.hitungZScoreIMTU(zScoreCalc, req.JenisKelamin, float64(usiaBulan), imt)

	catatan := &models.CatatanPertumbuhan{
		AnakID:        req.AnakID,
		TglUkur:       tglUkur,
		BeratBadan:    req.BeratBadan,
		TinggiBadan:   req.TinggiBadan,
		LingkarKepala: req.LingkarKepala,
		IMT:           imt,
		JenisKelamin:  models.GenderType(req.JenisKelamin),
		TanggalLahir:  tanggalLahir,
		StatusBBU:     statusBBU,
		StatusTBU:     statusTBU,
		StatusIMTU:    statusIMTU,
		ZScoreBBU:     zScoreBBU,
		ZScoreTBU:     zScoreTBU,
		ZScoreIMTU:    zScoreIMTU,
		CatatanNakes:  req.CatatanNakes,
		CreatedAt:     time.Now(),
	}

	if err := u.catatanRepo.Create(ctx, catatan); err != nil {
		return nil, fmt.Errorf("failed to create catatan: %w", err)
	}

	return &CatatanPertumbuhanResponse{
		ID:            catatan.ID,
		AnakID:        catatan.AnakID,
		TglUkur:       catatan.TglUkur.Format("2006-01-02"),
		BeratBadan:    catatan.BeratBadan,
		TinggiBadan:   catatan.TinggiBadan,
		LingkarKepala: catatan.LingkarKepala,
		IMT:           catatan.IMT,
		UsiaUkurBulan: usiaBulan,
		StatusBBU:     catatan.StatusBBU,
		StatusTBU:     catatan.StatusTBU,
		StatusIMTU:    catatan.StatusIMTU,
		ZScoreBBU:     catatan.ZScoreBBU,
		ZScoreTBU:     catatan.ZScoreTBU,
		ZScoreIMTU:    catatan.ZScoreIMTU,
		CatatanNakes:  catatan.CatatanNakes,
	}, nil
}

func (u *CatatanPertumbuhanUsecase) GetByAnakID(ctx context.Context, anakID int, page, pageSize int) ([]CatatanPertumbuhanResponse, *models.Pagination, error) {
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 10
	}

	catatanList, total, err := u.catatanRepo.FindByAnakID(ctx, anakID, page, pageSize)
	if err != nil {
		return nil, nil, err
	}

	responses := make([]CatatanPertumbuhanResponse, len(catatanList))
	for i, catatan := range catatanList {
		responses[i] = CatatanPertumbuhanResponse{
			ID:            catatan.ID,
			AnakID:        catatan.AnakID,
			TglUkur:       catatan.TglUkur.Format("2006-01-02"),
			BeratBadan:    catatan.BeratBadan,
			TinggiBadan:   catatan.TinggiBadan,
			LingkarKepala: catatan.LingkarKepala,
			IMT:           catatan.IMT,
			UsiaUkurBulan: catatan.HitungUsiaBulan(),
			StatusBBU:     catatan.StatusBBU,
			StatusTBU:     catatan.StatusTBU,
			StatusIMTU:    catatan.StatusIMTU,
			ZScoreBBU:     catatan.ZScoreBBU,
			ZScoreTBU:     catatan.ZScoreTBU,
			ZScoreIMTU:    catatan.ZScoreIMTU,
			CatatanNakes:  catatan.CatatanNakes,
		}
	}

	totalPage := int(total) / pageSize
	if int(total)%pageSize != 0 {
		totalPage++
	}

	pagination := &models.Pagination{
		Page:      page,
		PageSize:  pageSize,
		Total:     int(total),
		TotalPage: totalPage,
	}

	return responses, pagination, nil
}

func (u *CatatanPertumbuhanUsecase) GetLatestByAnakID(ctx context.Context, anakID int) (*CatatanPertumbuhanResponse, error) {
	catatan, err := u.catatanRepo.FindLatestByAnakID(ctx, anakID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("no growth record found")
		}
		return nil, err
	}

	return &CatatanPertumbuhanResponse{
		ID:            catatan.ID,
		AnakID:        catatan.AnakID,
		TglUkur:       catatan.TglUkur.Format("2006-01-02"),
		BeratBadan:    catatan.BeratBadan,
		TinggiBadan:   catatan.TinggiBadan,
		LingkarKepala: catatan.LingkarKepala,
		IMT:           catatan.IMT,
		UsiaUkurBulan: catatan.HitungUsiaBulan(),
		StatusBBU:     catatan.StatusBBU,
		StatusTBU:     catatan.StatusTBU,
		StatusIMTU:    catatan.StatusIMTU,
		ZScoreBBU:     catatan.ZScoreBBU,
		ZScoreTBU:     catatan.ZScoreTBU,
		ZScoreIMTU:    catatan.ZScoreIMTU,
		CatatanNakes:  catatan.CatatanNakes,
	}, nil
}

// Helper functions
func (u *CatatanPertumbuhanUsecase) hitungUsiaBulan(tanggalLahir, tglUkur time.Time) int {
	if tanggalLahir.After(tglUkur) {
		return 0
	}
	years := tglUkur.Year() - tanggalLahir.Year()
	months := int(tglUkur.Month() - tanggalLahir.Month())
	if months < 0 {
		years--
		months += 12
	}
	return years*12 + months
}

func (u *CatatanPertumbuhanUsecase) hitungIMT(berat, tinggi float64) float64 {
	if tinggi <= 0 {
		return 0
	}
	tinggiMeter := tinggi / 100
	return berat / (tinggiMeter * tinggiMeter)
}

func (u *CatatanPertumbuhanUsecase) hitungZScoreBBU(calc *helpers.ZScoreCalculator, jenisKelamin string, usiaBulan float64, berat float64) (float64, string) {
	standard := calc.FindStandard(string(models.ParameterBBU), models.GenderType(jenisKelamin), usiaBulan)
	if standard == nil {
		return 0, ""
	}
	zScore := calc.CalculateZScore(standard, berat)
	status := helpers.GetStatusBBU(zScore)
	return zScore, status
}

func (u *CatatanPertumbuhanUsecase) hitungZScoreTBU(calc *helpers.ZScoreCalculator, jenisKelamin string, usiaBulan float64, tinggi float64) (float64, string) {
	standard := calc.FindStandard(string(models.ParameterTBU), models.GenderType(jenisKelamin), usiaBulan)
	if standard == nil {
		return 0, ""
	}
	zScore := calc.CalculateZScore(standard, tinggi)
	status := helpers.GetStatusTBU(zScore)
	return zScore, status
}

func (u *CatatanPertumbuhanUsecase) hitungZScoreIMTU(calc *helpers.ZScoreCalculator, jenisKelamin string, usiaBulan float64, imt float64) (float64, string) {
	standard := calc.FindStandard(string(models.ParameterIMTU), models.GenderType(jenisKelamin), usiaBulan)
	if standard == nil {
		return 0, ""
	}
	zScore := calc.CalculateZScore(standard, imt)
	status := string(helpers.GetStatusGizi(zScore))
	return zScore, status
}
