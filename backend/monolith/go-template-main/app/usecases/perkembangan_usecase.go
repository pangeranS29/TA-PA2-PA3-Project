package usecases

import (
	"strconv"
	"strings"

	"monitoring-service/app/models"
	"monitoring-service/pkg/customerror"
)

// ============= Kategori Capaian Usecases =============

func mapKategoriCapaianToResponse(data models.KategoriCapaian) models.KategoriCapaian {
	return data
}

func mapKategoriCapaianListToResponse(data []models.KategoriCapaian) []models.KategoriCapaian {
	res := make([]models.KategoriCapaian, 0, len(data))
	for _, val := range data {
		res = append(res, mapKategoriCapaianToResponse(val))
	}
	return res
}

func (m *Main) GetAllKategoriCapaian() ([]models.KategoriCapaian, error) {
	data, err := m.repository.GetAllKategoriCapaian()
	if err != nil {
		return nil, err
	}

	return mapKategoriCapaianListToResponse(data), nil
}

func (m *Main) GetKategoriCapaianById(kategoriCapaianID string) (*models.KategoriCapaian, error) {
	id, err := strconv.ParseUint(strings.TrimSpace(kategoriCapaianID), 10, 64)
	if err != nil || id == 0 {
		return nil, customerror.NewBadRequestError("kategori_capaian_id tidak valid")
	}

	data, err := m.repository.GetKategoriCapaianByID(uint(id))
	if err != nil {
		return nil, err
	}

	res := mapKategoriCapaianToResponse(*data)
	return &res, nil
}

func (m *Main) CreateKategoriCapaian(req *models.KategoriCapaian) (*models.KategoriCapaian, error) {
	if req == nil {
		return nil, customerror.NewBadRequestError("data kategori capaian tidak boleh kosong")
	}

	rentangUsia := strings.TrimSpace(req.RentangUsia)
	// tipeLembar := strings.TrimSpace(req.TipeLembarCapaian)
	pertanyaan := strings.TrimSpace(req.PertanyaaanCeklist)
	aspek := strings.TrimSpace(req.Aspek)

	if rentangUsia == "" || /* tipeLembar == "" || */ pertanyaan == "" || aspek == "" {
		return nil, customerror.NewBadRequestError("rentang_usia, tipe_lembar_capaian, pertanyaan_ceklist, dan aspek wajib diisi")
	}

	kategori := &models.KategoriCapaian{
		RentangUsia: rentangUsia,
		// TipeLembarCapaian:  tipeLembar,
		PertanyaaanCeklist: pertanyaan,
		Aspek:              aspek,
	}

	err := m.repository.CreateKategoriCapaian(kategori)
	if err != nil {
		return nil, err
	}

	res := mapKategoriCapaianToResponse(*kategori)
	return &res, nil
}

func (m *Main) UpdateKategoriCapaian(kategoriCapaianID string, req *models.KategoriCapaian) (*models.KategoriCapaian, error) {
	id, err := strconv.ParseUint(strings.TrimSpace(kategoriCapaianID), 10, 64)
	if err != nil || id == 0 {
		return nil, customerror.NewBadRequestError("kategori_capaian_id tidak valid")
	}

	if req == nil {
		return nil, customerror.NewBadRequestError("data kategori capaian tidak boleh kosong")
	}

	existing, err := m.repository.GetKategoriCapaianByID(uint(id))
	if err != nil {
		return nil, err
	}

	if rentangUsia := strings.TrimSpace(req.RentangUsia); rentangUsia != "" {
		existing.RentangUsia = rentangUsia
	}
	// if tipeLembar := strings.TrimSpace(req.TipeLembarCapaian); tipeLembar != "" {
	// 	existing.TipeLembarCapaian = tipeLembar
	// }
	if pertanyaan := strings.TrimSpace(req.PertanyaaanCeklist); pertanyaan != "" {
		existing.PertanyaaanCeklist = pertanyaan
	}
	if aspek := strings.TrimSpace(req.Aspek); aspek != "" {
		existing.Aspek = aspek
	}

	err = m.repository.UpdateKategoriCapaian(existing)
	if err != nil {
		return nil, err
	}

	res := mapKategoriCapaianToResponse(*existing)
	return &res, nil
}

func (m *Main) DeleteKategoriCapaian(kategoriCapaianID string) error {
	id, err := strconv.ParseUint(strings.TrimSpace(kategoriCapaianID), 10, 64)
	if err != nil || id == 0 {
		return customerror.NewBadRequestError("kategori_capaian_id tidak valid")
	}

	_, err = m.repository.GetKategoriCapaianByID(uint(id))
	if err != nil {
		return err
	}

	return m.repository.DeleteKategoriCapaian(uint(id))
}

