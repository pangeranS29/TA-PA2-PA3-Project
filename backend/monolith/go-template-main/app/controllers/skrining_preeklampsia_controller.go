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

func (m *Main) GetSkriningByKehamilan(c echo.Context) error {
	idStr := c.Param("kehamilan_id")
	kehamilanId, _ := strconv.Atoi(idStr)

	data, err := m.usecases.GetSkriningPreeklampsia(uint(kehamilanId))
	if err != nil {
		statusCode := customerror.GetStatusCode(err)
		return helpers.Response(c, statusCode, []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

func (m *Main) CreateSkrining(c echo.Context) error {
	var req models.SkriningPreeklampsiaDanDiabetes
	
	if err := c.Bind(&req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"format request tidak valid"})
	}

	if err := m.usecases.CreateSkriningPreeklampsia(&req); err != nil {
		statusCode := customerror.GetStatusCode(err)
		return helpers.Response(c, statusCode, []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusCreated, []string{constants.SUCCESS_RESPONSE_MESSAGE}, map[string]string{
		"message": "skrining preeklampsia dan diabetes berhasil disimpan",
	}, nil)
}