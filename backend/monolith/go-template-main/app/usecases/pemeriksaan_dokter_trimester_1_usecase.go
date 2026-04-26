package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type PemeriksaanDokterTrimester1Usecase interface {
	Create(p *models.PemeriksaanDokterTrimester1) error
	GetByID(id int32) (*models.PemeriksaanDokterTrimester1, error)
	GetMine(userID int32) (*models.PemeriksaanDokterTrimester1, error) // MODUL IBU
	GetByKehamilanID(kehamilanID int32) ([]models.PemeriksaanDokterTrimester1, error)
	Update(p *models.PemeriksaanDokterTrimester1) error
	Delete(id int32) error
}

type pemeriksaanDokterTrimester1Usecase struct {
	repo *repositories.PemeriksaanDokterTrimester1Repository
}

func NewPemeriksaanDokterTrimester1Usecase(repo *repositories.PemeriksaanDokterTrimester1Repository) PemeriksaanDokterTrimester1Usecase {
	return &pemeriksaanDokterTrimester1Usecase{repo: repo}
}

func (u *pemeriksaanDokterTrimester1Usecase) Create(p *models.PemeriksaanDokterTrimester1) error {
	if p.KehamilanID == 0 {
		return errors.New("kehamilan_id wajib diisi")
	}
	return u.repo.Create(p)
}

func (u *pemeriksaanDokterTrimester1Usecase) GetByID(id int32) (*models.PemeriksaanDokterTrimester1, error) {
	return u.repo.FindByID(id)
}

func (u *pemeriksaanDokterTrimester1Usecase) GetByKehamilanID(kehamilanID int32) ([]models.PemeriksaanDokterTrimester1, error) {
	return u.repo.FindByKehamilanID(kehamilanID)
}

func (u *pemeriksaanDokterTrimester1Usecase) Update(p *models.PemeriksaanDokterTrimester1) error {
	_, err := u.repo.FindByID(p.IDTrimester1)
	if err != nil {
		return errors.New("data pemeriksaan dokter trimester 1 tidak ditemukan")
	}
	return u.repo.Update(p)
}

func (u *pemeriksaanDokterTrimester1Usecase) Delete(id int32) error {
	return u.repo.Delete(id)
}

// MODUL IBU
func (u *pemeriksaanDokterTrimester1Usecase) GetMine(userID int32) (*models.PemeriksaanDokterTrimester1, error) {
	return u.repo.FindMineByUserID(userID)
}