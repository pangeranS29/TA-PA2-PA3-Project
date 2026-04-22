package usecases

import (
	"errors"
	"strconv"
	"strings"
	"unicode"

	"monitoring-service/app/models"
	"monitoring-service/app/repositories"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func normalizeNIK(raw string) string {
	return strings.TrimSpace(raw)
}

func normalizeKedudukan(raw string) string {
	return strings.ToLower(strings.TrimSpace(raw))
}

func isIbuKedudukan(raw string) bool {
	return normalizeKedudukan(raw) == "ibu"
}

func (m *Main) AdminCreateKeluargaLengkap(actor models.AuthClaims, req models.AdminCreateKeluargaLengkapRequest) (*models.AdminCreateKeluargaLengkapResponse, error) {
	if !actor.IsAparatDesa() {
		return nil, errors.New("hanya admin/superadmin/aparat_desa yang boleh membuat data keluarga")
	}

	req.NoKK = strings.TrimSpace(req.NoKK)
	req.NIKPemilikAkun = normalizeNIK(req.NIKPemilikAkun)

	if req.NoKK == "" {
		return nil, errors.New("no_kk wajib diisi")
	}
	if req.IDRolePengguna <= 0 {
		return nil, errors.New("id_role_pengguna tidak valid")
	}
	if req.NIKPemilikAkun == "" {
		return nil, errors.New("nik_pemilik_akun wajib diisi")
	}
	if len(req.Anggota) == 0 {
		return nil, errors.New("anggota wajib diisi minimal 1")
	}

	for _, ch := range req.NoKK {
		if !unicode.IsDigit(ch) {
			return nil, errors.New("no_kk hanya boleh berisi angka")
		}
	}

	noKKInt, err := strconv.ParseInt(req.NoKK, 10, 64)
	if err != nil {
		return nil, errors.New("no_kk tidak valid")
	}

	if _, err = m.repository.GetRoleByID(req.IDRolePengguna); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("role pengguna tidak ditemukan")
		}
		return nil, err
	}

	var final *models.AdminCreateKeluargaLengkapResponse
	if err := m.repository.InTx(func(txRepo *repositories.Main) error {
		res, txErr := m.adminCreateKeluargaLengkapCore(txRepo, req, noKKInt)
		if txErr != nil {
			return txErr
		}
		final = res
		return nil
	}); err != nil {
		return nil, err
	}

	return final, nil
}

