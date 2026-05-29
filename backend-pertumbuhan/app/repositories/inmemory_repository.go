package repositories

import (
    "errors"
    "sync"
    "time"

    "backend-pertumbuhan/app/models"
)

type InMemoryRepo struct {
    mu sync.Mutex
    data map[uint]models.CatatanPertumbuhan
    seq uint
}

func NewInMemoryRepo() *InMemoryRepo {
    return &InMemoryRepo{data: make(map[uint]models.CatatanPertumbuhan), seq: 1}
}

func (r *InMemoryRepo) CreateCatatanPertumbuhan(c *models.CatatanPertumbuhan) error {
    r.mu.Lock()
    defer r.mu.Unlock()
    c.ID = r.seq
    c.CreatedAt = time.Now()
    r.data[r.seq] = *c
    r.seq++
    return nil
}

func (r *InMemoryRepo) GetRiwayatPertumbuhanByAnakID(anakID uint) ([]models.CatatanPertumbuhan, error) {
    r.mu.Lock()
    defer r.mu.Unlock()
    var res []models.CatatanPertumbuhan
    for _, v := range r.data {
        if v.AnakID == anakID {
            res = append(res, v)
        }
    }
    return res, nil
}

func (r *InMemoryRepo) GetCatatanPertumbuhanByID(id uint) (*models.CatatanPertumbuhan, error) {
    r.mu.Lock()
    defer r.mu.Unlock()
    v, ok := r.data[id]
    if !ok {
        return nil, errors.New("not found")
    }
    return &v, nil
}

func (r *InMemoryRepo) UpdateCatatanPertumbuhan(c *models.CatatanPertumbuhan) error {
    r.mu.Lock()
    defer r.mu.Unlock()
    _, ok := r.data[c.ID]
    if !ok {
        return errors.New("not found")
    }
    c.UpdatedAt = time.Now()
    r.data[c.ID] = *c
    return nil
}

func (r *InMemoryRepo) DeleteCatatanPertumbuhan(id uint) error {
    r.mu.Lock()
    defer r.mu.Unlock()
    _, ok := r.data[id]
    if !ok {
        return errors.New("not found")
    }
    delete(r.data, id)
    return nil
}
