package models

import "time"

// PERTUMBUHAN ANAK
// Request
type CreatePertumbuhanRequest struct {
	AnakID        uint    `json:"anak_id" binding:"required"`
	TglUkur       string  `json:"tgl_ukur" binding:"required"` // Format: YYYY-MM-DD
	BeratBadan    float64 `json:"berat_badan" binding:"required"`
	TinggiBadan   float64 `json:"tinggi_badan" binding:"required"`
	LingkarKepala float64 `json:"lingkar_kepala,omitempty"`
	CatatanNakes  string  `json:"catatan_nakes,omitempty"`
}

type UpdatePertumbuhanRequest struct {
	TglUkur       string  `json:"tgl_ukur"`
	BeratBadan    float64 `json:"berat_badan"`
	TinggiBadan   float64 `json:"tinggi_badan"`
	LingkarKepala float64 `json:"lingkar_kepala,omitempty"`
	CatatanNakes  string  `json:"catatan_nakes,omitempty"`
}

// Response
type CatatanPertumbuhanResponse struct {
	ID            uint          `json:"id"`
	AnakID        uint          `json:"anak_id"`
	Anak          *AnakResponse `json:"anak,omitempty"`
	TglUkur       string        `json:"tgl_ukur"`
	UsiaUkurBulan int           `json:"usia_ukur_bulan"`
	UsiaUkurYM    string        `json:"usia_ukur_tahun_bulan,omitempty"` // Format: "1:4" = 1 tahun 4 bulan
	KurvaKMS      string        `json:"kurva_kms,omitempty"`             // "KMS 0-2 Tahun" atau "KMS 2-5 Tahun"
	BeratBadan    float64       `json:"berat_badan"`
	TinggiBadan   float64       `json:"tinggi_badan"`
	LingkarKepala float64       `json:"lingkar_kepala"`
	IMT           float64       `json:"imt"`
	StatusBBU     string        `json:"status_bb_u"`
	StatusTBU     string        `json:"status_tb_u"`
	StatusIMTU    string        `json:"status_imt_u"`
	StatusBBTB    string        `json:"status_bb_tb"`
	StatusLKU     string        `json:"status_lk_u"`
	StatusKMSNaik string        `json:"status_kms_naik,omitempty"`  // Naik (N), Tidak Naik (T), Data Awal
	StatusKMSBGM  string        `json:"status_kms_bgm,omitempty"`   // Di bawah garis merah / Tidak
	KBMMinGram    int           `json:"kbm_min_gram,omitempty"`     // Kenaikan BB minimum (gram)
	KenaikanGram  float64       `json:"kenaikan_bb_gram,omitempty"` // Selisih dari penimbangan sebelumnya (gram)
	StatusKMSInfo string        `json:"status_kms_info,omitempty"`  // Ringkasan interpretasi KMS
	CatatanNakes  string        `json:"catatan_nakes"`
}

// MASTER STANDAR ANTROPOMETRI
// Request
type CreateMasterStandarRequest struct {
	Parameter     string  `json:"parameter" binding:"required"` // bb_u, tb_u, imt_u, bb_tb, lk_u
	JenisKelamin  string  `json:"jenis_kelamin" binding:"required"`
	UsiaReferensi string  `json:"usia_referensi,omitempty"` // Khusus lk_u: bisa "1:4" atau "18"
	NilaiSumbuX   float64 `json:"nilai_sumbu_x" binding:"required"`
	SD3Neg        float64 `json:"sd_3_neg"`
	SD2Neg        float64 `json:"sd_2_neg" binding:"required"`
	SD1Neg        float64 `json:"sd_1_neg" binding:"required"`
	Median        float64 `json:"median" binding:"required"`
	SD1Pos        float64 `json:"sd_1_pos" binding:"required"`
	SD2Pos        float64 `json:"sd_2_pos" binding:"required"`
	SD3Pos        float64 `json:"sd_3_pos"`
}

type UpdateMasterStandarRequest struct {
	NilaiSumbuX float64 `json:"nilai_sumbu_x"`
	SD3Neg      float64 `json:"sd_3_neg"`
	SD2Neg      float64 `json:"sd_2_neg"`
	SD1Neg      float64 `json:"sd_1_neg"`
	Median      float64 `json:"median"`
	SD1Pos      float64 `json:"sd_1_pos"`
	SD2Pos      float64 `json:"sd_2_pos"`
	SD3Pos      float64 `json:"sd_3_pos"`
}

// Response
type MasterStandarResponse struct {
	ID           uint    `json:"id"`
	Parameter    string  `json:"parameter"`
	JenisKelamin string  `json:"jenis_kelamin"`
	NilaiSumbuX  float64 `json:"nilai_sumbu_x"`
	UsiaBulan    int     `json:"usia_bulan,omitempty"`
	UsiaYM       string  `json:"usia_tahun_bulan,omitempty"` // Format: "1:4" = 1 tahun 4 bulan
	SD3Neg       float64 `json:"sd_3_neg"`
	SD2Neg       float64 `json:"sd_2_neg"`
	SD1Neg       float64 `json:"sd_1_neg"`
	Median       float64 `json:"median"`
	SD1Pos       float64 `json:"sd_1_pos"`
	SD2Pos       float64 `json:"sd_2_pos"`
	SD3Pos       float64 `json:"sd_3_pos"`
}

// ANAK
type AnakListResponse struct {
	ID        int64      `json:"id"`
	NamaAnak  string     `json:"nama_anak"`
	NamaIbu   string     `json:"nama_ibu"`
	NoKK      *int64     `json:"no_kk"`
	CreatedAt *time.Time `json:"created_at"`
}

// AnakDetailResponse digunakan untuk GetByID (Lebih detail)
type AnakDetailResponse struct {
	ID               int64      `json:"id"`
	NamaAnak         string     `json:"nama_anak"`
	NIKAnak          string     `json:"nik_anak"`
	TanggalLahirAnak *time.Time `json:"tanggal_lahir_anak"`
	NamaIbu          string     `json:"nama_ibu"`
	NIKIbu           string     `json:"nik_ibu"`
	NoKK             *int64     `json:"no_kk"`
	Dusun            string     `json:"dusun"`
	JenisKelamin     string     `json:"jenis_kelamin"`
	CreatedAt        *time.Time `json:"created_at"`
}

type AnakRequest struct {
	ID              uint    `json:"id"`
	IbuID           *uint   `json:"ibu_id,omitempty"`
	KependudukanID  *uint   `json:"kependudukan_id,omitempty"`
	NoKartuKeluarga int64   `json:"no_kartu_keluarga,omitempty"`
	NamaAnak        string  `json:"nama_anak,omitempty"`
	JenisKelamin    string  `json:"jenis_kelamin,omitempty"`
	TanggalLahir    string  `json:"tanggal_lahir,omitempty"`
	BeratLahir      float64 `json:"berat_lahir"`
	TinggiLahir     float64 `json:"tinggi_lahir"`
}

type AnakResponse struct {
	ID              uint    `json:"id"`
	IbuID           *uint   `json:"ibu_id,omitempty"`
	KependudukanID  *int64  `json:"kependudukan_id,omitempty"`
	NoKartuKeluarga int64   `json:"no_kartu_keluarga,omitempty"`
	NamaAnak        string  `json:"nama_anak,omitempty"`
	JenisKelamin    string  `json:"jenis_kelamin,omitempty"`
	TanggalLahir    string  `json:"tanggal_lahir,omitempty"`
	BeratLahir      float64 `json:"berat_lahir"`
	TinggiLahir     float64 `json:"tinggi_lahir"`
}
