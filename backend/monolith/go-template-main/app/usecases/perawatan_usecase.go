package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

// ─────────────────────────────────────────────────────────
// KATEGORI CAPAIAN USECASE
// ─────────────────────────────────────────────────────────

type KategoriCapaianUsecase interface {
	GetAll() ([]models.KategoriCapaian, error)
	GetByID(id uint) (*models.KategoriCapaian, error)
	GetByRentangUsia(rentang string) ([]models.KategoriCapaian, error)
	Create(data *models.KategoriCapaian) error
	Update(id uint, data *models.KategoriCapaian) error
	Delete(id uint) error
}

type kategoriCapaianUsecase struct {
	repo repositories.KategoriCapaianRepository
}

func NewKategoriCapaianUsecase(repo repositories.KategoriCapaianRepository) KategoriCapaianUsecase {
	return &kategoriCapaianUsecase{repo}
}

func (u *kategoriCapaianUsecase) GetAll() ([]models.KategoriCapaian, error) {
	return u.repo.FindAll()
}

func (u *kategoriCapaianUsecase) GetByID(id uint) (*models.KategoriCapaian, error) {
	return u.repo.FindByID(id)
}

func (u *kategoriCapaianUsecase) GetByRentangUsia(rentang string) ([]models.KategoriCapaian, error) {
	return u.repo.FindByRentangUsia(rentang)
}

func (u *kategoriCapaianUsecase) Create(data *models.KategoriCapaian) error {
	return u.repo.Create(data)
}

func (u *kategoriCapaianUsecase) Update(id uint, data *models.KategoriCapaian) error {
	existing, err := u.repo.FindByID(id)
	if err != nil {
		return err
	}
	existing.RentangUsia = data.RentangUsia
	existing.PertanyaaanCeklist = data.PertanyaaanCeklist
	existing.Aspek = data.Aspek
	return u.repo.Update(existing)
}

func (u *kategoriCapaianUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}

// ─────────────────────────────────────────────────────────
// PERAWATAN USECASE
// ─────────────────────────────────────────────────────────

type PerawatanUsecase interface {
	GetByAnakID(anakID int32) ([]models.Perawatan, error)
	GetByID(id uint) (*models.Perawatan, error)
	Create(data *models.Perawatan) error
	Update(id uint, data *models.Perawatan) error
	Delete(id uint) error
}

type perawatanUsecase struct {
	repo             repositories.PerawatanRepository
	kategoriRepo     repositories.KategoriCapaianRepository
}

func NewPerawatanUsecase(repo repositories.PerawatanRepository, kategoriRepo repositories.KategoriCapaianRepository) PerawatanUsecase {
	return &perawatanUsecase{repo, kategoriRepo}
}

func (u *perawatanUsecase) GetByAnakID(anakID int32) ([]models.Perawatan, error) {
	return u.repo.FindByAnakID(anakID)
}

func (u *perawatanUsecase) GetByID(id uint) (*models.Perawatan, error) {
	return u.repo.FindByID(id)
}

func (u *perawatanUsecase) Create(data *models.Perawatan) error {
	return u.repo.Create(data)
}

func (u *perawatanUsecase) Update(id uint, data *models.Perawatan) error {
	existing, err := u.repo.FindByID(id)
	if err != nil {
		return err
	}
	existing.Jawaban = data.Jawaban
	existing.TanggalPeriksa = data.TanggalPeriksa
	return u.repo.Update(existing)
}

func (u *perawatanUsecase) Delete(id uint) error {
	return u.repo.Delete(id)
}
