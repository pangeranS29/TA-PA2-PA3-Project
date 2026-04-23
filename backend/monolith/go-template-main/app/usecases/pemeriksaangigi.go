package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"monitoring-service/app/utils"
	"time"
)

type PemeriksaanGigiUseCase interface {
	Create(req models.CreatePemeriksaanGigiRequest) error
	Update(id int32, req models.UpdatePemeriksaanGigiRequest) error
	GetByAnakID(anakID int32) ([]models.PeriksaGigi, error)
	GetByID(id int32) (*models.PeriksaGigi, error)
	GetAll() ([]models.PeriksaGigi, error)
	Delete(id int32) error
}

type pemeriksaangigiUseCase struct {
	repo repositories.PemeriksaanGigiRepository
}

func NewPemeriksaanGigiUseCase(repo repositories.PemeriksaanGigiRepository) PemeriksaanGigiUseCase {
	return &pemeriksaangigiUseCase{repo: repo}
}

func (u *pemeriksaangigiUseCase) Create(req models.CreatePemeriksaanGigiRequest) error {

	if req.AnakID == 0 {
		return errors.New("anak_id wajib diisi")
	}

	if req.GigiBerlubang > req.Jumlahgigi {
		return errors.New("gigi berlubang tidak boleh lebih dari jumlah gigi")
	}

	exists, err := u.repo.ExistsByAnakAndBulan(req.AnakID, req.Bulanke)
	if err != nil {
		return err
	}
	if exists {
		return errors.New("data pemeriksaan bulan ini sudah ada")
	}

	now := time.Now()

	risiko := utils.HitungRisikoGigi(
		req.Bulanke,
		req.Jumlahgigi,
		req.GigiBerlubang,
		req.StatusPlak,
	)

	pemeriksaan := models.PeriksaGigi{
		AnakID:              req.AnakID,
		Bulanke:             req.Bulanke,
		Tanggal:             req.Tanggal,
		Jumlahgigi:          req.Jumlahgigi,
		GigiBerlubang:       req.GigiBerlubang,
		StatusPlak:          req.StatusPlak,
		ResikoGigiBerlubang: risiko,
		CreatedAt:           now,
		UpdatedAt:           now,
	}

	return u.repo.Create(&pemeriksaan)
}
func (u *pemeriksaangigiUseCase) Update(id int32, req models.UpdatePemeriksaanGigiRequest) error {

	now := time.Now()

	// Ambil data lama
	existing, err := u.repo.GetByID(id)
	if err != nil {
		return err
	}

	bulan := existing.Bulanke
	if req.Bulanke != nil {
		bulan = *req.Bulanke
	}

	jumlah := existing.Jumlahgigi
	if req.Jumlahgigi != nil {
		jumlah = *req.Jumlahgigi
	}

	berlubang := existing.GigiBerlubang
	if req.GigiBerlubang != nil {
		berlubang = *req.GigiBerlubang
	}

	plak := existing.StatusPlak
	if req.StatusPlak != nil {
		plak = *req.StatusPlak
	}

	if berlubang > jumlah {
		return errors.New("gigi berlubang tidak boleh lebih dari jumlah gigi")
	}

	risiko := utils.HitungRisikoGigi(bulan, jumlah, berlubang, plak)

	req.ResikoGigiBerlubang = &risiko

	return u.repo.Update(id, req, now)
}
func (u *pemeriksaangigiUseCase) GetByAnakID(anakID int32) ([]models.PeriksaGigi, error) {
	return u.repo.GetByAnakID(anakID)
}

func (u *pemeriksaangigiUseCase) GetByID(id int32) (*models.PeriksaGigi, error) {
	return u.repo.GetByID(id)
}

func (u *pemeriksaangigiUseCase) GetAll() ([]models.PeriksaGigi, error) {
	return u.repo.GetAll()
}
func (u *pemeriksaangigiUseCase) Delete(id int32) error {
	return u.repo.Delete(id)
}
