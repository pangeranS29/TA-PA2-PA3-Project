package controllers

import (
	"net/http"

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