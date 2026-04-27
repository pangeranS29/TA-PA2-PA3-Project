package usecases

import (
	"errors"
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

//
// 🔥 CORE LOGIC (dipakai Create & Update)
//
func (u *grafikPeningkatanBBUsecase) processGrafik(g *models.GrafikPeningkatanBB) error {

	if g.KehamilanID == 0 {
		return errors.New("kehamilan_id wajib diisi")
	}
	if g.BeratBadan == nil || g.MingguKehamilan == nil {
		return errors.New("berat_badan dan minggu_kehamilan wajib diisi")
	}

	// 🔹 Ambil data kehamilan
	kehamilan, err := u.kehamilanRepo.FindByID(g.KehamilanID)
	if err != nil {
		return errors.New("data kehamilan tidak ditemukan")
	}

	bbAwal := kehamilan.BB_Awal
	imt := kehamilan.IMT_Awal

	// 🔹 Tentukan range berdasarkan IMT
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

	// 🔹 Hitung batas minggu
	minggu := float64(*g.MingguKehamilan)

	minMinggu := minggu * (minTotal / 40)
	maxMinggu := minggu * (maxTotal / 40)

	// 🔹 Hitung kenaikan aktual
	kenaikan := *g.BeratBadan - bbAwal

	// 🔹 Generate penjelasan
	if kenaikan < minMinggu {
		g.PenjelasanHasilGrafik = "Kenaikan berat badan kurang dari standar"
	} else if kenaikan > maxMinggu {
		g.PenjelasanHasilGrafik = "Kenaikan berat badan berlebih dari standar"
	} else {
		g.PenjelasanHasilGrafik = "Kenaikan berat badan sesuai standar"
	}

	return nil
}

//
// CREATE
//
func (u *grafikPeningkatanBBUsecase) Create(g *models.GrafikPeningkatanBB) error {
	if err := u.processGrafik(g); err != nil {
		return err
	}
	return u.repo.Create(g)
}

//
// GET
//
func (u *grafikPeningkatanBBUsecase) GetByID(id int32) (*models.GrafikPeningkatanBB, error) {
	return u.repo.FindByID(id)
}

func (u *grafikPeningkatanBBUsecase) GetByKehamilanID(kehamilanID int32) ([]models.GrafikPeningkatanBB, error) {
	return u.repo.FindByKehamilanID(kehamilanID)
}

//
// UPDATE
//
func (u *grafikPeningkatanBBUsecase) Update(g *models.GrafikPeningkatanBB) error {
	existing, err := u.repo.FindByID(g.ID)
	if err != nil {
		return errors.New("data grafik peningkatan berat badan tidak ditemukan")
	}

	// 🔹 Pastikan kehamilan tidak berubah
	g.KehamilanID = existing.KehamilanID

	if err := u.processGrafik(g); err != nil {
		return err
	}

	return u.repo.Update(g)
}

//
// DELETE
//
func (u *grafikPeningkatanBBUsecase) Delete(id int32) error {
	return u.repo.Delete(id)
}