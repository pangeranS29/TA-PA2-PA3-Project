package models

import (
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type LoginRequest struct {
	NomorTelepon string `json:"nomor_telepon"`
	KataSandi    string `json:"kata_sandi"`
}

type LoginResponse struct {
	Token               string `json:"token"`
	Role                string `json:"role"`
	WajibGantiKataSandi bool   `json:"wajib_ganti_kata_sandi"`
}

type KeluargaAnggotaResponse struct {
	IDPenduduk        int64  `json:"id_penduduk"`
	NIK               string `json:"nik"`
	NamaLengkap       string `json:"nama_lengkap"`
	JenisKelamin      string `json:"jenis_kelamin"`
	TanggalLahir      string `json:"tanggal_lahir,omitempty"`
	KedudukanKeluarga string `json:"kedudukan_keluarga"`
}

type ProfileKeluargaResponse struct {
	IDPengguna      int64                     `json:"id_pengguna"`
	IDNoKK          int64                     `json:"id_no_kk"`
	NomorTelepon    string                    `json:"nomor_telepon"`
	Role            string                    `json:"role"`
	AnggotaKeluarga []KeluargaAnggotaResponse `json:"anggota_keluarga"`
}

type MeResponse struct {
	UserID        int64  `json:"user_id"`
	Email         string `json:"email"`
	PhoneNumber   string `json:"phone_number"`
	Role          string `json:"role"`
	TargetApp     string `json:"target_app"`
	RedirectRoute string `json:"redirect_route"`
}

type AuthClaims struct {
	IDPengguna    int64  `json:"id_pengguna"`
	IDRole        int64  `json:"id_role"`
	IDNoKK        *int64 `json:"id_no_kk,omitempty"`
	Role          string `json:"role"`
	NomorTelepon  string `json:"nomor_telepon"`
	UserID        int64  `json:"user_id"`
	Email         string `json:"email"`
	PhoneNumber   string `json:"phone_number"`
	TargetApp     string `json:"target_app"`
	RedirectRoute string `json:"redirect_route"`
	jwt.RegisteredClaims
}

func (a AuthClaims) IsAparatDesa() bool {
	role := strings.ToLower(strings.TrimSpace(a.Role))
	return role == "aparat_desa" || role == "admin" || role == "superadmin"
}
