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
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"hanya tenaga-kesehatan yang dapat menambah catatan pertumbuhan"})
	}

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

// GET
func (m *Main) GetRiwayatPertumbuhan(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) && !isOrangtuaRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"role anda tidak memiliki akses ke fitur ini"})
	}

	anakID, err := strconv.ParseUint(c.Param("anak_id"), 10, 64)
	if err != nil || anakID <= 0 {
		return helpers.Response(c, http.StatusBadRequest, []string{"anak_id tidak valid"})
	}

	if isOrangtuaRole(claims.Role) {
		allowed, allowErr := m.usecases.IsAnakMilikOrangtua(claims.UserID, uint(anakID))
		if allowErr != nil {
			return helpers.Response(c, customerror.GetStatusCode(allowErr), []string{allowErr.Error()})
		}
		if !allowed {
			return helpers.Response(c, http.StatusForbidden, []string{"anda tidak memiliki akses ke data anak ini"})
		}
	}

	data, usecaseErr := m.usecases.GetRiwayatPertumbuhan(uint(anakID))
	if usecaseErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(usecaseErr), []string{usecaseErr.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

// GET/:id
func (m *Main) GetDetailCatatanPertumbuhan(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) && !isOrangtuaRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"role anda tidak memiliki akses ke fitur ini"})
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id == 0 {
		return helpers.Response(c, http.StatusBadRequest, []string{"id tidak valid"})
	}

	if isOrangtuaRole(claims.Role) {
		allowed, allowErr := m.usecases.IsCatatanMilikOrangtua(claims.UserID, uint(id))
		if allowErr != nil {
			return helpers.Response(c, customerror.GetStatusCode(allowErr), []string{allowErr.Error()})
		}
		if !allowed {
			return helpers.Response(c, http.StatusForbidden, []string{"anda tidak memiliki akses ke catatan ini"})
		}
	}

	data, usecaseErr := m.usecases.GetDetailCatatanPertumbuhan(uint(id))
	if usecaseErr != nil {
		return helpers.Response(c, customerror.GetStatusCode(usecaseErr), []string{usecaseErr.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

// UPDATE
func (m *Main) UpdateCatatanPertumbuhan(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"hanya tenaga-kesehatan yang dapat mengubah catatan pertumbuhan"})
	}

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
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"hanya tenaga-kesehatan yang dapat menghapus catatan pertumbuhan"})
	}

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
