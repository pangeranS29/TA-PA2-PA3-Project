package usecases

import (
	"errors"
	"log"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"strings"
)

type PemeriksaanKehamilanUsecase interface {
	Create(p *models.PemeriksaanKehamilan) error
	GetByID(id int32) (*models.PemeriksaanKehamilan, error)
	GetByKehamilanID(kehamilanID int32) ([]models.PemeriksaanKehamilan, error)
	Update(p *models.PemeriksaanKehamilan) error
	Delete(id int32) error
	GetGrafikANC(kehamilanID int32) (*GrafikANCResponse, error)
}

type pemeriksaanKehamilanUsecase struct {
	repo          *repositories.PemeriksaanKehamilanRepository
	kehamilanrepo *repositories.KehamilanRepository
}

func NewPemeriksaanKehamilanUsecase(repo *repositories.PemeriksaanKehamilanRepository, kehamilanrepo *repositories.KehamilanRepository) PemeriksaanKehamilanUsecase {
	return &pemeriksaanKehamilanUsecase{repo: repo, kehamilanrepo: kehamilanrepo}
}

// ================= BASIC CRUD =================

func (u *pemeriksaanKehamilanUsecase) Create(p *models.PemeriksaanKehamilan) error {
	if err := u.validate(p); err != nil {
		return err
	}

	u.calculateANC(p)
	return u.repo.Create(p)
}

func (u *pemeriksaanKehamilanUsecase) GetByID(id int32) (*models.PemeriksaanKehamilan, error) {
	return u.repo.FindByID(id)
}

func (u *pemeriksaanKehamilanUsecase) GetByKehamilanID(kehamilanID int32) ([]models.PemeriksaanKehamilan, error) {
	return u.repo.FindByKehamilanID(kehamilanID)
}

func (u *pemeriksaanKehamilanUsecase) Update(p *models.PemeriksaanKehamilan) error {
	_, err := u.repo.FindByID(p.IDPeriksa)
	if err != nil {
		return errors.New("data pemeriksaan kehamilan tidak ditemukan")
	}

	if err := u.validate(p); err != nil {
		return err
	}

	u.calculateANC(p)
	return u.repo.Update(p)
}

func (u *pemeriksaanKehamilanUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}

// ================= VALIDASI =================

func (u *pemeriksaanKehamilanUsecase) validate(p *models.PemeriksaanKehamilan) error {
	if p.KehamilanID == 0 {
		return errors.New("kehamilan_id wajib diisi")
	}

	if p.MingguKehamilan <= 0 {
		return errors.New("minggu kehamilan tidak valid")
	}

	return nil
}

// ================= ANC SCORING =================

