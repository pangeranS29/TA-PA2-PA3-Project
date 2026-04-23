package controllers

import (
	"net/http"
	"strings"

	"monitoring-service/app/helpers"
	"monitoring-service/app/models"

	"github.com/labstack/echo/v4"
)

func (m *Main) GetRiwayatPemeriksaanIbu(c echo.Context) error {
	rawClaims := c.Get("auth_claims")
	claims, ok := rawClaims.(*models.AuthClaims)
	if !ok || claims == nil {
		return helpers.Response(c, http.StatusUnauthorized, []string{"sesi tidak valid atau token kadaluwarsa"})
	}

	result, err := m.usecases.GetRiwayatPemeriksaanIbu(*claims)
	if err != nil {
		errMsg := strings.ToLower(err.Error())

		if strings.Contains(errMsg, "tidak ditemukan") || strings.Contains(errMsg, "belum terhubung") {
			return helpers.Response(c, http.StatusOK, []string{err.Error()})
		}

		return helpers.Response(c, http.StatusInternalServerError, []string{"terjadi kesalahan pada server saat mengambil data pemeriksaan"})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{"riwayat pemeriksaan berhasil diambil"}, result, nil)
}