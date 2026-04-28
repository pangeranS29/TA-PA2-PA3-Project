package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"time"
)

type PengukuranLilAUseCase interface {
	Create(req models.CreatePengukuranLilARequest) error
	Update(id int32, req models.UpdatePengukuranLilARequest) error
	GetByAnakID(anakID int32) ([]models.PengukuranLila, error)
	GetByID(id int32) (*models.PengukuranLila, error)
	GetAll() ([]models.PengukuranLila, error)
	Delete(id int32) error
}

type pengukuranlilaUseCase struct {
	repo repositories.PengukuranLilaRepository
}

func NewPengukuranLilAUseCase(repo repositories.PengukuranLilaRepository) PengukuranLilAUseCase {
	return &pengukuranlilaUseCase{repo: repo}
}

func (u *pengukuranlilaUseCase) Create(req models.CreatePengukuranLilARequest) error {

	if req.AnakID == 0 {
		return errors.New("anak_id wajib diisi")
	}

	now := time.Now()

	// compute kategori risiko otomatis berdasarkan usia (bulan) dan hasil LILA
	kategori := classifyLila(int(req.Bulanke), req.HasilLila)

	pemeriksaan := models.PengukuranLila{
		AnakID:         req.AnakID,
		Bulanke:        req.Bulanke,
		Tanggal:        req.Tanggal,
		HasilLila:      req.HasilLila,
		KategoriRisiko: kategori,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	return u.repo.Create(&pemeriksaan)
}
func (u *pengukuranlilaUseCase) Update(id int32, req models.UpdatePengukuranLilARequest) error {
	now := time.Now()

	// jika ada perubahan usia atau hasil LILA, hitung ulang kategori risiko
	if req.Bulanke != 0 || req.HasilLila != 0 {
		kategori := classifyLila(int(req.Bulanke), req.HasilLila)
		req.KategoriRisiko = kategori
	}

	return u.repo.Update(id, req, now)
}

// classifyLila mengembalikan kategori risiko berdasarkan usia (bulan) dan nilai LILA
// Aturan:
// - Untuk usia < 6 bulan: <10 -> Risiko, >=11 -> Baik (nilai antara 10-10.9 dianggap Risiko)
// - Untuk usia >= 6 bulan: <11.5 -> Gizi Buruk, 11.5-12.4 -> Gizi Kurang, >=12.5 -> Baik
func classifyLila(bulan int, hasil float64) string {
	if hasil <= 0 {
		return ""
	}

	if bulan < 6 {
		if hasil < 10.0 {
			return "risiko"
		}
		if hasil >= 11.0 {
			return "baik"
		}
		// rentang 10.0 - <11.0 dianggap risiko sesuai kebijakan
		return "risiko"
	}

	// bulan >= 6
	if hasil < 11.5 {
		return "gizi_buruk"
	}
	if hasil >= 11.5 && hasil < 12.5 {
		return "gizi_kurang"
	}
	return "baik"
}
func (u *pengukuranlilaUseCase) GetByAnakID(anakID int32) ([]models.PengukuranLila, error) {
	return u.repo.GetByAnakID(anakID)
}

func (u *pengukuranlilaUseCase) GetByID(id int32) (*models.PengukuranLila, error) {
	return u.repo.GetByID(id)
}

func (u *pengukuranlilaUseCase) GetAll() ([]models.PengukuranLila, error) {
	return u.repo.GetAll()
}
func (u *pengukuranlilaUseCase) Delete(id int32) error {
	return u.repo.Delete(id)
}
