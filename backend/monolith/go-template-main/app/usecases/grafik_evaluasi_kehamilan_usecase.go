package usecases

// import (
// 	"errors"
// 	"monitoring-service/app/models"
// 	"monitoring-service/app/repositories"
// 	"time"
// )

// type GrafikEvaluasiKehamilanUsecase interface {
// 	Create(g *models.GrafikEvaluasiKehamilan) error
// 	GetByID(id int32) (*models.GrafikEvaluasiKehamilan, error)
// 	GetByKehamilanID(kehamilanID int32) ([]models.GrafikEvaluasiKehamilan, error)
// 	Update(g *models.GrafikEvaluasiKehamilan) error
// 	Delete(id int32) error
// 	GetGrafik(kehamilanID int32) (*GrafikResponse, error)
// }
// type GrafikTFUPoint struct {
// 	Usia   int     `json:"usia"`
// 	TFU    float64 `json:"tfu"`
// 	Normal float64 `json:"normal"`
// 	Upper  float64 `json:"upper"`
// 	Lower  float64 `json:"lower"`
// }

// type GrafikDJJPoint struct {
// 	Usia  int `json:"usia"`
// 	DJJ   int `json:"djj"`
// 	Upper int `json:"upper"`
// 	Lower int `json:"lower"`
// }

// // Grafik Baru: Tekanan Darah
// type GrafikTDPoint struct {
// 	Usia          int `json:"usia"`
// 	Sistole       int `json:"sistole"`
// 	Diastole      int `json:"diastole"`
// 	LimitSistole  int `json:"limit_sistole"`  // Garis merah 140
// 	LimitDiastole int `json:"limit_diastole"` // Garis merah 90
// }

// type GrafikResponse struct {
// 	GrafikTFU  []GrafikTFUPoint `json:"grafik_tfu"`
// 	GrafikDJJ  []GrafikDJJPoint `json:"grafik_djj"`
// 	GrafikTD   []GrafikTDPoint  `json:"grafik_tekanan_darah"`
// 	Penjelasan string           `json:"penjelasan"`      // Ringkasan kondisi terakhir
// 	RiskLevel  string           `json:"kategori_risiko"` // Rendah, Sedang, Tinggi
// }
// type grafikEvaluasiKehamilanUsecase struct {
// 	repo          *repositories.GrafikEvaluasiKehamilanRepository
// 	kehamilanRepo *repositories.KehamilanRepository
// }

// func NewGrafikEvaluasiKehamilanUsecase(repo *repositories.GrafikEvaluasiKehamilanRepository, kehamilanRepo *repositories.KehamilanRepository) GrafikEvaluasiKehamilanUsecase {
// 	return &grafikEvaluasiKehamilanUsecase{repo: repo, kehamilanRepo: kehamilanRepo}
// }
// func HitungUsiaKehamilan(hpht, tanggalPeriksa time.Time) int {
// 	selisihHari := int(tanggalPeriksa.Sub(hpht).Hours() / 24)
// 	minggu := selisihHari / 7

// 	if minggu < 0 {
// 		return 0
// 	}
// 	return minggu
// }

// func (u *grafikEvaluasiKehamilanUsecase) Create(g *models.GrafikEvaluasiKehamilan) error {
// 	if g.KehamilanID == 0 {
// 		return errors.New("kehamilan_id wajib diisi")
// 	}

// 	kehamilan, err := u.kehamilanRepo.FindByID(g.KehamilanID)
// 	if err != nil {
// 		return err
// 	}

// 	if kehamilan.HPHT.IsZero() {
// 		return errors.New("HPHT belum diisi")
// 	}

// 	if g.TanggalBulanTahun == nil {
// 		return errors.New("tanggal pemeriksaan wajib diisi")
// 	}

// 	// 🔥 HITUNG USIA OTOMATIS
// 	usia := HitungUsiaKehamilan(kehamilan.HPHT, *g.TanggalBulanTahun)
// 	g.UsiaGestasiMinggu = &usia

