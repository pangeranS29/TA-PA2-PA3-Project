package models

import "time"

// LaporanAnak adalah DTO untuk export laporan data anak ke Excel.
// Semua field diisi langsung dari raw SQL query (bukan dari GORM Preload),
// sehingga tidak perlu relasi struct.
type LaporanAnak struct {
	NIK           string    `json:"nik"`
	NamaAnak      string    `json:"nama_anak"`
	NamaIbu       string    `json:"nama_ibu"`
	NamaAyah      string    `json:"nama_ayah"`
	TanggalLahir  time.Time `json:"tanggal_lahir"`
	Usia          string    `json:"usia"`
	BeratLahirKg  float64   `json:"berat_lahir_kg"`
	TinggiLahirCm float64   `json:"tinggi_lahir_cm"`
	LILA          float64   `json:"lila"`
	GolonganDarah string    `json:"golongan_darah"`
	Kecamatan     string    `json:"kecamatan"`
	Desa          string    `json:"desa"`
}

// LaporanPertumbuhan adalah DTO untuk export data riwayat pertumbuhan anak.
type LaporanPertumbuhan struct {
	NIK            string    `json:"nik"`
	NamaAnak       string    `json:"nama_anak"`
	TglUkur        time.Time `json:"tgl_ukur"`
	UsiaUkurBulan  int       `json:"usia_ukur_bulan"`
	BeratBadan     float64   `json:"berat_badan"`
	TinggiBadan    float64   `json:"tinggi_badan"`
	HasilLila      float64   `json:"hasil_lila"`
	LingkarKepala  float64   `json:"lingkar_kepala"`
	IMT            float64   `json:"imt"`
	StatusBBU      string    `json:"status_bb_u"`
	StatusTBU      string    `json:"status_tb_u"`
	StatusBBTB     string    `json:"status_bb_tb"`
	StatusIMTU     string    `json:"status_imt_u"`
	CatatanNakes   string    `json:"catatan_nakes"`
}

// LaporanImunisasi adalah DTO untuk export data riwayat imunisasi anak.
type LaporanImunisasi struct {
	NIK          string     `json:"nik"`
	NamaAnak     string     `json:"nama_anak"`
	NamaVaksin   string     `json:"nama_vaksin"`
	TglPemberian *time.Time `json:"tgl_pemberian"`
	Status       string     `json:"status"`
	Lokasi       string     `json:"lokasi"`
	Petugas      string     `json:"petugas"`
}

// LaporanAnakPreviewResponse adalah pembungkus response preview laporan anak.
type LaporanAnakPreviewResponse struct {
	Anak        []LaporanAnak        `json:"anak"`
	Pertumbuhan []LaporanPertumbuhan `json:"pertumbuhan"`
	Imunisasi   []LaporanImunisasi   `json:"imunisasi"`
}
