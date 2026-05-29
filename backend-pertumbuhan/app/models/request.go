package models

type CreatePertumbuhanRequest struct {
    AnakID        uint    `json:"anak_id" binding:"required"`
    TglUkur       string  `json:"tgl_ukur" binding:"required"`
    BeratBadan    float64 `json:"berat_badan" binding:"required"`
    TinggiBadan   float64 `json:"tinggi_badan" binding:"required"`
    LingkarKepala float64 `json:"lingkar_kepala,omitempty"`
    HasilLila     float64 `json:"hasil_lila,omitempty"`
    CatatanNakes  string  `json:"catatan_nakes,omitempty"`
}

type UpdatePertumbuhanRequest struct {
    TglUkur       string  `json:"tgl_ukur"`
    BeratBadan    float64 `json:"berat_badan"`
    TinggiBadan   float64 `json:"tinggi_badan"`
    LingkarKepala float64 `json:"lingkar_kepala,omitempty"`
    HasilLila     float64 `json:"hasil_lila,omitempty"`
    CatatanNakes  string  `json:"catatan_nakes,omitempty"`
}

type CatatanPertumbuhanResponse struct {
    ID            uint   `json:"id"`
    AnakID        uint   `json:"anak_id"`
    TglUkur       string `json:"tgl_ukur"`
    BeratBadan    float64 `json:"berat_badan"`
    TinggiBadan   float64 `json:"tinggi_badan"`
    LingkarKepala float64 `json:"lingkar_kepala,omitempty"`
    HasilLila     float64 `json:"hasil_lila,omitempty"`
    IMT           float64 `json:"imt,omitempty"`
    CatatanNakes  string  `json:"catatan_nakes,omitempty"`
}
