package usecases

import (
	"monitoring-service/app/models"
	"errors"
	"gorm.io/gorm"
)

func (m *Main) GetProfilMedisIbu(actor models.AuthClaims) (*models.Ibu, error) {
    user, err := m.repository.FindUserByID(actor.IDPengguna)
    if err != nil {
        return nil, err
    }

    if user.PendudukID == nil {
        return nil, errors.New("akun anda belum terhubung dengan data penduduk")
    }

    ibu, err := m.repository.GetIbuByPendudukID(*user.PendudukID)
    if err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, errors.New("data medis ibu tidak ditemukan")
        }
        return nil, err
    }

    return ibu, nil
}

func (m *Main) GetProfileLengkapIbu(actor models.AuthClaims) (map[string]interface{}, error) {
    ibu, err := m.GetProfilMedisIbu(actor) 
    if err != nil {
        return nil, err
    }

    kehamilan, err := m.repository.GetKehamilanAktifByIbuID(ibu.ID)

    result := map[string]interface{}{
        "profil_medis": ibu,
        "kehamilan":    nil, 
    }

    if err == nil {
        result["kehamilan"] = kehamilan
    }

    return result, nil
}