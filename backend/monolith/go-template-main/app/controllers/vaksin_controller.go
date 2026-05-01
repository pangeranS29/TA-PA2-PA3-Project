package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"monitoring-service/app/helpers"
	"monitoring-service/app/models"

	"github.com/labstack/echo/v4"
)

func (m *Main) CreateVaksin(c echo.Context) error {
	var req models.CreateVaksinRequest

	if err := c.Bind(&req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"format request tidak valid"})
	}

	if err := m.usecases.CreateVaksin(&req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{err.Error()})
	}

	return c.JSON(http.StatusCreated, map[string]string{
		"message": "Data vaksin berhasil ditambahkan!",
	})
}

func (m *Main) DeleteVaksin(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return helpers.Response(c, http.StatusBadRequest, []string{"ID Vaksin harus dicantumkan"})
	}

	idInt, err := strconv.Atoi(id)
	if err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"Format ID Vaksin tidak valid, harus berupa angka"})
	}

	idUint := uint(idInt)
	if err := m.usecases.DeleteVaksin(idUint); err != nil {
		statusCode := http.StatusInternalServerError
		return helpers.Response(c, statusCode, []string{err.Error()})
	}
	return helpers.StandardResponse(c, http.StatusOK, []string{"Berhasil menonaktifkan data vaksin"}, nil, nil)
}

func (m *Main) UpdateVaksin(c echo.Context) error {
	idParam := c.Param("id")
	idInt, err := strconv.Atoi(idParam)
	if err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"Format ID Vaksin tidak valid, harus angka"})
	}
	idUint := uint(idInt)

	var req models.UpdateVaksinRequest
	if err := c.Bind(&req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"Format request tidak valid"})
	}

	if err := m.usecases.UpdateVaksin(idUint, &req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{"Berhasil memperbarui data vaksin"}, nil, nil)
}

func (m *Main) GetAllVaksin(c echo.Context) error {
	data, err := m.usecases.GetAllVaksin()
	if err != nil {
		return helpers.Response(c, http.StatusInternalServerError, []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{"Berhasil mendapatkan data vaksin"}, data, nil)
}

func (m *Main) GetVaksinByID(c echo.Context) error {
	idParam := c.Param("id")
	idInt, err := strconv.Atoi(idParam)
	if err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"Format ID Vaksin tidak valid, harus angka"})
	}
	idUint := uint(idInt)

	data, err := m.usecases.GetVaksinByID(idUint)
	if err != nil {
		return helpers.Response(c, http.StatusNotFound, []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{"Berhasil mendapatkan data vaksin"}, data, nil)
}

func (m *Main) UpdateVaksinStatus(c echo.Context) error {
	idParam := c.Param("id")
	idInt, err := strconv.Atoi(idParam)
	if err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"Format ID Vaksin tidak valid, harus angka"})
	}
	idUint := uint(idInt)

	var req models.UpdateVaksinStatusRequest
	if err := c.Bind(&req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"Format request tidak valid"})
	}

	req.Status = strings.ToLower(strings.TrimSpace(req.Status))

	if err := m.usecases.UpdateVaksinStatus(idUint, req.Status); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{"Status vaksin berhasil diperbarui"}, nil, nil)
}