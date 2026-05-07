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
type AnakResponse struct {
	ID              int32            `json:"id"`
	KehamilanID     int32            `json:"kehamilan_id"`
	PendudukID      int32            `json:"penduduk_id"`
	Nama            string           `json:"nama"`
	TanggalLahir    string           `json:"tanggal_lahir"` // "YYYY-MM-DD"
	JenisKelamin    string           `json:"jenis_kelamin"`
	UsiaBulan       int              `json:"usia_bulan"`
	UsiaTeks        string           `json:"usia_teks"`
	BeratLahirKg    *float64         `json:"berat_lahir_kg,omitempty"`
	TinggiLahirCm   *float64         `json:"tinggi_lahir_cm,omitempty"`
	AnakKe          int32            `json:"anak_ke"`
	LingkarKepalaCm *float64         `json:"lingkar_kepala_cm,omitempty"`
	NamaIbu         string           `json:"nama_ibu"`
	NamaAyah        string           `json:"nama_ayah"`
	IbuID           int32            `json:"ibu_id"`
	GolonganDarah   string           `json:"golongan_darah,omitempty"`
	Kehamilan       *KehamilanSimple `json:"kehamilan,omitempty"`
}
