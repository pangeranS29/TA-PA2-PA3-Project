package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"time"
)

type PemantauanPertumbuhanAnakUseCase interface {
	Create(req models.CreatePemantauanPemeriksaanRequest) error
	Update(id int32, req models.UpdatePemantauanPemeriksaanRequest) error
	GetByAnakID(anakID int32) ([]models.DeteksiDiniPenyimpangan, error)
	GetByID(id int32) (*models.DeteksiDiniPenyimpangan, error)
	GetAll() ([]models.DeteksiDiniPenyimpangan, error)
	Delete(id int32) error
}

type pemantauanpertumbuhanUseCase struct {
	repo     repositories.PemantauanPertumbuhanRepository
	anakRepo *repositories.AnakRepository
	mainRepo *repositories.Main
}

func NewPemantauanPertumbuhanUseCase(repo repositories.PemantauanPertumbuhanRepository, anakRepo *repositories.AnakRepository, mainRepo *repositories.Main) PemantauanPertumbuhanAnakUseCase {
	return &pemantauanpertumbuhanUseCase{
		repo:     repo,
		anakRepo: anakRepo,
		mainRepo: mainRepo,
	}
}

func (u *pemantauanpertumbuhanUseCase) Create(req models.CreatePemantauanPemeriksaanRequest) error {

	if req.AnakID == 0 {
		return errors.New("anak_id wajib diisi")
	}

	if req.TenagaKesehatanID == 0 {
		return errors.New("tenaga_kesehatan_id wajib diisi")
	}

	now := time.Now()

	// Parse Tanggal (mendukung format YYYY-MM-DD dan ISO 8601)
	var tgl time.Time
	if req.Tanggal != "" {
		// Coba format ISO 8601 dulu (dari frontend)
		if t, err := time.Parse(time.RFC3339, req.Tanggal); err == nil {
			tgl = t
		} else if t, err := time.Parse("2006-01-02", req.Tanggal); err == nil {
			tgl = t
		}
	}

	if tgl.IsZero() {
		tgl = now
	}

	var kunjunganUlang *time.Time
	if req.KunjunganUlang != "" {
		if ku, err := time.Parse(time.RFC3339, req.KunjunganUlang); err == nil {
			kunjunganUlang = &ku
		} else if ku, err := time.Parse("2006-01-02", req.KunjunganUlang); err == nil {
			kunjunganUlang = &ku
		}
	}

	// Default values untuk field NOT NULL
	hasilPKAT := req.HasilPKAT
	if hasilPKAT == "" {
		hasilPKAT = "Normal" // Default jika kosong
	}

	tindakan := req.Tindakan
	if tindakan == "" {
		tindakan = "Pemberian stimulasi sesuai usia" // Default jika kosong
	}

	pemeriksaan := models.DeteksiDiniPenyimpangan{
		AnakID:            req.AnakID,
		BulanKe:           req.Bulanke,
		Tanggal:           tgl,
		TenagaKesehatanID: req.TenagaKesehatanID,
		BBperU:            req.BBperU,
		BBperTB:           req.BBperTB,
		TBperU:            req.TBperU,
		LKperU:            req.LKperU,
		LILA:              req.LILA,
		KPSP:              req.KPSP,
		TDD:               req.TDD,
		TDL:               req.TDL,
		KMPE:              req.KMPE,
		MCHATRevised:      req.MCHATRevised,
		ACTRS:             req.ACTRS,
		HasilPKAT:         hasilPKAT,
		Tindakan:          tindakan,
		KunjunganUlang:    kunjunganUlang,
		CreatedAt:         now,
		UpdatedAt:         now,
	}

	if err := u.repo.Create(&pemeriksaan); err != nil {
		return err
	}

	// Integrasi ke Grafik Pertumbuhan
	if req.BeratBadan > 0 || req.TinggiBadan > 0 {
		anak, err := u.anakRepo.FindByID(req.AnakID)
		if err == nil && anak != nil {
			var tglLahir time.Time
			if anak.Penduduk != nil && !anak.Penduduk.TanggalLahir.IsZero() {
				tglLahir = anak.Penduduk.TanggalLahir
			}

			catatan := models.CatatanPertumbuhan{
				AnakID:      req.AnakID,
				TglUkur:     tgl,
				BeratBadan:  req.BeratBadan,
				TinggiBadan: req.TinggiBadan,
				CreatedAt:   now,
				UpdatedAt:   now,
			}

			if !tglLahir.IsZero() {
				catatan.UsiaUkurBulan = catatan.HitungUsiaBulan(tglLahir)
			} else {
				catatan.UsiaUkurBulan = req.Bulanke
			}

			// Simpan ke repositori pertumbuhan
			_ = u.mainRepo.CreateCatatanPertumbuhan(&catatan)
		}
	}

	return nil
}
func (u *pemantauanpertumbuhanUseCase) Update(id int32, req models.UpdatePemantauanPemeriksaanRequest) error {
	now := time.Now()
	return u.repo.Update(id, req, now)
}
func (u *pemantauanpertumbuhanUseCase) GetByAnakID(anakID int32) ([]models.DeteksiDiniPenyimpangan, error) {
	return u.repo.GetByAnakID(anakID)
}

func (u *pemantauanpertumbuhanUseCase) GetByID(id int32) (*models.DeteksiDiniPenyimpangan, error) {
	return u.repo.GetByID(id)
}

func (u *pemantauanpertumbuhanUseCase) GetAll() ([]models.DeteksiDiniPenyimpangan, error) {
	return u.repo.GetAll()
}

func (u *pemantauanpertumbuhanUseCase) Delete(id int32) error {
	return u.repo.Delete(id)
}