func (m *Main) GetKategoriCapaianByRentangUsia(rentangUsia string) ([]models.KategoriCapaian, error) {
	rentangUsia = strings.TrimSpace(rentangUsia)

	data, err := m.repository.GetKategoriCapaianByRentangUsia(rentangUsia)
	if err != nil {
		return nil, err
	}

	return mapKategoriCapaianListToResponse(data), nil
}

// ============= Perkembangan Usecases =============

type PerkembanganResponse struct {
	ID                uint                    `json:"id"`
	AnakID            int                     `json:"anak_id"`
	KategoriCapaianID int                     `json:"kategori_capaian_id"`
	Jawaban           *bool                   `json:"jawaban,omitempty"`
	TanggalPeriksa    *string                 `json:"tanggal_periksa,omitempty"`
	CreatedAt         string                  `json:"created_at"`
	UpdatedAt         string                  `json:"updated_at"`
	Anak              *models.AnakResponse    `json:"anak,omitempty"`
	KategoriCapaian   *models.KategoriCapaian `json:"kategori_capaian,omitempty"`
}

func mapPerkembanganToResponse(data models.Perkembangan) PerkembanganResponse {
	var anakRes *models.AnakResponse
	if data.Anak != nil {
		// anakResp := models.AnakResponse{
		// 	ID:              data.Anak.ID,
		// 	IbuID:           data.Anak.IbuID,
		// 	KependudukanID:  data.Anak.KependudukanID,
		// 	NoKartuKeluarga: data.Anak.NoKartuKeluarga,
		// 	NamaAnak:        data.Anak.NamaAnak,
		// 	JenisKelamin:    data.Anak.JenisKelamin,
		// 	TanggalLahir:    data.Anak.TanggalLahir,
		// 	BeratLahir:      data.Anak.BeratLahir,
		// 	TinggiLahir:     data.Anak.TinggiLahir,
		// }
		// anakRes = &anakResp
	}

	var tanggalPeriksa *string
	if data.TanggalPeriksa != nil {
		tanggalStr := data.TanggalPeriksa.Format("2006-01-02 15:04:05")
		tanggalPeriksa = &tanggalStr
	}

	var jawaban *bool
	if data.Jawaban != nil {
		jawaban = data.Jawaban
	}

	return PerkembanganResponse{
		ID:                data.ID,
		AnakID:            data.AnakID,
		KategoriCapaianID: data.KategoriCapaianID,
		Jawaban:           jawaban,
		TanggalPeriksa:    tanggalPeriksa,
		CreatedAt:         data.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:         data.UpdatedAt.Format("2006-01-02 15:04:05"),
		Anak:              anakRes,
		KategoriCapaian:   data.KategoriCapaian,
	}
}

func mapPerkembanganListToResponse(data []models.Perkembangan) []PerkembanganResponse {
	res := make([]PerkembanganResponse, 0, len(data))
	for _, val := range data {
		res = append(res, mapPerkembanganToResponse(val))
	}
	return res
}

func (m *Main) GetAllPerkembangan() ([]PerkembanganResponse, error) {
	data, err := m.repository.GetAllPerkembangan()
	if err != nil {
		return nil, err
	}

	return mapPerkembanganListToResponse(data), nil
}

func (m *Main) GetPerkembanganById(perkembanganID string) (*PerkembanganResponse, error) {
	id, err := strconv.ParseUint(strings.TrimSpace(perkembanganID), 10, 64)
	if err != nil || id == 0 {
		return nil, customerror.NewBadRequestError("perkembangan_id tidak valid")
	}

	data, err := m.repository.GetPerkembanganByID(uint(id))
	if err != nil {
		return nil, err
	}

	res := mapPerkembanganToResponse(*data)
	return &res, nil
}

func (m *Main) GetPerkembanganByAnakId(anakID string) ([]PerkembanganResponse, error) {
	id, err := strconv.ParseUint(strings.TrimSpace(anakID), 10, 64)
	if err != nil || id == 0 {
		return nil, customerror.NewBadRequestError("anak_id tidak valid")
	}

	// Verify anak exists
	if _, err := m.repository.GetAnakByID(uint(id)); err != nil {
		return nil, err
	}

	data, err := m.repository.GetPerkembanganByAnakID(uint(id))
	if err != nil {
		return nil, err
	}

	return mapPerkembanganListToResponse(data), nil
}

