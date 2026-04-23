// usecases/kartu_keluarga_usecase.go
package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type KartuKeluargaUsecase interface {
	Create(kk *models.KartuKeluarga) error
}

type kartuKeluargaUsecase struct {
	repo *repositories.KartuKeluargaRepository
}

func NewKartuKeluargaUsecase(repo *repositories.KartuKeluargaRepository) KartuKeluargaUsecase {
	return &kartuKeluargaUsecase{repo: repo}
}

func (u *kartuKeluargaUsecase) Create(kk *models.KartuKeluarga) error {
	if kk.NoKK == "" {
		return errors.New("no_kk wajib diisi")
	}
	return u.repo.Create(kk)
}
