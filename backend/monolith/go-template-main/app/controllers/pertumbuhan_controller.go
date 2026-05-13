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

// CREATE
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

// GET - chart data (riwayat + standar WHO)
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

// GET
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

// GET/:id
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

// UPDATE
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

// DELETE
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

// ==================== ENDPOINT IBU ====================

// GET /ibu/pertumbuhan/chart/:anak_id
// Menampilkan grafik pertumbuhan (riwayat + standar WHO) untuk anak milik ibu yang login
func (m *Main) GetPertumbuhanChartForIbu(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"Unauthorized"})
	}

	anakID, err := strconv.ParseUint(c.Param("anak_id"), 10, 64)
	if err != nil || anakID <= 0 {
		return helpers.Response(c, http.StatusBadRequest, []string{"anak_id tidak valid"})
	}

	// Verifikasi anak milik ibu yang sedang login
	isMilik, verifyErr := m.usecases.IsAnakMilikOrangtua(uint(claims.UserID), uint(anakID))
	if verifyErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(verifyErr), []string{verifyErr.Error()})
	}
	if !isMilik {
		return helpers.Response(c, http.StatusForbidden, []string{"akses ditolak: anak tidak ditemukan atau bukan milik anda"})
	}

	data, usecaseErr := m.usecases.GetPertumbuhanChart(uint(anakID))
	if usecaseErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(usecaseErr), []string{usecaseErr.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

// GET /ibu/pertumbuhan/riwayat/:anak_id
// Menampilkan riwayat pertumbuhan beserta status gizi (BB/U, TB/U, IMT/U, BB/TB, LK/U)
// untuk anak milik ibu yang sedang login
func (m *Main) GetRiwayatPertumbuhanForIbu(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"Unauthorized"})
	}

	anakID, err := strconv.ParseUint(c.Param("anak_id"), 10, 64)
	if err != nil || anakID <= 0 {
		return helpers.Response(c, http.StatusBadRequest, []string{"anak_id tidak valid"})
	}

	// Verifikasi anak milik ibu yang sedang login
	isMilik, verifyErr := m.usecases.IsAnakMilikOrangtua(uint(claims.UserID), uint(anakID))
	if verifyErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(verifyErr), []string{verifyErr.Error()})
	}
	if !isMilik {
		return helpers.Response(c, http.StatusForbidden, []string{"akses ditolak: anak tidak ditemukan atau bukan milik anda"})
	}

	data, usecaseErr := m.usecases.GetRiwayatPertumbuhan(uint(anakID))
	if usecaseErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(usecaseErr), []string{usecaseErr.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

// GET /ibu/pertumbuhan/detail/:id
// Menampilkan detail satu catatan pertumbuhan milik anak yang dimiliki ibu yang login
func (m *Main) GetDetailCatatanPertumbuhanForIbu(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"Unauthorized"})
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id == 0 {
		return helpers.Response(c, http.StatusBadRequest, []string{"id tidak valid"})
	}

	// Verifikasi catatan milik anak yang dimiliki ibu
	isMilik, verifyErr := m.usecases.IsCatatanMilikOrangtua(uint(claims.UserID), uint(id))
	if verifyErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(verifyErr), []string{verifyErr.Error()})
	}
	if !isMilik {
		return helpers.Response(c, http.StatusForbidden, []string{"akses ditolak: data tidak ditemukan atau bukan milik anda"})
	}

	data, usecaseErr := m.usecases.GetDetailCatatanPertumbuhan(uint(id))
	if usecaseErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(usecaseErr), []string{usecaseErr.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}
