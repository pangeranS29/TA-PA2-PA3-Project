package usecases

import (
	"errors"
	"fmt"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type GrafikEvaluasiKehamilanUsecase interface {
	Create(g *models.GrafikEvaluasiKehamilan) error
	GetByID(id int32) (*models.GrafikEvaluasiKehamilan, error)
	GetByKehamilanID(kehamilanID int32) ([]models.GrafikEvaluasiKehamilan, error)
	Update(g *models.GrafikEvaluasiKehamilan) error
	Delete(id int32) error
	GetGrafik(kehamilanID int32) (*GrafikResponse, error)
}
type GrafikTFUPoint struct {
	Usia   int     `json:"usia"`
	TFU    float64 `json:"tfu"`
	Normal float64 `json:"normal"`
	Upper  float64 `json:"upper"`
	Lower  float64 `json:"lower"`
}
type GrafikDJJPoint struct {
	Usia   int `json:"usia"`
	DJJ    int `json:"djj"`
	Upper  int `json:"upper"`
	Lower  int `json:"lower"`
}
type GrafikResponse struct {
	GrafikTFU []GrafikTFUPoint `json:"grafik_tfu"`
	GrafikDJJ []GrafikDJJPoint `json:"grafik_djj"`
}
type grafikEvaluasiKehamilanUsecase struct {
	repo *repositories.GrafikEvaluasiKehamilanRepository
}

func NewGrafikEvaluasiKehamilanUsecase(repo *repositories.GrafikEvaluasiKehamilanRepository) GrafikEvaluasiKehamilanUsecase {
	return &grafikEvaluasiKehamilanUsecase{repo: repo}
}

func (u *grafikEvaluasiKehamilanUsecase) Create(g *models.GrafikEvaluasiKehamilan) error {
	if g.KehamilanID == 0 {
		return errors.New("kehamilan_id wajib diisi")
	}

	history, err := u.repo.FindByKehamilanID(g.KehamilanID)
	if err != nil {
		return err
	}

	penjelasan, risk := GeneratePenjelasanSingle(g, history)

	fmt.Println("=== DEBUG ===")
fmt.Println("Penjelasan:", penjelasan)
fmt.Println("Risk:", risk)
fmt.Println("================")


	g.PenjelasanHasilGrafik = &penjelasan
	g.KategoriRisiko = &risk

	return u.repo.Create(g)
}

func (u *grafikEvaluasiKehamilanUsecase) GetByID(id int32) (*models.GrafikEvaluasiKehamilan, error) {
	return u.repo.FindByID(id)
}

func (u *grafikEvaluasiKehamilanUsecase) GetByKehamilanID(kehamilanID int32) ([]models.GrafikEvaluasiKehamilan, error) {
	return u.repo.FindByKehamilanID(kehamilanID)
}

func (u *grafikEvaluasiKehamilanUsecase) Update(g *models.GrafikEvaluasiKehamilan) error {
	_, err := u.repo.FindByID(g.ID)
	if err != nil {
		return errors.New("data grafik evaluasi kehamilan tidak ditemukan")
	}
	return u.repo.Update(g)
}

func (u *grafikEvaluasiKehamilanUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
func (u *grafikEvaluasiKehamilanUsecase) GetGrafik(kehamilanID int32) (*GrafikResponse, error) {

	// =========================
	// TFU (pakai repository khusus)
	// =========================
	tfuData, err := u.repo.FindGrafikTFU(kehamilanID)
	if err != nil {
		return nil, err
	}

	var tfuResult []GrafikTFUPoint

	for _, d := range tfuData {
		if d.UsiaGestasiMinggu != nil && d.TinggiFundusUteriCm != nil {

			usia := *d.UsiaGestasiMinggu
			tfu := *d.TinggiFundusUteriCm

			tfuResult = append(tfuResult, GrafikTFUPoint{
				Usia:   usia,
				TFU:    tfu,
				Normal: float64(usia),
				Upper:  float64(usia) + 2,
				Lower:  float64(usia) - 2,
			})
		}
	}

	// =========================
	// DJJ (pakai repository khusus)
	// =========================
	djjData, err := u.repo.FindGrafikDJJ(kehamilanID)
	if err != nil {
		return nil, err
	}

	var djjResult []GrafikDJJPoint

	for _, d := range djjData {
		if d.UsiaGestasiMinggu != nil && d.DenyutJantungBayiXMenit != nil {

			usia := *d.UsiaGestasiMinggu
			djj := *d.DenyutJantungBayiXMenit

			djjResult = append(djjResult, GrafikDJJPoint{
				Usia:  usia,
				DJJ:   djj,
				Upper: 160,
				Lower: 110,
			})
		}
	}

	return &GrafikResponse{
		GrafikTFU: tfuResult,
		GrafikDJJ: djjResult,
	}, nil
}