func (m *Main) adminCreateKeluargaLengkapCore(txRepo *repositories.Main, req models.AdminCreateKeluargaLengkapRequest, noKKInt int64) (*models.AdminCreateKeluargaLengkapResponse, error) {
	var kk *models.KartuKeluarga
	exists, err := txRepo.IsKartuKeluargaByNoKKExists(noKKInt)
	if err != nil {
		return nil, err
	}
	if exists {
		kk, err = txRepo.GetKartuKeluargaByNoKK(noKKInt)
		if err != nil {
			return nil, err
		}
	} else {
		entity := &models.KartuKeluarga{NoKK: &noKKInt}
		if err = txRepo.CreateKartuKeluarga(entity); err != nil {
			return nil, err
		}
		kk = entity
	}

	nikToPendudukID := make(map[string]int64)
	nikToIbuID := make(map[string]int64)
	ibuToKehamilanID := make(map[int64]int64)

	var idPendudukPemilik int64
	var namaPemilik string
	var nomorTeleponPemilik string

	for _, anggota := range req.Anggota {
		nik := normalizeNIK(anggota.NIK)
		if nik == "" {
			return nil, errors.New("nik anggota wajib diisi")
		}
		if _, dup := nikToPendudukID[nik]; dup {
			return nil, errors.New("nik anggota duplikat dalam payload")
		}

		penduduk := &models.Penduduk{
			KartuKeluargaID:    &kk.ID,
			NIK:                nik,
			NomorTelepon:       strings.TrimSpace(anggota.NomorTelepon),
			NamaLengkap:        strings.TrimSpace(anggota.NamaLengkap),
			JenisKelamin:       strings.TrimSpace(anggota.JenisKelamin),
			TanggalLahir:       anggota.TanggalLahir,
			TempatLahir:        strings.TrimSpace(anggota.TempatLahir),
			GolonganDarah:      strings.TrimSpace(anggota.GolonganDarah),
			Agama:              strings.TrimSpace(anggota.Agama),
			StatusPerkawinan:   strings.TrimSpace(anggota.StatusPerkawinan),
			PendidikanTerakhir: strings.TrimSpace(anggota.PendidikanTerakhir),
			Pekerjaan:          strings.TrimSpace(anggota.Pekerjaan),
			BacaHuruf:          strings.TrimSpace(anggota.BacaHuruf),
			KedudukanKeluarga:  strings.TrimSpace(anggota.KedudukanKeluarga),
			Dusun:              strings.TrimSpace(anggota.Dusun),
			TanggalPenambahan:  anggota.TanggalPenambahan,
			AsalPenduduk:       strings.TrimSpace(anggota.AsalPenduduk),
			TanggalPengurangan: anggota.TanggalPengurangan,
			TujuanPindah:       strings.TrimSpace(anggota.TujuanPindah),
			TempatMeninggal:    strings.TrimSpace(anggota.TempatMeninggal),
			Keterangan:         strings.TrimSpace(anggota.Keterangan),
		}

		if penduduk.NamaLengkap == "" || penduduk.JenisKelamin == "" || penduduk.KedudukanKeluarga == "" {
			return nil, errors.New("nama_lengkap, jenis_kelamin, dan kedudukan_keluarga wajib diisi")
		}

		if existing, gErr := txRepo.GetPendudukByNIK(nik); gErr == nil && existing != nil {
			return nil, errors.New("nik sudah terdaftar")
		} else if gErr != nil && !errors.Is(gErr, gorm.ErrRecordNotFound) {
			return nil, gErr
		}

		if err := txRepo.CreatePenduduk(penduduk); err != nil {
			return nil, err
		}

		nikToPendudukID[nik] = penduduk.ID

		if isIbuKedudukan(anggota.KedudukanKeluarga) {
			ibu := &models.Ibu{PendudukID: penduduk.ID}
			if err := txRepo.CreateIbu(ibu); err != nil {
				return nil, err
			}
			nikToIbuID[nik] = ibu.ID
		}

		if nik == req.NIKPemilikAkun {
			idPendudukPemilik = penduduk.ID
			namaPemilik = penduduk.NamaLengkap
			nomorTeleponPemilik = penduduk.NomorTelepon
		}
	}

	if idPendudukPemilik <= 0 {
		return nil, errors.New("nik_pemilik_akun tidak ditemukan pada anggota")
	}
	if nomorTeleponPemilik == "" {
		return nil, errors.New("nomor telepon pemilik akun wajib diisi")
	}
	if err := validateNomorTeleponIndonesia(nomorTeleponPemilik); err != nil {
		return nil, err
	}

	isUsed, err := txRepo.IsNomorTeleponUsedInUsers(nomorTeleponPemilik)
	if err != nil {
		return nil, err
	}
	if isUsed {
		return nil, errors.New("nomor telepon sudah digunakan")
	}

	defaultPassword := m.generateDefaultPassword()
	hash, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	roleID := req.IDRolePengguna
	pengguna := &models.User{
		PendudukID:      &idPendudukPemilik,
		NomorTelepon:    nomorTeleponPemilik,
		KataSandi:       string(hash),
		RolesID:         &roleID,
		KartuKeluargaID: &kk.ID,
	}
	if err := txRepo.CreateUser(pengguna); err != nil {
		return nil, err
	}

	jumlahRelasiAnak := 0
	for _, anggota := range req.Anggota {
		nikIbu := normalizeNIK(anggota.NIKIbu)
		if nikIbu == "" {
			continue
		}

		nikAnak := normalizeNIK(anggota.NIK)
		idPendudukAnak, okAnak := nikToPendudukID[nikAnak]
		if !okAnak {
			return nil, errors.New("relasi anak tidak valid: nik anak tidak ditemukan")
		}

		if existsAnak, err := txRepo.IsAnakByPendudukExists(idPendudukAnak); err != nil {
			return nil, err
		} else if existsAnak {
			continue
		}

		idIbu, okIbu := nikToIbuID[nikIbu]
		if !okIbu {
			return nil, errors.New("relasi anak tidak valid: nik_ibu tidak ditemukan atau bukan ibu")
		}

		kehamilanID, existsKehamilan := ibuToKehamilanID[idIbu]
		if !existsKehamilan {
			kehamilan := &models.Kehamilan{IbuID: idIbu}
			if err := txRepo.CreateKehamilan(kehamilan); err != nil {
				return nil, err
			}
			kehamilanID = kehamilan.ID
			ibuToKehamilanID[idIbu] = kehamilanID
		}

		anak := &models.Anak{KehamilanID: kehamilanID, PendudukID: &idPendudukAnak}
		if err := txRepo.CreateAnak(anak); err != nil {
			return nil, err
		}
		jumlahRelasiAnak++
	}

	return &models.AdminCreateKeluargaLengkapResponse{
		IDNoKK:                kk.ID,
		NoKK:                  strconv.FormatInt(noKKInt, 10),
		JumlahAnggota:         len(req.Anggota),
		JumlahRelasiAnak:      jumlahRelasiAnak,
		IDPengguna:            pengguna.ID,
		IDPendudukPemilikAkun: idPendudukPemilik,
		NamaPemilikAkun:       namaPemilik,
		NomorTeleponAkun:      nomorTeleponPemilik,
		PasswordDefault:       defaultPassword,
	}, nil
}
