package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type KesehatanLingkunganDanCatatanKaderUsecase interface {
	Create(req models.CreateKesehatanLingkunganDanCatatanKaderRequest) (*models.KesehatanLingkunganDanCatatanKader, error)
	GetAll(ibuID *int32) ([]models.KesehatanLingkunganDanCatatanKader, error)
	GetByID(id uint) (*models.KesehatanLingkunganDanCatatanKader, error)
	Update(id uint, req models.CreateKesehatanLingkunganDanCatatanKaderRequest) (*models.KesehatanLingkunganDanCatatanKader, error)
	CreateCatatan(kesehatanID uint, req models.CreateCatatanKaderKesehatanLingkunganRequest) (*models.CatatanKaderKesehatanLingkungan, error)
	GetCatatanByKesehatanID(id uint) ([]models.CatatanKaderKesehatanLingkungan, error)
	UpdateCatatan(kesehatanID uint, catatanID uint, req models.CreateCatatanKaderKesehatanLingkunganRequest) (*models.CatatanKaderKesehatanLingkungan, error)
	DeleteCatatan(kesehatanID uint, catatanID uint) error
	MarkCatatanSentToMobile(kesehatanID uint, catatanID uint) (*models.CatatanKaderKesehatanLingkungan, error)
}

type kesehatanLingkunganDanCatatanKaderUsecase struct {
	repo *repositories.KesehatanLingkunganDanCatatanKaderRepository
}

func NewKesehatanLingkunganDanCatatanKaderUsecase(repo *repositories.KesehatanLingkunganDanCatatanKaderRepository) KesehatanLingkunganDanCatatanKaderUsecase {
	return &kesehatanLingkunganDanCatatanKaderUsecase{repo: repo}
}

func (u *kesehatanLingkunganDanCatatanKaderUsecase) Create(req models.CreateKesehatanLingkunganDanCatatanKaderRequest) (*models.KesehatanLingkunganDanCatatanKader, error) {
	if req.IbuID == 0 {
		return nil, errors.New("ibu_id wajib diisi")
	}

	payload := &models.KesehatanLingkunganDanCatatanKader{
		IbuID:      req.IbuID,
		Sanitasi:   req.Sanitasi,
		CuciTangan: req.CuciTangan,
		AirMakanan: req.AirMakanan,
		Sampah:     req.Sampah,
		Limbah:     req.Limbah,
	}

	if err := u.repo.Create(payload); err != nil {
		return nil, err
	}
	return payload, nil
}

func (u *kesehatanLingkunganDanCatatanKaderUsecase) GetAll(ibuID *int32) ([]models.KesehatanLingkunganDanCatatanKader, error) {
	if ibuID == nil {
		return u.repo.GetAll()
	}
	if *ibuID == 0 {
		return nil, errors.New("ibu_id tidak valid")
	}
	return u.repo.GetAllByIbuID(*ibuID)
}

func (u *kesehatanLingkunganDanCatatanKaderUsecase) GetByID(id uint) (*models.KesehatanLingkunganDanCatatanKader, error) {
	if id == 0 {
		return nil, errors.New("id tidak valid")
	}
	return u.repo.GetByID(id)
}

func (u *kesehatanLingkunganDanCatatanKaderUsecase) Update(id uint, req models.CreateKesehatanLingkunganDanCatatanKaderRequest) (*models.KesehatanLingkunganDanCatatanKader, error) {
	if id == 0 {
		return nil, errors.New("id tidak valid")
	}
	return u.repo.Update(id, &req)
}

func (u *kesehatanLingkunganDanCatatanKaderUsecase) CreateCatatan(kesehatanID uint, req models.CreateCatatanKaderKesehatanLingkunganRequest) (*models.CatatanKaderKesehatanLingkungan, error) {
	if kesehatanID == 0 {
		return nil, errors.New("id kesehatan lingkungan tidak valid")
	}
	if req.Catatan == "" {
		return nil, errors.New("catatan wajib diisi")
	}
	if err := u.repo.EnsureKesehatanExists(kesehatanID); err != nil {
		return nil, err
	}

	catatan := &models.CatatanKaderKesehatanLingkungan{
		KesehatanLingkunganID: kesehatanID,
		Catatan:               req.Catatan,
	}
	if err := u.repo.CreateCatatan(catatan); err != nil {
		return nil, err
	}
	return catatan, nil
}

func (u *kesehatanLingkunganDanCatatanKaderUsecase) GetCatatanByKesehatanID(id uint) ([]models.CatatanKaderKesehatanLingkungan, error) {
	if id == 0 {
		return nil, errors.New("id kesehatan lingkungan tidak valid")
	}
	return u.repo.GetCatatanByKesehatanID(id)
}

func (u *kesehatanLingkunganDanCatatanKaderUsecase) UpdateCatatan(kesehatanID uint, catatanID uint, req models.CreateCatatanKaderKesehatanLingkunganRequest) (*models.CatatanKaderKesehatanLingkungan, error) {
	if kesehatanID == 0 || catatanID == 0 {
		return nil, errors.New("id tidak valid")
	}
	if req.Catatan == "" {
		return nil, errors.New("catatan wajib diisi")
	}
	return u.repo.UpdateCatatan(kesehatanID, catatanID, req.Catatan)
}

func (u *kesehatanLingkunganDanCatatanKaderUsecase) DeleteCatatan(kesehatanID uint, catatanID uint) error {
	if kesehatanID == 0 || catatanID == 0 {
		return errors.New("id tidak valid")
	}
	return u.repo.DeleteCatatan(kesehatanID, catatanID)
}

func (u *kesehatanLingkunganDanCatatanKaderUsecase) MarkCatatanSentToMobile(kesehatanID uint, catatanID uint) (*models.CatatanKaderKesehatanLingkungan, error) {
	if kesehatanID == 0 || catatanID == 0 {
		return nil, errors.New("id tidak valid")
	}
	return u.repo.MarkCatatanSentToMobile(kesehatanID, catatanID)
}
