package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"time"
)

type PerkembanganAnakUseCase interface {
	GetRentangUsia() ([]models.RentangUsiaPerkembangan, error)
	GetKategoriByRentang(rentangID int32) ([]models.KategoriPerkembangan, error)
	Save(req models.LembarPerkembanganAnakRequest) error
	GetHistory(anakID, rentangID int32) ([]models.LembarPerkembanganAnak, error)
	
	// Admin
	CreateKategori(req models.KategoriPerkembangan) error
	UpdateKategori(id int32, req models.KategoriPerkembangan) error
	DeleteKategori(id int32) error
}

type perkembanganAnakUseCase struct {
	repo repositories.PerkembanganAnakRepository
}

func NewPerkembanganAnakUseCase(repo repositories.PerkembanganAnakRepository) PerkembanganAnakUseCase {
	return &perkembanganAnakUseCase{repo}
}

func (u *perkembanganAnakUseCase) GetRentangUsia() ([]models.RentangUsiaPerkembangan, error) {
	return u.repo.GetRentangUsia()
}

func (u *perkembanganAnakUseCase) GetKategoriByRentang(rentangID int32) ([]models.KategoriPerkembangan, error) {
	return u.repo.GetKategoriByRentang(rentangID)
}

func (u *perkembanganAnakUseCase) Save(req models.LembarPerkembanganAnakRequest) error {
	tgl, _ := time.Parse("2006-01-02", req.TanggalPeriksa)
	
	lembar := models.LembarPerkembanganAnak{
		AnakID:                  req.AnakID,
		RentangUsiaPerkembanganID: req.RentangUsiaPerkembanganID,
		TanggalPeriksa:          tgl,
		Pemeriksa:               req.Pemeriksa,
	}

	for _, d := range req.DetailPerkembangan {
		lembar.DetailPerkembangan = append(lembar.DetailPerkembangan, models.DetailPerkembanganAnak{
			KategoriPerkembanganID: d.KategoriPerkembanganID,
			Jawaban:                d.Jawaban,
		})
	}

	return u.repo.SaveLembar(&lembar)
}

func (u *perkembanganAnakUseCase) GetHistory(anakID, rentangID int32) ([]models.LembarPerkembanganAnak, error) {
	return u.repo.GetHistory(anakID, rentangID)
}

func (u *perkembanganAnakUseCase) CreateKategori(req models.KategoriPerkembangan) error {
	return u.repo.CreateKategori(&req)
}

func (u *perkembanganAnakUseCase) UpdateKategori(id int32, req models.KategoriPerkembangan) error {
	req.ID = id
	return u.repo.UpdateKategori(&req)
}

func (u *perkembanganAnakUseCase) DeleteKategori(id int32) error {
	return u.repo.DeleteKategori(id)
}