// 	// =========================
// 	history, err := u.repo.FindByKehamilanID(g.KehamilanID)
// 	if err != nil {
// 		return err
// 	}

// 	penjelasan, risk := GeneratePenjelasanSingle(g, history)

// 	g.PenjelasanHasilGrafik = &penjelasan
// 	g.KategoriRisiko = &risk

// 	return u.repo.Create(g)
// }

// func (u *grafikEvaluasiKehamilanUsecase) GetByID(id int32) (*models.GrafikEvaluasiKehamilan, error) {
// 	return u.repo.FindByID(id)
// }

// func (u *grafikEvaluasiKehamilanUsecase) GetByKehamilanID(kehamilanID int32) ([]models.GrafikEvaluasiKehamilan, error) {
// 	return u.repo.FindByKehamilanID(kehamilanID)
// }

// func (u *grafikEvaluasiKehamilanUsecase) Update(g *models.GrafikEvaluasiKehamilan) error {
// 	_, err := u.repo.FindByID(g.ID)
// 	if err != nil {
// 		return errors.New("data grafik evaluasi kehamilan tidak ditemukan")
// 	}
// 	return u.repo.Update(g)
// }

// func (u *grafikEvaluasiKehamilanUsecase) Delete(id int32) error {
// 	return u.repo.Delete(id)
// }
// // 
// func (u *grafikEvaluasiKehamilanUsecase) GetGrafik(kehamilanID int32) (*GrafikResponse, error) {
//     data, err := u.repo.FindByKehamilanID(kehamilanID)
//     if err != nil {
//         return nil, err
//     }

//     var tfuResult []GrafikTFUPoint
//     var djjResult []GrafikDJJPoint
//     var tdResult  []GrafikTDPoint

//     for _, d := range data {
//         if d.UsiaGestasiMinggu == nil { continue }
//         usia := *d.UsiaGestasiMinggu

//         // --- 1. SET TFU BOUNDARIES (DINAMIS) ---
//         if d.TinggiFundusUteriCm != nil && usia >= 20 {
//             tfuResult = append(tfuResult, GrafikTFUPoint{
//                 Usia:   usia,
//                 TFU:    *d.TinggiFundusUteriCm,
//                 Normal: float64(usia),      // Garis tengah ideal
//                 Upper:  float64(usia) + 2,  // Batas atas normal
//                 Lower:  float64(usia) - 2,  // Batas bawah normal
//             })
//         }

//         // --- 2. SET DJJ BOUNDARIES (STATIS) ---
//         if d.DenyutJantungBayiXMenit != nil {
//             djjResult = append(djjResult, GrafikDJJPoint{
//                 Usia:  usia,
//                 DJJ:   *d.DenyutJantungBayiXMenit,
//                 Upper: 160, // Sesuai garis merah atas Buku KIA
//                 Lower: 110, // Sesuai garis merah bawah Buku KIA
//             })
//         }

//         // --- 3. SET TEKANAN DARAH BOUNDARIES (LIMITS) ---
//         if d.TekananDarahSistole != nil && d.TekananDarahDiastole != nil {
//             tdResult = append(tdResult, GrafikTDPoint{
//                 Usia:          usia,
//                 Sistole:       *d.TekananDarahSistole,
//                 Diastole:      *d.TekananDarahDiastole,
//                 LimitSistole:  140, // Titik bahaya sistole
//                 LimitDiastole: 90,  // Titik bahaya diastole
//             })
//         }
//     }

//     // Ambil penjelasan terakhir untuk ditampilkan di bawah grafik
//     var penjelasan, risk string
//     if len(data) > 0 {
//         last := data[len(data)-1]
//         if last.PenjelasanHasilGrafik != nil { penjelasan = *last.PenjelasanHasilGrafik }
//         if last.KategoriRisiko != nil { risk = *last.KategoriRisiko }
//     }

//     return &GrafikResponse{
//         GrafikTFU:  tfuResult,
//         GrafikDJJ:  djjResult,
//         GrafikTD:   tdResult,
// 		Penjelasan: penjelasan,
// 		RiskLevel:  risk,
//     }, nil
// }