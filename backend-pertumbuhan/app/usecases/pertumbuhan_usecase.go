package usecases

import (
    "time"

    "backend-pertumbuhan/app/models"
    "backend-pertumbuhan/app/repositories"
)

type PertumbuhanUsecase struct {
    repo *repositories.InMemoryRepo
}

func NewPertumbuhanUsecase(r *repositories.InMemoryRepo) *PertumbuhanUsecase {
    return &PertumbuhanUsecase{repo: r}
}

func (u *PertumbuhanUsecase) AddCatatanPertumbuhan(req *models.CreatePertumbuhanRequest) error {
    t, err := time.Parse("2006-01-02", req.TglUkur)
    if err != nil {
        return err
    }
    c := &models.CatatanPertumbuhan{
        AnakID:        req.AnakID,
        TglUkur:       t,
        BeratBadan:    req.BeratBadan,
        TinggiBadan:   req.TinggiBadan,
        LingkarKepala: req.LingkarKepala,
        HasilLila:     req.HasilLila,
        CatatanNakes:  req.CatatanNakes,
    }
    // simple IMT
    if c.TinggiBadan > 0 {
        tinggiM := c.TinggiBadan / 100
        c.IMT = c.BeratBadan / (tinggiM * tinggiM)
    }
    return u.repo.CreateCatatanPertumbuhan(c)
}

func (u *PertumbuhanUsecase) GetRiwayatPertumbuhan(anakID uint) ([]models.CatatanPertumbuhan, error) {
    return u.repo.GetRiwayatPertumbuhanByAnakID(anakID)
}

func (u *PertumbuhanUsecase) UpdateCatatanPertumbuhan(id uint, req *models.UpdatePertumbuhanRequest) error {
    c, err := u.repo.GetCatatanPertumbuhanByID(id)
    if err != nil {
        return err
    }
    if req.TglUkur != "" {
        t, err := time.Parse("2006-01-02", req.TglUkur)
        if err == nil {
            c.TglUkur = t
        }
    }
    if req.BeratBadan > 0 {
        c.BeratBadan = req.BeratBadan
    }
    if req.TinggiBadan > 0 {
        c.TinggiBadan = req.TinggiBadan
    }
    if req.LingkarKepala != 0 {
        c.LingkarKepala = req.LingkarKepala
    }
    if req.HasilLila != 0 {
        c.HasilLila = req.HasilLila
    }
    if req.CatatanNakes != "" {
        c.CatatanNakes = req.CatatanNakes
    }
    if c.TinggiBadan > 0 {
        tinggiM := c.TinggiBadan / 100
        c.IMT = c.BeratBadan / (tinggiM * tinggiM)
    }
    return u.repo.UpdateCatatanPertumbuhan(c)
}

func (u *PertumbuhanUsecase) DeleteCatatanPertumbuhan(id uint) error {
    return u.repo.DeleteCatatanPertumbuhan(id)
}
