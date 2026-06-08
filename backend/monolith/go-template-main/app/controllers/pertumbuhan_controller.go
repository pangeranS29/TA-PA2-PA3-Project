package controllers

import (
	"net/http"
	"strconv"

	"monitoring-service/app/constants"
	"monitoring-service/app/helpers"
	"monitoring-service/app/models"
	"monitoring-service/pkg/customerror"

	"github.com/labstack/echo/v4"
)

// ============================================================
// CREATE
// ============================================================

func (m *Main) AddCatatanPertumbuhan(c echo.Context) error {
	var req models.CreatePertumbuhanRequest
	if err := c.Bind(&req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"format request tidak valid"})
	}

	if err := m.usecases.AddCatatanPertumbuhan(&req); err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusCreated, []string{constants.SUCCESS_RESPONSE_MESSAGE}, map[string]string{
		"message": "catatan pertumbuhan berhasil ditambahkan",
	}, nil)
}

// ============================================================
// GET — RIWAYAT (daftar semua catatan dengan status gizi)
// ============================================================

func (m *Main) GetRiwayatPertumbuhan(c echo.Context) error {
	anakID, err := strconv.ParseUint(c.Param("anak_id"), 10, 64)
	if err != nil || anakID <= 0 {
		return helpers.Response(c, http.StatusBadRequest, []string{"anak_id tidak valid"})
	}
	data, usecaseErr := m.usecases.GetRiwayatPertumbuhan(uint(anakID))
	if usecaseErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(usecaseErr), []string{usecaseErr.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

// ============================================================
// GET — DETAIL satu catatan
// ============================================================

func (m *Main) GetDetailCatatanPertumbuhan(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id == 0 {
		return helpers.Response(c, http.StatusBadRequest, []string{"id tidak valid"})
	}
	data, usecaseErr := m.usecases.GetDetailCatatanPertumbuhan(uint(id))
	if usecaseErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(usecaseErr), []string{usecaseErr.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

// ============================================================
// UPDATE
// ============================================================

func (m *Main) UpdateCatatanPertumbuhan(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id == 0 {
		return helpers.Response(c, http.StatusBadRequest, []string{"id tidak valid"})
	}

	var req models.UpdatePertumbuhanRequest
	if bindErr := c.Bind(&req); bindErr != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"format request tidak valid"})
	}

	if usecaseErr := m.usecases.UpdateCatatanPertumbuhan(uint(id), &req); usecaseErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(usecaseErr), []string{usecaseErr.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, map[string]string{
		"message": "catatan pertumbuhan berhasil diubah",
	}, nil)
}

// ============================================================
// DELETE
// ============================================================

func (m *Main) DeleteCatatanPertumbuhan(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id == 0 {
		return helpers.Response(c, http.StatusBadRequest, []string{"id tidak valid"})
	}

	if usecaseErr := m.usecases.DeleteCatatanPertumbuhan(uint(id)); usecaseErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(usecaseErr), []string{usecaseErr.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, map[string]string{
		"message": "catatan pertumbuhan berhasil dihapus",
	}, nil)
}

// ============================================================
// GET — CHART (DEPRECATED: gabungan semua kategori)
// Tetap berjalan untuk backward compatibility.
// Gunakan endpoint per-kategori di bawah untuk integrasi baru.
// ============================================================

func (m *Main) GetPertumbuhanChart(c echo.Context) error {
	anakID, err := strconv.ParseUint(c.Param("anak_id"), 10, 64)
	if err != nil || anakID <= 0 {
		return helpers.Response(c, http.StatusBadRequest, []string{"anak_id tidak valid"})
	}
	data, usecaseErr := m.usecases.GetPertumbuhanChart(uint(anakID))
	if usecaseErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(usecaseErr), []string{usecaseErr.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

// ============================================================
// GET — CHART PER KATEGORI (ENDPOINT BARU)
// ============================================================

// GetChartBBTB mengembalikan grafik Berat Badan/Tinggi Badan
// GET /pertumbuhan/chart/bb-tb/:anak_id
func (m *Main) GetChartBBTB(c echo.Context) error {
	anakID, err := strconv.ParseUint(c.Param("anak_id"), 10, 64)
	if err != nil || anakID <= 0 {
		return helpers.Response(c, http.StatusBadRequest, []string{"anak_id tidak valid"})
	}

	data, usecaseErr := m.usecases.GetChartBBTB(uint(anakID))
	if usecaseErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(usecaseErr), []string{usecaseErr.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

// GetChartBBU mengembalikan grafik Berat Badan/Umur
// GET /pertumbuhan/chart/bb-u/:anak_id
func (m *Main) GetChartBBU(c echo.Context) error {
	anakID, err := strconv.ParseUint(c.Param("anak_id"), 10, 64)
	if err != nil || anakID <= 0 {
		return helpers.Response(c, http.StatusBadRequest, []string{"anak_id tidak valid"})
	}

	data, usecaseErr := m.usecases.GetChartBBU(uint(anakID))
	if usecaseErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(usecaseErr), []string{usecaseErr.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

// GetChartTBU mengembalikan grafik Tinggi Badan/Umur
// GET /pertumbuhan/chart/tb-u/:anak_id
func (m *Main) GetChartTBU(c echo.Context) error {
	anakID, err := strconv.ParseUint(c.Param("anak_id"), 10, 64)
	if err != nil || anakID <= 0 {
		return helpers.Response(c, http.StatusBadRequest, []string{"anak_id tidak valid"})
	}

	data, usecaseErr := m.usecases.GetChartTBU(uint(anakID))
	if usecaseErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(usecaseErr), []string{usecaseErr.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

// GetChartIMTU mengembalikan grafik Indeks Massa Tubuh/Umur
// GET /pertumbuhan/chart/imt-u/:anak_id
func (m *Main) GetChartIMTU(c echo.Context) error {
	anakID, err := strconv.ParseUint(c.Param("anak_id"), 10, 64)
	if err != nil || anakID <= 0 {
		return helpers.Response(c, http.StatusBadRequest, []string{"anak_id tidak valid"})
	}

	data, usecaseErr := m.usecases.GetChartIMTU(uint(anakID))
	if usecaseErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(usecaseErr), []string{usecaseErr.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}