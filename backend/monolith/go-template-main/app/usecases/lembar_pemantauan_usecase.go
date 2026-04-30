package usecases

import (
	"errors"
	"fmt"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"strconv"
	"strings"
	"time"
)

var ErrLembarPemantauanForbidden = errors.New("akses lembar pemantauan ditolak")

// Interface untuk Lembar Pemantauan Usecase
type LembarPemantauanUsecase interface {
	Create(req models.LembarPemantauanRequest) (*models.LembarPemantauan, error)
	CreateForIbu(req models.LembarPemantauanRequest, userID int32) (*models.LembarPemantauan, error)
	GetRentangUsia() ([]models.RentangUsia, error)
	GetKategoriTandaSakitByRentangUsiaID(rentangUsiaID string) ([]models.KategoriTandaSakit, error)
	GetByID(id string) (*models.LembarPemantauan, error)
	GetByAnakID(anakID string) ([]models.LembarPemantauan, error)
	GetByAnakIDForIbu(anakID string, userID int32) ([]models.LembarPemantauan, error)
	GetAll() ([]models.LembarPemantauan, error)
	Update(id string, req models.LembarPemantauanRequest) (*models.LembarPemantauan, error)
	Delete(id string) error
}

// Implementasi struct
type lembarPemantauanUsecase struct {
	repository repositories.LembarPemantauanRepository
}

// Constructor
func NewLembarPemantauanUsecase(repo repositories.LembarPemantauanRepository) LembarPemantauanUsecase {
	return &lembarPemantauanUsecase{
		repository: repo,
	}
}

// Helper function - Convert string ke int32
func parseID(id string, fieldName string) (int32, error) {
	id = strings.TrimSpace(id)
	if id == "" {
		return 0, errors.New(fmt.Sprintf("%s tidak boleh kosong", fieldName))
	}

	val, err := strconv.ParseInt(id, 10, 32)
	if err != nil {
		return 0, errors.New(fmt.Sprintf("%s harus berupa angka", fieldName))
	}

	if val <= 0 {
		return 0, errors.New(fmt.Sprintf("%s harus lebih dari 0", fieldName))
	}

	return int32(val), nil
}

// Create - Membuat lembar pemantauan baru
func (u *lembarPemantauanUsecase) Create(req models.LembarPemantauanRequest) (*models.LembarPemantauan, error) {
	// Validasi input
	if err := req.Validate(); err != nil {
		return nil, err
	}

	// Parse tanggal periksa
	tanggalPeriksa, err := time.Parse("2006-01-02", req.TanggalPeriksa)
	if err != nil {
		return nil, errors.New("format tanggal_periksa harus YYYY-MM-DD")
	}

	// Buat lembar pemantauan
	lembar := &models.LembarPemantauan{
		AnakID:         req.AnakID,
		RentangUsiaID:  req.RentangUsiaID,
		PeriodeWaktu:   req.PeriodeWaktu,
		TanggalPeriksa: tanggalPeriksa,
		NamaPemeriksa:  req.NamaPemeriksa,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	// Buat detail gejala dengan validasi
	detailGejala := make([]models.DetailPemantauan, 0, len(req.DetailGejala))
	for _, detail := range req.DetailGejala {
		// Validasi kategori_tanda_sakit_id
		if detail.KategoriTandaSakitID <= 0 {
			return nil, errors.New("kategori_tanda_sakit_id harus lebih dari 0")
		}
		detailGejala = append(detailGejala, models.DetailPemantauan{
			KategoriTandaSakitID: detail.KategoriTandaSakitID,
			IsTerjadi:            detail.IsTerjadi,
			CreatedAt:            time.Now(),
			UpdatedAt:            time.Now(),
		})
	}

	lembar.DetailGejala = detailGejala

	// Simpan ke database
	if err := u.repository.Create(lembar); err != nil {
		return nil, err
	}

	return lembar, nil
}

// CreateForIbu - Membuat lembar pemantauan untuk ibu yang sedang login
func (u *lembarPemantauanUsecase) CreateForIbu(req models.LembarPemantauanRequest, userID int32) (*models.LembarPemantauan, error) {
	if err := req.Validate(); err != nil {
		return nil, err
	}

	ok, err := u.repository.IsAnakMilikIbu(userID, req.AnakID)
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, ErrLembarPemantauanForbidden
	}

	return u.Create(req)
}

func (u *lembarPemantauanUsecase) GetRentangUsia() ([]models.RentangUsia, error) {
	return u.repository.FindRentangUsia()
}

