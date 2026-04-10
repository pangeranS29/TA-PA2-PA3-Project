package models

type CreateAnakRequest struct {
	KehamilanID   int32    `json:"kehamilan_id" validate:"required"`
	Nama          string   `json:"nama" validate:"required"`
	TanggalLahir  string   `json:"tanggal_lahir" validate:"required"` // "YYYY-MM-DD"
	JenisKelamin  string   `json:"jenis_kelamin" validate:"required,oneof=laki-laki perempuan"`
	BeratLahirKg  *float64 `json:"berat_lahir_kg,omitempty"`
	GolonganDarah *string  `json:"golongan_darah,omitempty"`
}

// UpdateAnakRequest adalah body request untuk PUT /anak/:id.
type UpdateAnakRequest struct {
	Nama          string   `json:"nama"`
	TanggalLahir  string   `json:"tanggal_lahir"` // "YYYY-MM-DD"
	JenisKelamin  string   `json:"jenis_kelamin"`
	BeratLahirKg  *float64 `json:"berat_lahir_kg,omitempty"`
	GolonganDarah *string  `json:"golongan_darah,omitempty"`
}

type DetailPelayananRequest struct {
	ID               int32  `json:"id,omitempty"`
	KunjunganAnakID  int32  `json:"kunjungan_anak_id,omitempty"`
	JenisPelayananID int32  `json:"jenis_pelayanan_id" validate:"required"`
	Nilai            string `json:"nilai" validate:"required"`
	Keterangan       string `json:"keterangan"`
}

type CreatePelayananKesehatanAnakRequest struct {
	AnakID          int32                    `json:"anak_id" validate:"required"`
	Tanggal         string                   `json:"tanggal" validate:"required,datetime=2006-01-02"`
	PeriodeID       int32                    `json:"periode_id" validate:"required"`
	KategoriUmurID  int32                    `json:"kategori_umur_id" validate:"required"`
	Lokasi          string                   `json:"lokasi" validate:"required"`
	DetailPelayanan []DetailPelayananRequest `json:"detail_pelayanan" validate:"required,dive"`
}

type UpdatePelayananKesehatanAnakRequest struct {
	AnakID          int32                    `json:"anak_id"`
	PeriodeID       int32                    `json:"periode_id"`
	Tanggal         string                   `json:"tanggal"` // "YYYY-MM-DD"
	Lokasi          string                   `json:"lokasi"`
	KategoriUmurID  int32                    `json:"kategori_umur_id"`
	DetailPelayanan []DetailPelayananRequest `json:"detail_pelayanan"`
}

type CreatePelayananNeonatusRequest struct {
	AnakID            int32                    `json:"anak_id" validate:"required"`
	Tanggal           string                   `json:"tanggal" validate:"required,datetime=2006-01-02"`
	PeriodeID         int32                    `json:"periode_id" validate:"required"`
	KategoriUmurID    int32                    `json:"kategori_umur_id" validate:"required"`
	TenagaKesehatanID int32                    `json:"tenaga_kesehatan_id" validate:"required"`
	DetailPelayanan   []DetailPelayananRequest `json:"detail_pelayanan" validate:"required,dive"`
}

type UpdatePelayananNeonatusRequest struct {
	AnakID            int32                    `json:"anak_id"`
	PeriodeID         int32                    `json:"periode_id"`
	Tanggal           string                   `json:"tanggal"` // "YYYY-MM-DD"
	TenagaKesehatanID int32                    `json:"tenaga_kesehatan_id"`
	KategoriUmurID    int32                    `json:"kategori_umur_id"`
	DetailPelayanan   []DetailPelayananRequest `json:"detail_pelayanan"`
}
