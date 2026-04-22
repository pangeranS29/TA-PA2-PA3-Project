package repositories

import (
	"errors"
	"strings"
	"time"

	"monitoring-service/app/models"

	"gorm.io/gorm"
)

func (m *Main) InTx(fn func(txRepo *Main) error) error {
	return m.postgres.Transaction(func(tx *gorm.DB) error {
		txRepo := &Main{postgres: tx, config: m.config}
		return fn(txRepo)
	})
}

func (m *Main) GetRoleByID(roleID int64) (*models.Role, error) {
	var role models.Role
	if err := m.postgres.Where("id = ?", roleID).First(&role).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, err
	}
	return &role, nil
}

func (m *Main) FindUserByNomorTelepon(nomorTelepon string) (*models.User, error) {
	var user models.User
	if err := m.postgres.
		Preload("Role").
		Where("nomor_telepon = ? AND isdeleted = ?", strings.TrimSpace(nomorTelepon), false).
		First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, err
	}
	return &user, nil
}

func (m *Main) FindUserByID(id int64) (*models.User, error) {
	var user models.User
	if err := m.postgres.
		Preload("Role").
		Where("id = ? AND isdeleted = ?", id, false).
		First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, err
	}
	return &user, nil
}

func (m *Main) CreateUser(user *models.User) error {
	now := time.Now()
	user.CreatedAt = &now
	user.UpdatedAt = &now
	user.IsDeleted = false

	if err := m.postgres.Create(user).Error; err != nil {
		return err
	}
	return nil
}

func (m *Main) IsNomorTeleponUsedInUsers(nomorTelepon string) (bool, error) {
	var count int64
	err := m.postgres.
		Model(&models.User{}).
		Where("nomor_telepon = ? AND isdeleted = ?", strings.TrimSpace(nomorTelepon), false).
		Count(&count).Error
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (m *Main) IsKartuKeluargaByNoKKExists(noKK int64) (bool, error) {
	var count int64
	err := m.postgres.
		Model(&models.KartuKeluarga{}).
		Where("no_kk = ?", noKK).
		Count(&count).Error
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (m *Main) GetKartuKeluargaByNoKK(noKK int64) (*models.KartuKeluarga, error) {
	var kk models.KartuKeluarga
	err := m.postgres.Where("no_kk = ?", noKK).First(&kk).Error
	if err != nil {
		return nil, err
	}

	return &kk, nil
}

func (m *Main) CreateKartuKeluarga(kk *models.KartuKeluarga) error {
	return m.postgres.Create(kk).Error
}

func (m *Main) CreatePenduduk(p *models.Penduduk) error {
	if p == nil {
		return errors.New("payload penduduk tidak valid")
	}

	if p.ID == 0 {
		var nextID int64
		if err := m.postgres.
			Model(&models.Penduduk{}).
			Select("COALESCE(MAX(id), 0) + 1").
			Scan(&nextID).Error; err != nil {
			return err
		}
		p.ID = nextID
	}

	now := time.Now()
	if p.CreatedAt == nil {
		p.CreatedAt = &now
	}
	p.UpdatedAt = &now

	return m.postgres.Create(p).Error
}

func (m *Main) GetPendudukByNIK(nik string) (*models.Penduduk, error) {
	var p models.Penduduk
	err := m.postgres.Where("nik = ?", strings.TrimSpace(nik)).First(&p).Error
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (m *Main) GetPendudukByID(id int64) (*models.Penduduk, error) {
	var p models.Penduduk
	err := m.postgres.Where("id = ?", id).First(&p).Error
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (m *Main) GetAnggotaKeluargaByKK(kartuKeluargaID int64) ([]models.Penduduk, error) {
	var anggota []models.Penduduk
	err := m.postgres.
		Where("kartu_keluarga_id = ?", kartuKeluargaID).
		Order("CASE WHEN kedudukan_keluarga = 'Kepala Keluarga' THEN 1 WHEN kedudukan_keluarga = 'Ibu' THEN 2 WHEN kedudukan_keluarga = 'Anak' THEN 3 ELSE 99 END").
		Order("nama_lengkap ASC").
		Find(&anggota).Error
	if err != nil {
		return nil, err
	}
	return anggota, nil
}

func (m *Main) GetIbuByPendudukID(idPenduduk int64) (*models.Ibu, error) {
	var ibu models.Ibu
	err := m.postgres.Where("penduduk_id = ?", idPenduduk).First(&ibu).Error
	if err != nil {
		return nil, err
	}
	return &ibu, nil
}

func (m *Main) CreateIbu(ibu *models.Ibu) error {
	return m.postgres.Create(ibu).Error
}

func (m *Main) CreateKehamilan(k *models.Kehamilan) error {
	return m.postgres.Create(k).Error
}

func (m *Main) IsAnakByPendudukExists(idPenduduk int64) (bool, error) {
	var count int64
	err := m.postgres.Model(&models.Anak{}).Where("penduduk_id = ?", idPenduduk).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (m *Main) CreateAnak(anak *models.Anak) error {
	return m.postgres.Create(anak).Error
}
