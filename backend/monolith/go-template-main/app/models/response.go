package models

type Response struct {
	StatusCode int         `json:"status_code"`
	Message    interface{} `json:"message,omitempty"`
	Data       interface{} `json:"data,omitempty"`
}

type BasicResponse struct {
	StatusCode int         `json:"status_code"`
	Message    interface{} `json:"message,omitempty"`
}

type ResponseWithPaginate struct {
	StatusCode int         `json:"status_code"`
	Message    interface{} `json:"message,omitempty"`
	Data       interface{} `json:"data,omitempty"`
	Pagination *Pagination `json:"pagination,omitempty"`
}

type Pagination struct {
	Page      int `json:"page,omitempty"`
	PageSize  int `json:"page_size,omitempty"`
	Total     int `json:"total,omitempty"`
	TotalPage int `json:"total_page,omitempty"`
}
type KehamilanSimple struct {
	ID  int32 `json:"id"`
	Ibu struct {
		NamaIbu string `json:"nama_ibu"`
	} `json:"ibu"`
}
type PertumbuhanSimple struct {
	Bulan       int     `json:"bulan"`
	BeratBadan  float64 `json:"berat_badan"`
	TinggiBadan float64 `json:"tinggi_badan"`
}

type AnakResponse struct {
	ID            int32               `json:"id"`
	KehamilanID   int32               `json:"kehamilan_id"`
	PendudukID    int32               `json:"penduduk_id"`
	Nama          string              `json:"nama"`
	TanggalLahir  string              `json:"tanggal_lahir"` // "YYYY-MM-DD"
	JenisKelamin  string              `json:"jenis_kelamin"`
	UsiaBulan     int                 `json:"usia_bulan"`
	UsiaTeks      string              `json:"usia_teks"`
	BeratLahirKg  *float64            `json:"berat_lahir_kg,omitempty"`
	TinggiLahirCm *float64            `json:"tinggi_lahir_cm,omitempty"`
	GolonganDarah string              `json:"golongan_darah,omitempty"`
	Kehamilan     *KehamilanSimple    `json:"kehamilan,omitempty"`
	Pertumbuhan   []PertumbuhanSimple `json:"pertumbuhan,omitempty"`
}
type CatatanPertumbuhanResponse struct {
	ID            int32   `json:"id"`
	AnakID        int32   `json:"anak_id"`
	TglUkur       string  `json:"tgl_ukur"`
	UsiaUkurBulan int     `json:"usia_ukur_bulan"`
	UsiaUkurYM    string  `json:"usia_ukur_ym"`
	KurvaKMS      string  `json:"kurva_kms"`
	BeratBadan    float64 `json:"berat_badan"`
	TinggiBadan   float64 `json:"tinggi_badan"`
	LingkarKepala float64 `json:"lingkar_kepala"`
	IMT           float64 `json:"imt"`

	// Status Gizi (Permenkes 2/2020)
	StatusBBU  string `json:"status_bb_u"`
	StatusTBU  string `json:"status_tb_u"`
	StatusIMTU string `json:"status_imt_u"`
	StatusBBTB string `json:"status_bb_tb"`
	StatusLKU  string `json:"status_lk_u"`

	// Rentang Ideal (WHO -2SD s/d +1SD)
	IdealBeratMin  float64 `json:"ideal_berat_min"`
	IdealBeratMax  float64 `json:"ideal_berat_max"`
	IdealTinggiMin float64 `json:"ideal_tinggi_min"`
	IdealTinggiMax float64 `json:"ideal_tinggi_max"`

	// KMS Logic
	StatusKMSNaik string  `json:"status_kms_naik"`
	StatusKMSBGM  string  `json:"status_kms_bgm"`
	KBMMinGram    int     `json:"kbm_min_gram"`
	KenaikanGram  float64 `json:"kenaikan_gram"`
	StatusKMSInfo string  `json:"status_kms_info"`

	CatatanNakes string `json:"catatan_nakes"`
}

type PertumbuhanChartResponse struct {
	AnakID       int32                        `json:"anak_id"`
	NamaAnak     string                       `json:"nama_anak"`
	JenisKelamin string                       `json:"jenis_kelamin"`
	Riwayat      []CatatanPertumbuhanResponse `json:"riwayat"`
	StandarBBU   []MasterStandarResponse      `json:"standar_bb_u"`
	StandarTBU   []MasterStandarResponse      `json:"standar_tb_u"`
}
