package usecases

import (
	"errors"
	"time"

	"monitoring-service/app/models"
	"monitoring-service/app/repositories"

	"golang.org/x/crypto/bcrypt"
)

type RegisterOrangTuaRequest struct {
	NoKK               string `json:"no_kk"`
	TanggalTerbit      string `json:"tanggal_terbit"`
	NIK                string `json:"nik"`
	Dusun              string `json:"dusun"`
	NamaLengkap        string `json:"nama_lengkap"`
	GolonganDarah      string `json:"golongan_darah"`
	JenisKelamin       string `json:"jenis_kelamin"`
	TempatLahir        string `json:"tempat_lahir"`
	TanggalLahir       string `json:"tanggal_lahir"`
	Pekerjaan          string `json:"pekerjaan"`
	PendidikanTerakhir string `json:"pendidikan_terakhir"`
	Username           string `json:"username"`
	Email              string `json:"email"`
	Password           string `json:"password"`
	PhoneNumber        string `json:"phone_number"`
}

type RegisterOrangTuaUsecase struct {
	userRepo     *repositories.UserRepository
	roleRepo     *repositories.RoleRepository
	kkRepo       *repositories.KartuKeluargaRepository
	pendudukRepo *repositories.PendudukRepository
	ibuRepo      *repositories.IbuRepository
}

func NewRegisterOrangTuaUsecase(
	userRepo *repositories.UserRepository,
	roleRepo *repositories.RoleRepository,
	kkRepo *repositories.KartuKeluargaRepository,
	pendudukRepo *repositories.PendudukRepository,
	ibuRepo *repositories.IbuRepository,
) *RegisterOrangTuaUsecase {
	return &RegisterOrangTuaUsecase{
		userRepo:     userRepo,
		roleRepo:     roleRepo,
		kkRepo:       kkRepo,
		pendudukRepo: pendudukRepo,
		ibuRepo:      ibuRepo,
	}
}

// func (u *RegisterOrangTuaUsecase) Register(req *RegisterOrangTuaRequest) error {
// 	// Validasi input
// 	if req.NoKK == "" || req.NIK == "" || req.NamaLengkap == "" || req.Username == "" || req.Email == "" || req.Password == "" {
// 		return errors.New("semua field wajib diisi")
// 	}

	// Cek username/email/phone sudah terdaftar
	if _, err := u.userRepo.FindByUsername(req.Username); err == nil {
		return errors.New("username sudah terdaftar")
	}
	if _, err := u.userRepo.FindByEmail(req.Email); err == nil {
		return errors.New("email sudah terdaftar")
	}
	if _, err := u.userRepo.FindByPhoneNumber(req.PhoneNumber); err == nil {
		return errors.New("nomor telepon sudah terdaftar")
	}

	// Cek NoKK sudah terdaftar
	if _, err := u.kkRepo.FindByNoKK(req.NoKK); err == nil {
		return errors.New("nomor KK sudah terdaftar")
	}

	// Cek NIK sudah terdaftar
	if _, err := u.pendudukRepo.FindByNIK(req.NIK); err == nil {
		return errors.New("NIK sudah terdaftar")
	}
// 	// Ambil role "Orangtua"
// 	role, err := u.roleRepo.FindByName("Orangtua")
// 	if err != nil {
// 		return errors.New("role Orangtua tidak ditemukan")
// 	}

// 	// Hash password
// 	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
// 	if err != nil {
// 		return err
// 	}

// 	// Buat user
// 	user := &models.User{
// 		RoleID:      role.ID,
// 		Name:        req.Username,
// 		Email:       req.Email,
// 		Password:    string(hashedPassword),
// 		PhoneNumber: req.PhoneNumber,
// 		CreatedAt:   time.Now(),
// 		UpdatedAt:   time.Now(),
// 	}
// 	if err := u.userRepo.Create(user); err != nil {
// 		return err
// 	}

	// Buat Kartu Keluarga (IDUser sebagai pointer)
	var tanggalTerbit *time.Time
	if req.TanggalTerbit != "" {
		t, err := time.Parse("2006-01-02", req.TanggalTerbit)
		if err == nil {
			tanggalTerbit = &t
		}
	}
	kk := &models.KartuKeluarga{
		NoKK:          req.NoKK,
		IDUser:        &user.ID, // perbaikan: ambil alamat user.ID
		TanggalTerbit: tanggalTerbit,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}
	if err := u.kkRepo.Create(kk); err != nil {
		return err
	}

	// Buat data penduduk, hubungkan dengan kartu keluarga
	tanggalLahir, err := time.Parse("2006-01-02", req.TanggalLahir)
	if err != nil {
		return errors.New("format tanggal lahir tidak valid")
	}
	penduduk := &models.Penduduk{
		KartuKeluargaID:    &kk.ID, // tautkan ke kartu keluarga yang baru dibuat
		NIK:                &req.NIK,
		NamaLengkap:        &req.NamaLengkap,
		JenisKelamin:       &req.JenisKelamin,
		TanggalLahir:       &tanggalLahir,
		TempatLahir:        &req.TempatLahir,
		GolonganDarah:      &req.GolonganDarah,
		Pekerjaan:          &req.Pekerjaan,
		PendidikanTerakhir: &req.PendidikanTerakhir,
		Dusun:              &req.Dusun,
		NomorTelepon:       &req.PhoneNumber,
		CreatedAt:          &[]time.Time{time.Now()}[0],
		UpdatedAt:          &[]time.Time{time.Now()}[0],
	}
	if err := u.pendudukRepo.Create(penduduk); err != nil {
		return err
	}

	// Buat data ibu
	ibu := &models.Ibu{
		PendudukID: penduduk.ID,
		CreatedAt:  &[]time.Time{time.Now()}[0],
		UpdatedAt:  &[]time.Time{time.Now()}[0],
	}
	if err := u.ibuRepo.Create(ibu); err != nil {
		return err
	}

// 	return nil
// }
