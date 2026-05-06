package controllers

import (
	"monitoring-service/app/constants"
	"monitoring-service/app/helpers"
	"monitoring-service/app/models"
	"monitoring-service/pkg/customerror"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

// ============= Kategori Capaian Controllers =============

func (m *Main) GetAllKategoriCapaian(c echo.Context) error {
	data, err := m.usecases.GetAllKategoriCapaian()
	if err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

func (m *Main) GetKategoriCapaianById(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"hanya tenaga-kesehatan yang dapat mengakses data ini"})
	}

	data, err := m.usecases.GetKategoriCapaianById(c.Param("id"))
	if err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

func (m *Main) GetKategoriCapaianByRentangUsia(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) && !isOrangtuaRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"role anda tidak memiliki akses ke fitur ini"})
	}

	rentangUsia := strings.TrimSpace(c.QueryParam("rentang_usia"))
	if rentangUsia == "" {
		return helpers.Response(c, http.StatusBadRequest, []string{"rentang_usia wajib diisi"})
	}

	data, err := m.usecases.GetKategoriCapaianByRentangUsia(rentangUsia)
	if err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

func (m *Main) CreateKategoriCapaian(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"hanya tenaga-kesehatan yang dapat membuat data kategori capaian"})
	}

	var req models.KategoriCapaian
	if err := c.Bind(&req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"format request tidak valid"})
	}

	data, err := m.usecases.CreateKategoriCapaian(&req)
	if err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusCreated, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

func (m *Main) UpdateKategoriCapaian(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"hanya tenaga-kesehatan yang dapat memperbarui data kategori capaian"})
	}

	var req models.KategoriCapaian
	if err := c.Bind(&req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"format request tidak valid"})
	}

	data, err := m.usecases.UpdateKategoriCapaian(c.Param("id"), &req)
	if err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

func (m *Main) DeleteKategoriCapaian(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"hanya tenaga-kesehatan yang dapat menghapus data kategori capaian"})
	}

	err := m.usecases.DeleteKategoriCapaian(c.Param("id"))
	if err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{"data kategori capaian berhasil dihapus"}, nil, nil)
}

// ============= Perkembangan Controllers =============

func (m *Main) GetAllPerkembangan(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"hanya tenaga-kesehatan yang dapat mengakses data perkembangan"})
	}

	data, err := m.usecases.GetAllPerkembangan()
	if err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

func (m *Main) GetPerkembanganById(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) && !isOrangtuaRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"role anda tidak memiliki akses ke fitur ini"})
	}

	data, err := m.usecases.GetPerkembanganById(c.Param("id"))
	if err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

func (m *Main) GetPerkembanganByAnakId(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) && !isOrangtuaRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"role anda tidak memiliki akses ke fitur ini"})
	}

	data, err := m.usecases.GetPerkembanganByAnakId(c.Param("anak_id"))
	if err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

func (m *Main) GetPerkembanganByAnakIdAndKategoriId(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) && !isOrangtuaRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"role anda tidak memiliki akses ke fitur ini"})
	}

	data, err := m.usecases.GetPerkembanganByAnakIdAndKategoriId(
		c.Param("anak_id"),
		c.Param("kategori_capaian_id"),
	)
	if err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

func (m *Main) CreatePerkembangan(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"hanya tenaga-kesehatan yang dapat membuat catatan perkembangan"})
	}

	var req models.Perkembangan
	if err := c.Bind(&req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"format request tidak valid"})
	}

	data, err := m.usecases.CreatePerkembangan(&req)
	if err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusCreated, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

func (m *Main) UpdatePerkembangan(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"hanya tenaga-kesehatan yang dapat memperbarui catatan perkembangan"})
	}

	var req models.Perkembangan
	if err := c.Bind(&req); err != nil {
		return helpers.Response(c, http.StatusBadRequest, []string{"format request tidak valid"})
	}

	data, err := m.usecases.UpdatePerkembangan(c.Param("id"), &req)
	if err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}

func (m *Main) DeletePerkembangan(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"hanya tenaga-kesehatan yang dapat menghapus catatan perkembangan"})
	}

	err := m.usecases.DeletePerkembangan(c.Param("id"))
	if err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{"data perkembangan berhasil dihapus"}, nil, nil)
}

func (m *Main) SearchPerkembangan(c echo.Context) error {
	claims, ok := getAuthClaims(c)
	if !ok {
		return helpers.Response(c, http.StatusUnauthorized, []string{"token tidak valid"})
	}

	if !isTenagaKesehatanRole(claims.Role) {
		return helpers.Response(c, http.StatusForbidden, []string{"hanya tenaga-kesehatan yang dapat mencari data perkembangan"})
	}

	anakID := strings.TrimSpace(c.QueryParam("anak_id"))
	kategoriCapaianID := strings.TrimSpace(c.QueryParam("kategori_capaian_id"))

	if anakID == "" && kategoriCapaianID == "" {
		return helpers.Response(c, http.StatusBadRequest, []string{"minimal satu parameter pencarian wajib diisi: anak_id atau kategori_capaian_id"})
	}

	data, err := m.usecases.SearchPerkembangan(anakID, kategoriCapaianID)
	if err != nil {
		return helpers.Response(c, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}