func (u *lembarPemantauanUsecase) GetKategoriTandaSakitByRentangUsiaID(rentangUsiaID string) ([]models.KategoriTandaSakit, error) {
	id, err := parseID(rentangUsiaID, "rentang_usia_id")
	if err != nil {
		return nil, err
	}

	return u.repository.FindKategoriTandaSakitByRentangUsiaID(id)
}

// GetByID - Mendapatkan lembar pemantauan berdasarkan ID
func (u *lembarPemantauanUsecase) GetByID(id string) (*models.LembarPemantauan, error) {
	// Parse ID
	lembarID, err := parseID(id, "lembar_pemantauan_id")
	if err != nil {
		return nil, err
	}

	// Ambil dari repository
	lembar, err := u.repository.FindByID(lembarID)
	if err != nil {
		return nil, err
	}

	return lembar, nil
}

// GetByAnakID - Mendapatkan semua lembar pemantauan untuk anak tertentu
func (u *lembarPemantauanUsecase) GetByAnakID(anakID string) ([]models.LembarPemantauan, error) {
	// Parse ID
	id, err := parseID(anakID, "anak_id")
	if err != nil {
		return nil, err
	}

	// Ambil dari repository
	lembars, err := u.repository.FindByAnakID(id)
	if err != nil {
		return nil, err
	}

	return lembars, nil
}

// GetByAnakIDForIbu - Mendapatkan lembar pemantauan untuk anak milik ibu yang login
func (u *lembarPemantauanUsecase) GetByAnakIDForIbu(anakID string, userID int32) ([]models.LembarPemantauan, error) {
	id, err := parseID(anakID, "anak_id")
	if err != nil {
		return nil, err
	}

	ok, err := u.repository.IsAnakMilikIbu(userID, id)
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, ErrLembarPemantauanForbidden
	}

	return u.repository.FindByAnakID(id)
}

// GetAll - Mendapatkan semua lembar pemantauan
func (u *lembarPemantauanUsecase) GetAll() ([]models.LembarPemantauan, error) {
	lembars, err := u.repository.FindAll()
	if err != nil {
		return nil, err
	}

	return lembars, nil
}

// Update - Mengupdate lembar pemantauan
func (u *lembarPemantauanUsecase) Update(id string, req models.LembarPemantauanRequest) (*models.LembarPemantauan, error) {
	// Parse ID
	lembarID, err := parseID(id, "lembar_pemantauan_id")
	if err != nil {
		return nil, err
	}

	// Validasi input
	if err := req.Validate(); err != nil {
		return nil, err
	}

	// Ambil data lama
	lembar, err := u.repository.FindByID(lembarID)
	if err != nil {
		return nil, err
	}

	// Parse tanggal periksa
	tanggalPeriksa, err := time.Parse("2006-01-02", req.TanggalPeriksa)
	if err != nil {
		return nil, errors.New("format tanggal_periksa harus YYYY-MM-DD")
	}

	// Update field
	lembar.RentangUsiaID = req.RentangUsiaID
	lembar.PeriodeWaktu = req.PeriodeWaktu
	lembar.TanggalPeriksa = tanggalPeriksa
	lembar.NamaPemeriksa = req.NamaPemeriksa
	lembar.UpdatedAt = time.Now()

	// Update detail gejala dengan validasi
	detailGejala := make([]models.DetailPemantauan, 0, len(req.DetailGejala))
	for _, detail := range req.DetailGejala {
		// Validasi kategori_tanda_sakit_id
		if detail.KategoriTandaSakitID <= 0 {
			return nil, errors.New("kategori_tanda_sakit_id harus lebih dari 0")
		}
		detailGejala = append(detailGejala, models.DetailPemantauan{
			KategoriTandaSakitID: detail.KategoriTandaSakitID,
			IsTerjadi:            detail.IsTerjadi,
			CreatedAt:            time.Now(),
			UpdatedAt:            time.Now(),
		})
	}

	lembar.DetailGejala = detailGejala

	// Simpan update
	if err := u.repository.Update(lembar); err != nil {
		return nil, err
	}

	return lembar, nil
}

// Delete - Menghapus lembar pemantauan
func (u *lembarPemantauanUsecase) Delete(id string) error {
	// Parse ID
	lembarID, err := parseID(id, "lembar_pemantauan_id")
	if err != nil {
		return err
	}

	// Hapus dari repository
	if err := u.repository.Delete(lembarID); err != nil {
		return err
	}

	return nil
}
