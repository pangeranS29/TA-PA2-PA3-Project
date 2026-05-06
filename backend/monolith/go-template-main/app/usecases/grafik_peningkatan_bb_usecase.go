package usecases

import (
	"errors"
	"fmt"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
)

type GrafikPeningkatanBBUsecase interface {
	Create(g *models.GrafikPeningkatanBB) error
	GetByID(id int32) (*models.GrafikPeningkatanBB, error)
	GetByKehamilanID(kehamilanID int32) ([]models.GrafikPeningkatanBB, error)
	Update(g *models.GrafikPeningkatanBB) error
	Delete(id int32) error
}

type grafikPeningkatanBBUsecase struct {
	repo          *repositories.GrafikPeningkatanBBRepository
	kehamilanRepo *repositories.KehamilanRepository
}

func NewGrafikPeningkatanBBUsecase(
	repo *repositories.GrafikPeningkatanBBRepository,
	kehamilanRepo *repositories.KehamilanRepository,
) GrafikPeningkatanBBUsecase {
	return &grafikPeningkatanBBUsecase{
		repo:          repo,
		kehamilanRepo: kehamilanRepo,
	}
}

func (u *grafikPeningkatanBBUsecase) processGrafik(g *models.GrafikPeningkatanBB) error {

	if g.KehamilanID == 0 {
		return errors.New("kehamilan_id wajib diisi")
	}
	if g.BeratBadan == nil || g.MingguKehamilan == nil {
		return errors.New("berat_badan dan minggu_kehamilan wajib diisi")
	}

	kehamilan, err := u.kehamilanRepo.FindByID(g.KehamilanID)
	if err != nil {
		return errors.New("data kehamilan tidak ditemukan")
	}

	bbAwal := kehamilan.BB_Awal
	imt := kehamilan.IMT_Awal

	var minTotal, maxTotal float64

	switch {
	case imt < 18.5:
		minTotal, maxTotal = 12.5, 18
	case imt < 25:
		minTotal, maxTotal = 11.5, 16
	case imt < 30:
		minTotal, maxTotal = 7, 11.5
	default:
		minTotal, maxTotal = 5, 9
	}

	minggu := float64(*g.MingguKehamilan)

	kenaikan := *g.BeratBadan - bbAwal

	expectedMin := minTotal * (minggu / 40)
	expectedMax := maxTotal * (minggu / 40)

	if kenaikan < expectedMin {
		kekurangan := expectedMin - kenaikan

		g.Deviasi = -kekurangan
		g.Status = "KURANG"

		g.PenjelasanHasilGrafik = fmt.Sprintf(
			"Kenaikan berat badan kurang %.2f kg dari standar",
			kekurangan,
		)

	} else if kenaikan > expectedMax {
		kelebihan := kenaikan - expectedMax

		g.Deviasi = kelebihan
		g.Status = "BERLEBIH"

		g.PenjelasanHasilGrafik = fmt.Sprintf(
			"Kenaikan berat badan berlebih %.2f kg dari standar",
			kelebihan,
		)

	} else {
		g.Deviasi = 0
		g.Status = "NORMAL"

		g.PenjelasanHasilGrafik = "Kenaikan berat badan sesuai standar"
	}

	return nil
}

// CREATE
func (u *grafikPeningkatanBBUsecase) Create(g *models.GrafikPeningkatanBB) error {

	// VALIDASI AWAL (hindari panic)
	if g.MingguKehamilan == nil {
		return errors.New("minggu_kehamilan wajib diisi")
	}

	// CEK DUPLIKAT
	existing, err := u.repo.FindByKehamilanIDAndMinggu(g.KehamilanID, *g.MingguKehamilan)
	if err != nil {
		return err
	}
	if existing != nil {
		return errors.New("data minggu ini sudah ada")
	}

	// PROCESS
	if err := u.processGrafik(g); err != nil {
		return err
	}

	return u.repo.Create(g)
}

// GET
func (u *grafikPeningkatanBBUsecase) GetByID(id int32) (*models.GrafikPeningkatanBB, error) {
	return u.repo.FindByID(id)
}

func (u *grafikPeningkatanBBUsecase) GetByKehamilanID(kehamilanID int32) ([]models.GrafikPeningkatanBB, error) {
	return u.repo.FindByKehamilanID(kehamilanID)
}

// UPDATE
func (u *grafikPeningkatanBBUsecase) Update(g *models.GrafikPeningkatanBB) error {

	existing, err := u.repo.FindByID(g.ID)
	if err != nil {
		return errors.New("data grafik peningkatan berat badan tidak ditemukan")
	}

	// 🔹 Pastikan kehamilan tidak berubah
	g.KehamilanID = existing.KehamilanID

	//  CEK DUPLIKAT MINGGU (PENTING)
	if g.MingguKehamilan != nil {
		existingMinggu, err := u.repo.FindByKehamilanIDAndMinggu(g.KehamilanID, *g.MingguKehamilan)
		if err != nil {
			return err
		}

		// pastikan bukan data yang sama
		if existingMinggu != nil && existingMinggu.ID != g.ID {
			return errors.New("data minggu ini sudah ada")
		}
	}

	if err := u.processGrafik(g); err != nil {
		return err
	}

	return u.repo.Update(g)
}

// DELETE
func (u *grafikPeningkatanBBUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
