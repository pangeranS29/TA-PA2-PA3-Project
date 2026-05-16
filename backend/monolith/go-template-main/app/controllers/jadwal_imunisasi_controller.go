package controllers

import (
	"net/http"
	"strconv"

	"monitoring-service/app/constants"
	"monitoring-service/app/helpers"
	"monitoring-service/app/models"

	"github.com/labstack/echo/v4"
)

func (m *Main) GetJadwalImunisasi(
	c echo.Context,
) error {

	claimsValue :=
		c.Get("auth_claims")

	claims, ok :=
		claimsValue.(*models.AuthClaims)

	if !ok {

		return helpers.Response(
			c,
			http.StatusUnauthorized,
			[]string{
				"user tidak valid",
			},
		)
	}

	data, err :=
		m.usecases.
			GetJadwalImunisasi(
				int32(claims.UserID),
			)

	if err != nil {

		return helpers.Response(
			c,
			http.StatusInternalServerError,
			[]string{
				err.Error(),
			},
		)
	}

	return helpers.StandardResponse(
		c,
		http.StatusOK,
		[]string{
			constants.SUCCESS_RESPONSE_MESSAGE,
		},
		data,
		nil,
	)
}

func (m *Main) GetJadwalImunisasiByAnakID(c echo.Context) error {

	// =========================
	// 1. Ambil auth claims
	// =========================
	claimsValue := c.Get("auth_claims")

	claims, ok := claimsValue.(*models.AuthClaims)
	if !ok {
		return helpers.Response(
			c,
			http.StatusUnauthorized,
			[]string{"user tidak valid"},
		)
	}

	// =========================
	// 2. Ambil anakId dari param
	// =========================
	anakIDParam := c.Param("anak_id")

	anakID, err := strconv.Atoi(anakIDParam)
	if err != nil || anakID <= 0 {
		return helpers.Response(
			c,
			http.StatusBadRequest,
			[]string{"anak_id tidak valid"},
		)
	}

	// =========================
	// 3. Call usecase
	// =========================
	data, err := m.usecases.GetJadwalImunisasiByAnakID(
		int32(claims.UserID),
		int32(anakID),
	)

	if err != nil {
		return helpers.Response(
			c,
			http.StatusInternalServerError,
			[]string{err.Error()},
		)
	}

	// =========================
	// 4. Return response sukses
	// =========================
	return helpers.StandardResponse(
		c,
		http.StatusOK,
		[]string{constants.SUCCESS_RESPONSE_MESSAGE},
		data,
		nil,
	)
}
