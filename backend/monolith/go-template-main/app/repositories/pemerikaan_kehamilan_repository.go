package repositories

import (
    "monitoring-service/app/models"
)

func (m *Main) GetKehamilanAktifByIbuID(ibuID int64) (*models.Kehamilan, error) {
    var kehamilan models.Kehamilan
    err := m.postgres.
        Where("ibu_id = ? AND status_kehamilan = 'Hamil' AND deleted_at IS NULL", ibuID, 1).
        First(&kehamilan).Error
    
    if err != nil {
        return nil, err
    }
    return &kehamilan, nil
}

func (m *Main) GetListPemeriksaan(kehamilanID int64) ([]models.PemeriksaanKehamilan, error) {
    var list []models.PemeriksaanKehamilan
    err := m.postgres.
        Where("kehamilan_id = ? AND deleted_at IS NULL", kehamilanID).
        Order("tanggal_periksa DESC"). 
        Find(&list).Error
    
    return list, err
}

func (m *Main) CheckKehamilanAktif(ibuID int64) (bool, error) {
    var count int64
    err := m.postgres.Model(&models.Kehamilan{}).
        Where("ibu_id = ? AND status_kehamilan = 'Hamil' AND deleted_at IS NULL", ibuID).
        Count(&count).Error
    return count > 0, err
}