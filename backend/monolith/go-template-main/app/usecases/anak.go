package usecases

import (
	"errors"
	"fmt"
	"time"

	"monitoring-service/app/models"
	"monitoring-service/app/repositories"

	"gorm.io/gorm"
)

type AnakUseCase struct {
	anakRepo     *repositories.AnakRepository
	pendudukRepo *repositories.KependudukanRepository
}

func NewAnakUseCase(anakRepo *repositories.AnakRepository, pendudukRepo *repositories.KependudukanRepository) *AnakUseCase {
	return &AnakUseCase{
		anakRepo:     anakRepo,
		pendudukRepo: pendudukRepo,
	}
}

// ====================== GET ======================
func (u *AnakUseCase) GetAnak(id int32) (*models.AnakResponse, error) {
	anak, err := u.anakRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("data anak tidak ditemukan")
		}
		return nil, err
	}

	resp := u.toAnakResponse(anak)
	return &resp, nil
}

// ====================== CREATE ======================
func (u *AnakUseCase) CreateAnak(req models.CreateAnakRequest) (*models.AnakResponse, error) {
	// Validasi input
	if req.KehamilanID == 0 {
		return nil, errors.New("kehamilan_id wajib diisi")
	}

	pendudukID := req.PendudukID
	if pendudukID == 0 {
		// Jika penduduk_id tidak ada, buat penduduk baru dari data yang dikirim
		if req.Nama == "" {
			return nil, errors.New("nama anak wajib diisi jika penduduk_id tidak ada")
		}

		tglLahir, _ := time.Parse("2006-01-02", req.TanggalLahir)
		// Generate NIK sementara jika tidak ada (karena NOT NULL di DB)
		nik := fmt.Sprintf("A%d", time.Now().UnixNano())

		newPenduduk := &models.Kependudukan{
			NIK:          nik,
			NamaLengkap:  req.Nama,
			JenisKelamin: req.JenisKelamin,
			TanggalLahir: tglLahir,
		}

		if err := u.pendudukRepo.Create(newPenduduk); err != nil {
			return nil, fmt.Errorf("gagal membuat data penduduk: %v", err)
		}
		pendudukID = newPenduduk.IDKependudukan
	}

	anak := &models.Anak{
		KehamilanID:   req.KehamilanID,
		PendudukID:    pendudukID,
		BeratLahirKg:  req.BeratLahirKg,
		TinggiLahirCm: req.TinggiLahirCm,
	}

	if err := u.anakRepo.Create(anak); err != nil {
		return nil, err
	}

	// Fetch complete data with relations
	createdAnak, err := u.anakRepo.FindByID(anak.ID)
	if err != nil {
		return nil, err
	}

	resp := u.toAnakResponse(createdAnak)
	return &resp, nil
}

// ====================== UPDATE ======================
func (u *AnakUseCase) UpdateAnak(id int32, req models.UpdateAnakRequest) (*models.AnakResponse, error) {
	anak, err := u.anakRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("data anak tidak ditemukan")
	}

	if req.BeratLahirKg != nil {
		anak.BeratLahirKg = req.BeratLahirKg
	}

	if req.TinggiLahirCm != nil {
		anak.TinggiLahirCm = req.TinggiLahirCm
	}

	// Update data Penduduk jika relasi ada
	if anak.Penduduk != nil {
		if req.Nama != "" {
			anak.Penduduk.NamaLengkap = req.Nama
		}
		if req.JenisKelamin != "" {
			anak.Penduduk.JenisKelamin = req.JenisKelamin
		}
		if req.TanggalLahir != "" {
			t, err := time.Parse("2006-01-02", req.TanggalLahir)
			if err == nil {
				anak.Penduduk.TanggalLahir = t
			}
		}

		if err := u.pendudukRepo.Update(anak.Penduduk); err != nil {
			return nil, err
		}
	}

	if err := u.anakRepo.Update(anak); err != nil {
		return nil, err
	}

	resp := u.toAnakResponse(anak)
	return &resp, nil
}

// ====================== DELETE ======================
func (u *AnakUseCase) DeleteAnak(id int32) error {
	return u.anakRepo.Delete(id)
}

