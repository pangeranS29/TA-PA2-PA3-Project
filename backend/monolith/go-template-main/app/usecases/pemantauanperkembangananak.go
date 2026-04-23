package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"monitoring-service/app/utils"
	"time"
)

type PemantauanPertumbuhanAnakUseCase interface {
	Create(req models.CreatePemantauanPemeriksaanRequest) error
	Update(id int32, req models.UpdatePemantauanPemeriksaanRequest) error
	GetByAnakID(anakID int32) ([]models.DeteksiDiniPenyimpangan, error)
	GetByID(id int32) (*models.DeteksiDiniPenyimpangan, error)
	GetAll() ([]models.DeteksiDiniPenyimpangan, error)
	Delete(id int32) error
}

type pemantauanpertumbuhanUseCase struct {
	repo repositories.PemantauanPertumbuhanRepository
}

func NewPemantauanPertumbuhanUseCase(repo repositories.PemantauanPertumbuhanRepository) PemantauanPertumbuhanAnakUseCase {
	return &pemantauanpertumbuhanUseCase{repo: repo}
}

func (u *pemantauanpertumbuhanUseCase) Create(req models.CreatePemantauanPemeriksaanRequest) error {

	if req.AnakID == 0 {
		return errors.New("anak_id wajib diisi")
	}

	if req.Bulanke == 0 {
		return errors.New("bulan ke wajib diisi")
	}

	exists, err := u.repo.ExistsByAnakAndBulan(req.AnakID, req.Bulanke)
	if err != nil {
		return err
	}

	if exists {
		return errors.New("data untuk bulan ini sudah ada")
	}

	now := time.Now()

	data := models.DeteksiDiniPenyimpangan{
		AnakID:            req.AnakID,
		BulanKe:           req.Bulanke,
		Tanggal:           req.Tanggal,
		TenagaKesehatanID: req.TenagaKesehatanID,

		BBperU:  req.BBperU,
		BBperTB: req.BBperTB,
		TBperU:  req.TBperU,
		LKperU:  req.LKperU,
		LILA:    req.LILA,

		KPSP:         req.KPSP,
		TDD:          req.TDD,
		TDL:          req.TDL,
		KMPE:         req.KMPE,
		MCHATRevised: req.MCHATRevised,
		ACTRS:        req.ACTRS,
	}

	// RULE KIA
	// hasil, tindakan := utils.HasilKIA(data)
	// kunjungan := utils.HasilKIA(hasil, now)
	// kategoririsk := utils.HasilKIA(hasil)

	// data.HasilPKAT = hasil
	// data.Tindakan = tindakan
	// data.KunjunganUlang = kunjungan
	// data.TingkatResiko = kategoririsk

	hasilKIA := utils.TentukanHasilKIA(data)

	// ambil field
	data.HasilPKAT = hasilKIA.PKAT
	data.Tindakan = hasilKIA.Tindakan

	// kunjungan ulang
	data.KunjunganUlang = utils.TentukanKunjunganUlang(
		hasilKIA.PKAT,
		now,
	)

	// risk level (optional dashboard)
	data.TingkatResiko = utils.TentukanRisikoLevel(
		hasilKIA.PKAT,
		hasilKIA.Tindakan,
	)

	data.CreatedAt = now
	data.UpdatedAt = now

	return u.repo.Create(&data)
}
func (u *pemantauanpertumbuhanUseCase) Update(id int32, req models.UpdatePemantauanPemeriksaanRequest) error {
	now := time.Now()
	return u.repo.Update(id, req, now)
}
func (u *pemantauanpertumbuhanUseCase) GetByAnakID(anakID int32) ([]models.DeteksiDiniPenyimpangan, error) {
	return u.repo.GetByAnakID(anakID)
}

func (u *pemantauanpertumbuhanUseCase) GetByID(id int32) (*models.DeteksiDiniPenyimpangan, error) {
	return u.repo.GetByID(id)
}

func (u *pemantauanpertumbuhanUseCase) GetAll() ([]models.DeteksiDiniPenyimpangan, error) {
	return u.repo.GetAll()
}
func (u *pemantauanpertumbuhanUseCase) Delete(id int32) error {
	return u.repo.Delete(id)
}
