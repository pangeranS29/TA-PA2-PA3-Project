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

	// Gunakan Tanggal langsung karena sudah time.Time
	tgl := req.Tanggal
	if tgl.IsZero() {
		tgl = now
	}

	var kunjunganUlang *time.Time
	if !req.KunjunganUlang.IsZero() {
		ku := req.KunjunganUlang
		kunjunganUlang = &ku
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

	// Integrasi ke Grafik Pertumbuhan tidak tersedia karena
	// CreatePemantauanPemeriksaanRequest tidak memiliki field BeratBadan/TinggiBadan.
	// Gunakan endpoint pertumbuhan terpisah untuk mencatat data pertumbuhan.

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
