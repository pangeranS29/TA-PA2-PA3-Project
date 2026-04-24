package controllers

import (
	"net/http"
	"strings"

	"monitoring-service/app/helpers"
	"monitoring-service/app/models"

	"github.com/labstack/echo/v4"
)

func (m *Main) Login(c echo.Context) error {
	var req models.LoginRequest
	if err := c.Bind(&req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"format request tidak valid: " + err.Error()})
	}

	result, err := m.usecases.Login(req)
	if err != nil {
		errMsg := strings.ToLower(err.Error())

		if strings.Contains(errMsg, "nomor telepon atau kata sandi salah") {
			return helpers.Response(c, http.StatusUnauthorized, []string{err.Error()})
		}

		if strings.Contains(errMsg, "wajib diisi") || strings.Contains(errMsg, "tidak valid") {
			return helpers.Response(c, http.StatusBadRequest, []string{err.Error()})
		}

		return helpers.Response(c, http.StatusInternalServerError, []string{"terjadi kesalahan pada server"})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{"login berhasil"}, result, nil)
}

func (m *Main) Logout(c echo.Context) error {
	rawClaims := c.Get("auth_claims")
	claims, ok := rawClaims.(*models.AuthClaims)
	if !ok || claims == nil {
		return helpers.Response(c, http.StatusUnauthorized, []string{"claims token tidak valid"})
	}

	if err := m.usecases.Logout(*claims); err != nil {
		errMsg := strings.ToLower(err.Error())
		if strings.Contains(errMsg, "tidak valid") {
			return helpers.Response(c, http.StatusBadRequest, []string{err.Error()})
		}

		return helpers.Response(c, http.StatusInternalServerError, []string{"terjadi kesalahan pada server"})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{"logout berhasil"}, nil, nil)
}

func (m *Main) ProfileKeluarga(c echo.Context) error {
	rawClaims := c.Get("auth_claims")
	claims, ok := rawClaims.(*models.AuthClaims)
	if !ok || claims == nil {
		return helpers.Response(c, http.StatusUnauthorized, []string{"claims token tidak valid"})
	}

	result, err := m.usecases.ProfileKeluarga(*claims)
	if err != nil {
		errMsg := strings.ToLower(err.Error())

		if strings.Contains(errMsg, "tidak terhubung ke kartu_keluarga") {
			return helpers.Response(c, http.StatusBadRequest, []string{err.Error()})
		}

		return helpers.Response(c, http.StatusInternalServerError, []string{"terjadi kesalahan pada server"})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{"profil keluarga berhasil diambil"}, result, nil)
}

func (m *Main) AdminCreateKeluargaLengkap(c echo.Context) error {
	var req models.AdminCreateKeluargaLengkapRequest
	if err := c.Bind(&req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"format request tidak valid: " + err.Error()})
	}

	rawClaims := c.Get("auth_claims")
	claims, ok := rawClaims.(*models.AuthClaims)
	if !ok || claims == nil {
		return helpers.Response(c, http.StatusUnauthorized, []string{"claims token tidak valid"})
	}

	result, err := m.usecases.AdminCreateKeluargaLengkap(*claims, req)
	if err != nil {
		errMsg := strings.ToLower(err.Error())

		if strings.Contains(errMsg, "hanya") || strings.Contains(errMsg, "tidak boleh") {
			return helpers.Response(c, http.StatusForbidden, []string{err.Error()})
		}

		if strings.Contains(errMsg, "wajib diisi") || strings.Contains(errMsg, "tidak valid") || strings.Contains(errMsg, "duplikat") || strings.Contains(errMsg, "belum tersedia") || strings.Contains(errMsg, "relasi anak") {
			return helpers.Response(c, http.StatusBadRequest, []string{err.Error()})
		}

		if strings.Contains(errMsg, "tidak ditemukan") {
			return helpers.Response(c, http.StatusNotFound, []string{err.Error()})
		}

		if strings.Contains(errMsg, "sudah terdaftar") || strings.Contains(errMsg, "sudah digunakan") || strings.Contains(errMsg, "sudah memiliki akun") {
			return helpers.Response(c, http.StatusConflict, []string{err.Error()})
		}

		c.Logger().Errorf("admin create keluarga lengkap error: %v", err)
		if strings.EqualFold(strings.TrimSpace(m.config.ServiceEnvironment), "development") {
			return helpers.Response(c, http.StatusInternalServerError, []string{err.Error()})
		}

		return helpers.Response(c, http.StatusInternalServerError, []string{"terjadi kesalahan pada server"})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{"data keluarga lengkap berhasil dibuat"}, result, nil)
}

func (m *Main) AdminCreateAkunPenduduk(c echo.Context) error {
	var req models.AdminCreateAkunPendudukRequest
	if err := c.Bind(&req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"format request tidak valid: " + err.Error()})
	}

	rawClaims := c.Get("auth_claims")
	claims, ok := rawClaims.(*models.AuthClaims)
	if !ok || claims == nil {
		return helpers.Response(c, http.StatusUnauthorized, []string{"claims token tidak valid"})
	}

	result, err := m.usecases.AdminCreateAkunPenduduk(*claims, req)
	if err != nil {
		errMsg := strings.ToLower(err.Error())

		if strings.Contains(errMsg, "hanya") {
			return helpers.Response(c, http.StatusForbidden, []string{err.Error()})
		}
		if strings.Contains(errMsg, "tidak ditemukan") {
			return helpers.Response(c, http.StatusNotFound, []string{err.Error()})
		}
		if strings.Contains(errMsg, "sudah memiliki") || strings.Contains(errMsg, "sudah digunakan") {
			return helpers.Response(c, http.StatusConflict, []string{err.Error()})
		}
		if strings.Contains(errMsg, "wajib diisi") || strings.Contains(errMsg, "tidak valid") {
			return helpers.Response(c, http.StatusBadRequest, []string{err.Error()})
		}

		return helpers.Response(c, http.StatusInternalServerError, []string{"terjadi kesalahan pada server"})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{"akun penduduk berhasil dibuat"}, result, nil)
}
