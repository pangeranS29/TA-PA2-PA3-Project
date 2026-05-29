package models

import "time"

type CatatanPertumbuhan struct {
    ID            uint      `json:"id"`
    AnakID        uint      `json:"anak_id"`
    TglUkur       time.Time `json:"tgl_ukur"`
    BeratBadan    float64   `json:"berat_badan"`
    TinggiBadan   float64   `json:"tinggi_badan"`
    LingkarKepala float64   `json:"lingkar_kepala,omitempty"`
    HasilLila     float64   `json:"hasil_lila,omitempty"`
    IMT           float64   `json:"imt,omitempty"`
    UsiaUkurBulan int       `json:"usia_ukur_bulan,omitempty"`
    CatatanNakes  string    `json:"catatan_nakes,omitempty"`
    CreatedAt     time.Time `json:"created_at,omitempty"`
    UpdatedAt     time.Time `json:"updated_at,omitempty"`
}
