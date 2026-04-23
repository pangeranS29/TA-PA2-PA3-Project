package usecases

import (
	"errors"
	"monitoring-service/app/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func (m *Main) AdminCreateAkunPenduduk(actor models.AuthClaims, req models.AdminCreateAkunPendudukRequest) (*models.AdminCreateAkunPendudukResponse, error) {
	if !actor.IsAparatDesa() {
		return nil, errors.New("hanya admin/superadmin/aparat_desa yang boleh membuat akun penduduk")
	}

	req.NIKPenduduk = normalizeNIK(req.NIKPenduduk)
	if req.NIKPenduduk == "" {
		return nil, errors.New("nik_penduduk wajib diisi")
	}
	if req.IDRolePengguna <= 0 {
		return nil, errors.New("id_role_pengguna tidak valid")
	}

	// Cek role ada
	if _, err := m.repository.GetRoleByID(req.IDRolePengguna); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("role tidak ditemukan")
		}
		return nil, err
	}

	// Cari penduduk berdasarkan NIK
	penduduk, err := m.repository.GetPendudukByNIK(req.NIKPenduduk)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("penduduk dengan NIK tersebut tidak ditemukan")
		}
		return nil, err
	}

	// Pastikan nomor telepon penduduk ada
	if penduduk.NomorTelepon == "" {
		return nil, errors.New("penduduk tidak memiliki nomor telepon, tidak bisa dibuat akun")
	}
	if err := validateNomorTeleponIndonesia(penduduk.NomorTelepon); err != nil {
		return nil, err
	}

	// Cek apakah penduduk sudah punya akun aktif
	existingUser, err := m.repository.GetUserByPendudukID(penduduk.ID)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("penduduk ini sudah memiliki akun aktif")
	}

	// Cek nomor telepon belum dipakai akun lain
	isUsed, err := m.repository.IsNomorTeleponUsedInUsers(penduduk.NomorTelepon)
	if err != nil {
		return nil, err
	}
	if isUsed {
		return nil, errors.New("nomor telepon sudah digunakan akun lain")
	}

	// Buat akun
	defaultPassword := m.generateDefaultPassword()
	hash, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	roleID := req.IDRolePengguna
	pengguna := &models.User{
		PendudukID:   &penduduk.ID,
		NomorTelepon: penduduk.NomorTelepon,
		KataSandi:    string(hash),
		RolesID:      &roleID,
	}
	if err := m.repository.CreateUser(pengguna); err != nil {
		return nil, err
	}

	return &models.AdminCreateAkunPendudukResponse{
		IDPengguna:      pengguna.ID,
		IDPenduduk:      penduduk.ID,
		NamaPenduduk:    penduduk.NamaLengkap,
		NomorTelepon:    penduduk.NomorTelepon,
		PasswordDefault: defaultPassword,
	}, nil
}
