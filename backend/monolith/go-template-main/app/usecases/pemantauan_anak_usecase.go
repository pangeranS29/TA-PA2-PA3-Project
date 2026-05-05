package usecases

import (
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"time"
)

type PemantauanAnakUseCase interface {
	SavePemantauan(req *models.LembarPemantauanAnakRequest) error
	GetHistory(anakID int32, rentangID int32) ([]models.LembarPemantauanAnak, error)
	GetRentangUsia() ([]models.RentangUsia, error)
	GetKategoriByRentang(rentangID int32) ([]models.KategoriTandaSakit, error)
	DeletePemantauan(id int32) error
	CreateKategori(data *models.KategoriTandaSakit) error
	UpdateKategori(id int32, data *models.KategoriTandaSakit) error
	DeleteKategori(id int32) error
}

type pemantauanAnakUseCase struct {
	repo repositories.PemantauanAnakRepository
}

func NewPemantauanAnakUseCase(repo repositories.PemantauanAnakRepository) PemantauanAnakUseCase {
	return &pemantauanAnakUseCase{repo}
}

func (u *pemantauanAnakUseCase) SavePemantauan(req *models.LembarPemantauanAnakRequest) error {
	tgl, err := time.Parse("2006-01-02", req.TanggalPeriksa)
	if err != nil {
		return err
	}

	details := make([]models.DetailPemantauanAnak, len(req.DetailGejala))
	for i, d := range req.DetailGejala {
		details[i] = models.DetailPemantauanAnak{
			KategoriTandaSakitID: d.KategoriTandaSakitID,
			IsTerjadi:            d.IsTerjadi,
		}
	}

	existing, _ := u.repo.GetByPeriode(req.AnakID, req.RentangUsiaID, req.PeriodeWaktu)
	if existing != nil {
		existing.TanggalPeriksa = tgl
		existing.Pemeriksa = req.Pemeriksa
		existing.DetailGejala = details
		return u.repo.Update(existing)
	}

	record := &models.LembarPemantauanAnak{
		AnakID:         req.AnakID,
		RentangUsiaID:  req.RentangUsiaID,
		PeriodeWaktu:   req.PeriodeWaktu,
		TanggalPeriksa: tgl,
		Pemeriksa:      req.Pemeriksa,
		DetailGejala:   details,
	}

	return u.repo.Create(record)
}

func (u *pemantauanAnakUseCase) GetHistory(anakID int32, rentangID int32) ([]models.LembarPemantauanAnak, error) {
	return u.repo.FindByChildAndRange(anakID, rentangID)
}

func (u *pemantauanAnakUseCase) GetRentangUsia() ([]models.RentangUsia, error) {
	return u.repo.GetRentangUsia()
}

func (u *pemantauanAnakUseCase) GetKategoriByRentang(rentangID int32) ([]models.KategoriTandaSakit, error) {
	return u.repo.GetKategoriByRentang(rentangID)
}

func (u *pemantauanAnakUseCase) DeletePemantauan(id int32) error {
	return u.repo.Delete(id)
}

func (u *pemantauanAnakUseCase) CreateKategori(data *models.KategoriTandaSakit) error {
	return u.repo.CreateKategori(data)
}

func (u *pemantauanAnakUseCase) UpdateKategori(id int32, data *models.KategoriTandaSakit) error {
	data.ID = id
	return u.repo.UpdateKategori(data)
}

func (u *pemantauanAnakUseCase) DeleteKategori(id int32) error {
	return u.repo.DeleteKategori(id)
}