func (u *pemeriksaanKehamilanUsecase) calculateANC(p *models.PemeriksaanKehamilan) {

	score := 0
	isEmergency := false
	var alasan []string

	// ================= TRIMESTER =================
	if p.MingguKehamilan <= 12 {
		p.Trimester = "I"
	} else if p.MingguKehamilan <= 27 {
		p.Trimester = "II"
	} else {
		p.Trimester = "III"
	}

	// ================= ANTROPOMETRI =================
	if p.LingkarLenganAtas != nil && *p.LingkarLenganAtas < 23.5 {
		score += 2
		alasan = append(alasan, "LiLA rendah")
	}

	if p.TinggiBadan != nil && *p.TinggiBadan < 145 {
		score += 2
		alasan = append(alasan, "Tinggi badan rendah")
	}

	// ================= TEKANAN DARAH =================
	if p.Sistole >= 160 || p.Diastole >= 110 {
		isEmergency = true
		alasan = append(alasan, "Hipertensi berat")
	} else if p.Sistole >= 140 || p.Diastole >= 90 {
		score += 8
		alasan = append(alasan, "Hipertensi")
	}

	// ================= HB =================
	if p.TesLabHb != nil {
		hb := *p.TesLabHb
		if hb < 8 {
			isEmergency = true
			alasan = append(alasan, "Anemia berat")
		} else if hb < 11 {
			score += 4
			alasan = append(alasan, "Anemia sedang")
		}
	}

	// ================= PROTEIN URINE =================
	if strings.TrimSpace(strings.ToLower(p.TesLabProteinUrine)) == "positif" {
		isEmergency = true
		alasan = append(alasan, "Protein urine positif")
	}

	// ================= DJJ =================
	if p.DenyutJantungJanin > 0 {
		if p.DenyutJantungJanin < 120 || p.DenyutJantungJanin > 160 {
			isEmergency = true
			alasan = append(alasan, "DJJ tidak normal")
		}
	}

	// ================= TFU =================
	if p.TinggiRahim != nil {
		expected := float64(p.MingguKehamilan)
		if *p.TinggiRahim < expected-3 || *p.TinggiRahim > expected+3 {
			score += 4
			alasan = append(alasan, "TFU tidak sesuai usia kehamilan")
		}
	}

	// ================= GULA DARAH =================
	if p.TesLabGulaDarah != nil && *p.TesLabGulaDarah > 140 {
		score += 4
		alasan = append(alasan, "Gula darah tinggi")
	}

	// ================= USG =================
	usg := strings.ToLower(p.USG)
	if usg == "sungsang" || usg == "lintang" {
		score += 4
		alasan = append(alasan, "Posisi janin tidak normal")
	}

	// ================= TRIPEL ELIMINASI =================
	if strings.ToLower(strings.TrimSpace(p.TripelEliminasi)) == "reaktif" {
		isEmergency = true
		alasan = append(alasan, "Infeksi terdeteksi")
	}

	log.Println("DEBUG SCORE:", score)
	log.Println("DEBUG EMERGENCY:", isEmergency)
	log.Println("DEBUG ALASAN:", alasan)

	status := u.determineStatus(score, isEmergency)

	p.SkorRisiko = int32(score)
	p.StatusRisiko = status
	p.DetailRisiko = u.generateExplanation(status, isEmergency, alasan)
}

// ================= STATUS =================

func (u *pemeriksaanKehamilanUsecase) determineStatus(score int, emergency bool) string {
	if emergency || score >= 12 {
		return "Resiko Tinggi"
	} else if score >= 6 {
		return "Resiko Sedang"
	}
	return "Resiko Rendah"
}

func (u *pemeriksaanKehamilanUsecase) generateExplanation(status string, emergency bool, alasan []string) string {

	var penjelasan []string

	if emergency {
		penjelasan = append(penjelasan, "Kondisi gawat darurat terdeteksi.")
	}

	for _, a := range alasan {
		switch a {
		case "LiLA rendah":
			penjelasan = append(penjelasan, "Status gizi ibu kurang.")
		case "Tinggi badan rendah":
			penjelasan = append(penjelasan, "Risiko persalinan meningkat.")
		case "Hipertensi":
			penjelasan = append(penjelasan, "Tekanan darah tinggi.")
		case "Hipertensi berat":
			penjelasan = append(penjelasan, "Hipertensi berat dan berbahaya.")
		case "Anemia sedang":
			penjelasan = append(penjelasan, "Anemia sedang.")
		case "Anemia berat":
			penjelasan = append(penjelasan, "Anemia berat membutuhkan tindakan segera.")
		case "Protein urine positif":
			penjelasan = append(penjelasan, "Indikasi preeklamsia.")
		case "DJJ tidak normal":
			penjelasan = append(penjelasan, "Detak jantung janin tidak normal.")
		case "TFU tidak sesuai usia kehamilan":
			penjelasan = append(penjelasan, "Pertumbuhan janin tidak sesuai usia.")
		case "Gula darah tinggi":
			penjelasan = append(penjelasan, "Risiko diabetes gestasional.")
		case "Infeksi terdeteksi":
			penjelasan = append(penjelasan, "Infeksi terdeteksi.")
		case "Posisi janin tidak normal":
			penjelasan = append(penjelasan, "Posisi janin tidak ideal.")
		}
	}

	kesimpulan := "Risiko rendah, lanjutkan kontrol rutin."
	if emergency || status == "Resiko Tinggi" {
		kesimpulan = "Risiko tinggi, segera rujuk."
	} else if status == "Resiko Sedang" {
		kesimpulan = "Risiko sedang, perlu pemantauan."
	}

	if len(penjelasan) == 0 {
		return "Kondisi normal. " + kesimpulan
	}

	return strings.Join(penjelasan, " ") + " " + kesimpulan
}

