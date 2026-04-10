package usecases

import (
	"errors"
	"fmt"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"time"
)

type NeonatusUsecase interface {
	Create(req models.CreatePelayananNeonatusRequest) error
	GetByAnakID(anakID int32) ([]models.Neonatus, error)
	GetByID(id int32)(*models.Neonatus, error)
	GetAll()([]models.Neonatus, error)
	Update(id int32, req models.UpdatePelayananKesehatanAnakRequest) error
	Delete(id int32) error
}

type PelayananNeonatusUseCase struct{
	NeonatusRepo repositories.PelayananNeonatusRepository
}


// func NewPelayananNeonatusUseCase(repo repositories.PelayananNeonatusRepository) PelayananNeonatusUseCase{
// 	return &PelayananNeonatusUseCase{NeonatusRepo: repo}
// }

func (uc *PelayananNeonatusUseCase)Create(req models.CreatePelayananNeonatusRequest) error{

	if req.AnakID ==0 {
		return errors.New("anak_id wajib di isi")
	}
	if req.PeriodeID == 0 {
		return errors.New("periode_id wajib diisi")
	}
	if req.Tanggal == "" {
		return errors.New("tanggal wajib diisi")
	}
	if len(req.DetailPelayanan) == 0 {
		return errors.New("detail pelayanan wajib diisi")
	}

	tanggal, err := time.Parse("2006-01-02", req.Tanggal)
	if err != nil {
		return fmt.Errorf("format tanggal harus YYYY-MM-DD")
	}

	now := time.Now()


	Kunjungan := models.Neonatus{
		AnakID:    req.AnakID,
		PeriodeID: req.PeriodeID,
		KategoriUmurID:  req.KategoriUmurID,
		Tanggal:   tanggal,
		TenagaKesehatanID:    req.TenagaKesehatanID,
		CreatedAt: now,
		UpdatedAt: now,
	}

	details := make([]models.DetailPelayananNeonatus, 0 , len(req.DetailPelayanan))

	for _, d:= range req.DetailPelayanan{
		details = append(details, models.DetailPelayananNeonatus{
			JenisPelayananID: d.JenisPelayananID,
			Nilai:            d.Nilai,
			Keterangan:       d.Keterangan,
			CreatedAt:        now,
			UpdatedAt:        now,
		})
	}
	fmt.Printf("Detail Final : %+v\n", details)

	Kunjungan.DetailPelayanan = details


	return uc.NeonatusRepo.Create(&Kunjungan)

}