// ====================== LIST ======================
func (u *AnakUseCase) AdminListAnak(kehamilanID int32) ([]models.AnakResponse, error) {
	var (
		list []models.Anak
		err  error
	)

	// FIX: harus dibandingkan dengan 0
	if kehamilanID != 0 {
		list, err = u.anakRepo.FindByKehamilanID(kehamilanID)
	} else {
		list, err = u.anakRepo.FindAll()
	}

	if err != nil {
		return nil, err
	}

	result := make([]models.AnakResponse, 0, len(list))

	for _, k := range list {
		resp := u.toAnakResponse(&k)
		result = append(result, resp)
	}

	return result, nil
}

// ====================== UTIL ======================
func HitungUsiaBulan(tanggalLahir time.Time) int {
	now := time.Now()

	if tanggalLahir.IsZero() || tanggalLahir.Year() < 1900 || tanggalLahir.After(now) {
		return 0
	}

	years := now.Year() - tanggalLahir.Year()
	months := int(now.Month()) - int(tanggalLahir.Month())
	total := years*12 + months

	if now.Day() < tanggalLahir.Day() {
		total--
	}

	if total < 0 {
		return 0
	}

	return total
}

func FormatUsiaTeks(bulan int) string {
	if bulan == 0 {
		return "0 bulan"
	}
	if bulan < 12 {
		return fmt.Sprintf("%d bulan", bulan)
	}

	tahun := bulan / 12
	sisa := bulan % 12

	if sisa == 0 {
		return fmt.Sprintf("%d tahun", tahun)
	}

	return fmt.Sprintf("%d tahun %d bulan", tahun, sisa)
}

func FormatLabelUsia(bulan int) string {
	if bulan == 0 {
		return "Baru Lahir (0 Bulan)"
	}
	if bulan < 12 {
		return fmt.Sprintf("%d Bulan", bulan)
	}

	tahun := bulan / 12
	sisa := bulan % 12

	if sisa == 0 {
		return fmt.Sprintf("%d Tahun", tahun)
	}

	return fmt.Sprintf("%d Tahun %d Bulan", tahun, sisa)
}

// ====================== MAPPER ======================
func (u *AnakUseCase) toAnakResponse(anak *models.Anak) models.AnakResponse {
	resp := models.AnakResponse{
		ID:            anak.ID,
		KehamilanID:   anak.KehamilanID,
		PendudukID:    anak.PendudukID,
		BeratLahirKg:  anak.BeratLahirKg,
		TinggiLahirCm: anak.TinggiLahirCm,
	}

	// Ambil data dari Penduduk (Kependudukan)
	if anak.Penduduk != nil {
		resp.Nama = anak.Penduduk.NamaLengkap
		if !anak.Penduduk.TanggalLahir.IsZero() && anak.Penduduk.TanggalLahir.Year() >= 1900 {
			resp.TanggalLahir = anak.Penduduk.TanggalLahir.Format("2006-01-02")
			// Hitung usia dari tanggal lahir penduduk
			usiaBulan := HitungUsiaBulan(anak.Penduduk.TanggalLahir)
			resp.UsiaBulan = usiaBulan
			resp.UsiaTeks = FormatUsiaTeks(usiaBulan)
		} else {
			resp.TanggalLahir = ""
			resp.UsiaBulan = 0
			resp.UsiaTeks = "-"
		}
		resp.JenisKelamin = anak.Penduduk.JenisKelamin
		resp.GolonganDarah = anak.Penduduk.GolonganDarah
	}

	// Ambil data Kehamilan
	if anak.Kehamilan != nil {
		resp.Kehamilan = &models.KehamilanSimple{
			ID: anak.Kehamilan.ID,
		}

		if anak.Kehamilan.Ibu != nil && anak.Kehamilan.Ibu.Kependudukan != nil {
			resp.Kehamilan.Ibu.NamaIbu = anak.Kehamilan.Ibu.Kependudukan.NamaLengkap
		}
	}

	// Map data Pertumbuhan
	if len(anak.Pertumbuhan) > 0 {
		resp.Pertumbuhan = make([]models.PertumbuhanSimple, 0, len(anak.Pertumbuhan))
		for _, p := range anak.Pertumbuhan {
			resp.Pertumbuhan = append(resp.Pertumbuhan, models.PertumbuhanSimple{
				Bulan:       p.UsiaUkurBulan,
				BeratBadan:  p.BeratBadan,
				TinggiBadan: p.TinggiBadan,
				HasilLila:   p.HasilLila,
			})
		}
	}

	return resp
}