// ================= GRAFIK =================

type GrafikPoint struct {
	Minggu int32   `json:"minggu"`
	Value  float64 `json:"value"`
}

type GrafikTDPoint struct {
	Minggu   int32 `json:"minggu"`
	Sistole  int32 `json:"sistole"`
	Diastole int32 `json:"diastole"`
}

type DetailRisikoDTO struct {
	SkorRisiko   int32  `json:"skor_risiko"`
	StatusRisiko string `json:"status_risiko"`
	Ringkasan    string `json:"ringkasan"`
}

type GrafikBeratBadan struct {
	Minggu int32   `json:"minggu"`
	Berat  float64 `json:"berat"`
}
type GrafikANCResponse struct {
	KehamilanID  int32              `json:"kehamilan_id"`
	DetailRisiko DetailRisikoDTO    `json:"detail_risiko"`
	GrafikDJJ    []GrafikPoint      `json:"grafik_djj"`
	GrafikTFU    []GrafikPoint      `json:"grafik_tfu"`
	GrafikTD     []GrafikTDPoint    `json:"grafik_tekanan_darah"`
	GrafikIMT    []GrafikBeratBadan `json:"grafik_berat_badan"`

	IMT_Awal    float64 `json:"imt_awal"`
	KategoriIMT string  `json:"kategori_imt"`
}

// ================= GRAFIK FUNCTION =================
func KategoriIMT(imt float64) string {
	switch {
	case imt < 18.5:
		return "KEK (Kurang)"
	case imt < 25:
		return "Normal"
	case imt < 30:
		return "Overweight"
	default:
		return "Obesitas"
	}
}
func (u *pemeriksaanKehamilanUsecase) GetGrafikANC(kehamilanID int32) (*GrafikANCResponse, error) {

	// =====================
	// AMBIL KEHAMILAN
	// =====================
	kehamilan, err := u.kehamilanrepo.FindByID(kehamilanID)
	if err != nil {
		return nil, err
	}

	imt := kehamilan.IMT_Awal
	kategoriIMT := KategoriIMT(imt)

	// =====================
	// AMBIL DATA ANC
	// =====================
	data, err := u.repo.FindByKehamilanID(kehamilanID)
	if err != nil {
		return nil, err
	}

	resp := &GrafikANCResponse{
		KehamilanID: kehamilanID,
		IMT_Awal:    imt,
		KategoriIMT: kategoriIMT,
	}

	if len(data) == 0 {
		return resp, nil
	}

	var latest models.PemeriksaanKehamilan

	for _, d := range data {

		if d.MingguKehamilan >= latest.MingguKehamilan {
			latest = d
		}

		if d.DenyutJantungJanin > 0 {
			resp.GrafikDJJ = append(resp.GrafikDJJ, GrafikPoint{
				Minggu: d.MingguKehamilan,
				Value:  float64(d.DenyutJantungJanin),
			})
		}

		if d.TinggiRahim != nil {
			resp.GrafikTFU = append(resp.GrafikTFU, GrafikPoint{
				Minggu: d.MingguKehamilan,
				Value:  *d.TinggiRahim,
			})
		}

		resp.GrafikTD = append(resp.GrafikTD, GrafikTDPoint{
			Minggu:   d.MingguKehamilan,
			Sistole:  d.Sistole,
			Diastole: d.Diastole,
		})

		// =====================
		// WEIGHT GAIN (bukan IMT)
		// =====================
		if d.BeratBadan != nil {
			resp.GrafikIMT = append(resp.GrafikIMT, GrafikBeratBadan{
				Minggu: d.MingguKehamilan,
				Berat:  *d.BeratBadan - kehamilan.BB_Awal,
			})
		}
	}

	resp.DetailRisiko = DetailRisikoDTO{
		SkorRisiko:   latest.SkorRisiko,
		StatusRisiko: latest.StatusRisiko,
		Ringkasan:    latest.DetailRisiko,
	}

	return resp, nil
}
