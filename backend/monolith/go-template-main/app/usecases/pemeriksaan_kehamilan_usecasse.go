package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"gorm.io/gorm"
)

func (m *Main) GetRiwayatPemeriksaanIbu(actor models.AuthClaims) ([]models.PemeriksaanKehamilan, error) {
	if actor.IDPengguna <= 0 {
		return nil, errors.New("sesi tidak valid, silakan login kembali")
	}

	user, err := m.repository.FindUserByID(actor.IDPengguna)
	if err != nil {
		return nil, errors.New("data pengguna tidak ditemukan")
	}

	if user.PendudukID == nil {
		return nil, errors.New("akun anda belum terhubung dengan data kependudukan")
	}

	ibu, err := m.repository.GetIbuByPendudukID(*user.PendudukID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("data ibu tidak ditemukan")
		}
		return nil, err
	}

	// Cari kehamilan aktif
	kehamilan, err := m.repository.GetKehamilanAktifByIbuID(ibu.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []models.PemeriksaanKehamilan{}, nil
		}
		return nil, err
	}

	pemeriksaan, err := m.repository.GetListPemeriksaan(kehamilan.ID)
	if err != nil {
		return nil, err
	}

	return pemeriksaan, nil
}