func (m *Main) GetPerkembanganByAnakIdAndKategoriId(anakID, kategoriCapaianID string) ([]PerkembanganResponse, error) {
	anakIdUint, err := strconv.ParseUint(strings.TrimSpace(anakID), 10, 64)
	if err != nil || anakIdUint == 0 {
		return nil, customerror.NewBadRequestError("anak_id tidak valid")
	}

	kategoriIdUint, err := strconv.ParseUint(strings.TrimSpace(kategoriCapaianID), 10, 64)
	if err != nil || kategoriIdUint == 0 {
		return nil, customerror.NewBadRequestError("kategori_capaian_id tidak valid")
	}

	// Verify anak exists
	if _, err := m.repository.GetAnakByID(uint(anakIdUint)); err != nil {
		return nil, err
	}

	// Verify kategori capaian exists
	if _, err := m.repository.GetKategoriCapaianByID(uint(kategoriIdUint)); err != nil {
		return nil, err
	}

	data, err := m.repository.GetPerkembanganByAnakIDAndKategoriID(uint(anakIdUint), uint(kategoriIdUint))
	if err != nil {
		return nil, err
	}

	return mapPerkembanganListToResponse(data), nil
}

func (m *Main) CreatePerkembangan(req *models.Perkembangan) (*PerkembanganResponse, error) {
	if req == nil {
		return nil, customerror.NewBadRequestError("data perkembangan tidak boleh kosong")
	}

	if req.AnakID == 0 || req.KategoriCapaianID == 0 {
		return nil, customerror.NewBadRequestError("anak_id dan kategori_capaian_id wajib diisi")
	}

	perkembangan := &models.Perkembangan{
		AnakID:            req.AnakID,
		KategoriCapaianID: req.KategoriCapaianID,
		Jawaban:           req.Jawaban,
		TanggalPeriksa:    req.TanggalPeriksa,
	}

	err := m.repository.CreatePerkembangan(perkembangan)
	if err != nil {
		return nil, err
	}

	// Fetch the created data with relations
	createdData, err := m.repository.GetPerkembanganByID(perkembangan.ID)
	if err != nil {
		return nil, err
	}

	res := mapPerkembanganToResponse(*createdData)
	return &res, nil
}

func (m *Main) UpdatePerkembangan(perkembanganID string, req *models.Perkembangan) (*PerkembanganResponse, error) {
	id, err := strconv.ParseUint(strings.TrimSpace(perkembanganID), 10, 64)
	if err != nil || id == 0 {
		return nil, customerror.NewBadRequestError("perkembangan_id tidak valid")
	}

	if req == nil {
		return nil, customerror.NewBadRequestError("data perkembangan tidak boleh kosong")
	}

	existing, err := m.repository.GetPerkembanganByID(uint(id))
	if err != nil {
		return nil, err
	}

	if req.Jawaban != nil {
		existing.Jawaban = req.Jawaban
	}

	if req.TanggalPeriksa != nil {
		existing.TanggalPeriksa = req.TanggalPeriksa
	}

	err = m.repository.UpdatePerkembangan(existing)
	if err != nil {
		return nil, err
	}

	// Fetch updated data
	updatedData, err := m.repository.GetPerkembanganByID(uint(id))
	if err != nil {
		return nil, err
	}

	res := mapPerkembanganToResponse(*updatedData)
	return &res, nil
}

func (m *Main) DeletePerkembangan(perkembanganID string) error {
	id, err := strconv.ParseUint(strings.TrimSpace(perkembanganID), 10, 64)
	if err != nil || id == 0 {
		return customerror.NewBadRequestError("perkembangan_id tidak valid")
	}

	_, err = m.repository.GetPerkembanganByID(uint(id))
	if err != nil {
		return err
	}

	return m.repository.DeletePerkembangan(uint(id))
}

func (m *Main) SearchPerkembangan(anakID, kategoriCapaianID string) ([]PerkembanganResponse, error) {
	var anakIdUint uint
	var kategoriIdUint uint

	anakID = strings.TrimSpace(anakID)
	kategoriCapaianID = strings.TrimSpace(kategoriCapaianID)

	if anakID != "" {
		id, err := strconv.ParseUint(anakID, 10, 64)
		if err != nil || id == 0 {
			return nil, customerror.NewBadRequestError("anak_id tidak valid")
		}
		anakIdUint = uint(id)
	}

	if kategoriCapaianID != "" {
		id, err := strconv.ParseUint(kategoriCapaianID, 10, 64)
		if err != nil || id == 0 {
			return nil, customerror.NewBadRequestError("kategori_capaian_id tidak valid")
		}
		kategoriIdUint = uint(id)
	}

	data, err := m.repository.SearchPerkembangan(anakIdUint, kategoriIdUint)
	if err != nil {
		return nil, err
	}

	return mapPerkembanganListToResponse(data), nil
}
