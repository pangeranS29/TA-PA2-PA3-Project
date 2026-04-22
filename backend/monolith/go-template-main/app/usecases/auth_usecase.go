package usecases

import (
	"errors"
	"strconv"
	"strings"
	"time"

	"monitoring-service/app/models"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func (m *Main) Login(req models.LoginRequest) (*models.LoginResponse, error) {
	req.NomorTelepon = strings.TrimSpace(req.NomorTelepon)
	req.KataSandi = strings.TrimSpace(req.KataSandi)

	if req.NomorTelepon == "" || req.KataSandi == "" {
		return nil, errors.New("nomor_telepon dan kata_sandi wajib diisi")
	}
	if err := validateNomorTeleponIndonesia(req.NomorTelepon); err != nil {
		return nil, err
	}

	pengguna, err := m.repository.FindUserByNomorTelepon(req.NomorTelepon)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("nomor telepon atau kata sandi salah")
		}
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(pengguna.KataSandi), []byte(req.KataSandi)); err != nil {
		return nil, errors.New("nomor telepon atau kata sandi salah")
	}

	roleName := pengguna.Role.Name
	if roleName == "" {
		roleName = "unknown"
	}

	token, err := m.generateAccessToken(pengguna, roleName)
	if err != nil {
		return nil, err
	}

	return &models.LoginResponse{
		Token:               token,
		Role:                roleName,
		WajibGantiKataSandi: req.KataSandi == m.generateDefaultPassword(),
	}, nil
}

func (m *Main) Logout(actor models.AuthClaims) error {
	if actor.IDPengguna <= 0 {
		return errors.New("id_pengguna tidak valid")
	}

	return nil
}

func (m *Main) ProfileKeluarga(actor models.AuthClaims) (*models.ProfileKeluargaResponse, error) {
	idNoKK := actor.IDNoKK
	if idNoKK == nil || *idNoKK <= 0 {
		user, err := m.repository.FindUserByID(actor.IDPengguna)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, errors.New("pengguna tidak ditemukan")
			}
			return nil, err
		}
		idNoKK = user.KartuKeluargaID
	}

	if idNoKK == nil || *idNoKK <= 0 {
		return nil, errors.New("akun ini tidak terhubung ke kartu_keluarga")
	}

	anggota, err := m.repository.GetAnggotaKeluargaByKK(*idNoKK)
	if err != nil {
		return nil, err
	}

	items := make([]models.KeluargaAnggotaResponse, 0, len(anggota))
	for _, v := range anggota {
		tanggalLahir := formatTanggalLahir(v.TanggalLahir)
		items = append(items, models.KeluargaAnggotaResponse{
			IDPenduduk:        v.ID,
			NIK:               v.NIK,
			NamaLengkap:       v.NamaLengkap,
			JenisKelamin:      v.JenisKelamin,
			TanggalLahir:      tanggalLahir,
			KedudukanKeluarga: v.KedudukanKeluarga,
		})
	}

	return &models.ProfileKeluargaResponse{
		IDPengguna:      actor.IDPengguna,
		IDNoKK:          *idNoKK,
		NomorTelepon:    actor.NomorTelepon,
		Role:            actor.Role,
		AnggotaKeluarga: items,
	}, nil
}

func (m *Main) generateAccessToken(user *models.User, roleName string) (string, error) {
	secret := strings.TrimSpace(m.config.JWTSecret)
	if secret == "" {
		return "", errors.New("jwt secret belum dikonfigurasi")
	}

	now := time.Now()
	expiredAt := now.Add(time.Duration(m.config.JWTAccessTokenMins) * time.Minute)

	claims := models.AuthClaims{
		IDPengguna:      user.ID,
		IDRole:          derefInt64(user.RolesID),
		IDNoKK:          user.KartuKeluargaID,
		Role:            roleName,
		NomorTelepon:    user.NomorTelepon,
		UserID:          user.ID,
		PhoneNumber:     user.NomorTelepon,
		KartuKeluargaID: user.KartuKeluargaID,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   strconv.FormatInt(user.ID, 10),
			Issuer:    "monitoring-service",
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(expiredAt),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func (m *Main) generateDefaultPassword() string {
	return "huta_mejan123"
}

func formatTanggalLahir(tanggal *time.Time) string {
	if tanggal == nil {
		return ""
	}
	return tanggal.Format("02-01-2006")
}

func derefInt64(v *int64) int64 {
	if v == nil {
		return 0
	}
	return *v
}
