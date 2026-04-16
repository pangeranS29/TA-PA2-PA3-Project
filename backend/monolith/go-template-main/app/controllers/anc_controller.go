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

// Ambil dari user_id
func (m *Main) GetRiwayatANC(c echo.Context) error {
	idStr := c.Param("kehamilan_id")
	kehamilanId, _ := strconv.Atoi(idStr)

	data, err := m.usecases.GetRiwayatANC(uint(kehamilanId))
	if err != nil {
		statusCode := customerror.GetStatusCode(err)
		return helpers.Response(c, statusCode, []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

// Buat data pemeriksaan baru
func (m *Main) CreateANC(c echo.Context) error {
	var req models.PemeriksaanANC
	if err := c.Bind(&req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"format request tidak valid"})
	}

	// Usecase
	if err := m.usecases.CreatePemeriksaanANC(&req); err != nil {
		statusCode := customerror.GetStatusCode(err)
		return helpers.Response(c, statusCode, []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusCreated, []string{constants.SUCCESS_RESPONSE_MESSAGE}, map[string]string{
		"message": "data pemeriksaan ANC berhasil disimpan",
	}, nil)
}