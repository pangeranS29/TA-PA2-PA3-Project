package controllers

import (
	"monitoring-service/app/usecases"
	"monitoring-service/pkg/customerror"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type PemeriksaanDokterTrimester3Controller struct {
	usecase usecases.PemeriksaanDokterTrimester3Usecase
}

func NewPemeriksaanDokterTrimester3Controller(u usecases.PemeriksaanDokterTrimester3Usecase) *PemeriksaanDokterTrimester3Controller {
	return &PemeriksaanDokterTrimester3Controller{usecase: u}
}

func (c *PemeriksaanDokterTrimester3Controller) Create(ctx echo.Context) error {
	var req usecases.PemeriksaanDokterTrimester3Request
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "format request tidak valid"})
	}
	if err := c.usecase.Create(&req); err != nil {
		return ctx.JSON(customerror.GetStatusCode(err), map[string]string{"message": err.Error()})
	}
	return ctx.JSON(http.StatusCreated, map[string]interface{}{
		"status_code": http.StatusCreated,
		"message":     "Data pemeriksaan dokter trimester 3 berhasil disimpan",
	})
}

func (c *PemeriksaanDokterTrimester3Controller) Update(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "id tidak valid"})
	}
	var req usecases.PemeriksaanDokterTrimester3Request
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "format request tidak valid"})
	}
	if err := c.usecase.Update(int32(id), &req); err != nil {
		return ctx.JSON(customerror.GetStatusCode(err), map[string]string{"message": err.Error()})
	}
	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"status_code": http.StatusOK,
		"message":     "Data berhasil diperbarui",
	})
}

func (c *PemeriksaanDokterTrimester3Controller) GetByID(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "id tidak valid"})
	}
	data, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(customerror.GetStatusCode(err), map[string]string{"message": err.Error()})
	}
	return ctx.JSON(http.StatusOK, data)
}

func (c *PemeriksaanDokterTrimester3Controller) GetByKehamilanID(ctx echo.Context) error {
	kehamilanID, err := strconv.ParseInt(ctx.QueryParam("kehamilan_id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "kehamilan_id required"})
	}
	list, err := c.usecase.GetByKehamilanID(int32(kehamilanID))
	if err != nil {
		return ctx.JSON(customerror.GetStatusCode(err), map[string]string{"message": err.Error()})
	}
	return ctx.JSON(http.StatusOK, list)
}

func (c *PemeriksaanDokterTrimester3Controller) Delete(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "id tidak valid"})
	}
	if err := c.usecase.Delete(int32(id)); err != nil {
		return ctx.JSON(customerror.GetStatusCode(err), map[string]string{"message": err.Error()})
	}
	return ctx.JSON(http.StatusOK, map[string]string{"message": "Data berhasil dihapus"})
}
