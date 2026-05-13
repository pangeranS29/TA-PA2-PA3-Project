package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type PerkembanganAnakUseCase interface {
	GetRentangUsia() ([]models.RentangUsia, error)
	GetKategori(rentangID int64) ([]models.KategoriTandaSakit, error)
	Save(data interface{}) error
	GetHistory(anakID, rentangID int64) (interface{}, error)
	CreateKategori(kategori *models.KategoriTandaSakit) error
	UpdateKategori(id int64, kategori *models.KategoriTandaSakit) error
	DeleteKategori(id int64) error
}

type perkembanganAnakUseCase struct {
	repo repositories.PerkembanganAnakRepository
}

func NewPerkembanganAnakUseCase(repo repositories.PerkembanganAnakRepository) PerkembanganAnakUseCase {
	return &perkembanganAnakUseCase{repo: repo}
}

func (u *perkembanganAnakUseCase) GetRentangUsia() ([]models.RentangUsia, error) {
	return u.repo.GetRentangUsia()
}

func (u *perkembanganAnakUseCase) GetKategori(rentangID int64) ([]models.KategoriTandaSakit, error) {
	if rentangID <= 0 {
		return nil, errors.New("rentang_id harus lebih besar dari 0")
	}
	return u.repo.GetKategoriByRentangId(rentangID)
}

func (u *perkembanganAnakUseCase) Save(data interface{}) error {
	// Placeholder for saving perkembangan data
	return nil
}

func (u *perkembanganAnakUseCase) GetHistory(anakID, rentangID int64) (interface{}, error) {
	// Placeholder for getting history
	return nil, nil
}

func (u *perkembanganAnakUseCase) CreateKategori(kategori *models.KategoriTandaSakit) error {
	if kategori.RentangUsiaID == 0 {
		return errors.New("rentang_usia_id wajib diisi")
	}
	if kategori.Gejala == "" {
		return errors.New("gejala wajib diisi")
	}
	return u.repo.CreateKategori(kategori)
}

func (u *perkembanganAnakUseCase) UpdateKategori(id int64, kategori *models.KategoriTandaSakit) error {
	if id <= 0 {
		return errors.New("id harus lebih besar dari 0")
	}
	return u.repo.UpdateKategori(id, kategori)
}

func (u *perkembanganAnakUseCase) DeleteKategori(id int64) error {
	if id <= 0 {
		return errors.New("id harus lebih besar dari 0")
	}
	return u.repo.DeleteKategori(id)
}
