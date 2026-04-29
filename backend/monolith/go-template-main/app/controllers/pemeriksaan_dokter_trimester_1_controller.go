package controllers

import (
	"net/http"
	"strconv"

	"monitoring-service/app/usecases"
	"monitoring-service/pkg/customerror"

	"github.com/labstack/echo/v4"
)

type PemeriksaanDokterTrimester1Controller struct {
	usecase usecases.PemeriksaanDokterTrimester1Usecase
}

func NewPemeriksaanDokterTrimester1Controller(u usecases.PemeriksaanDokterTrimester1Usecase) *PemeriksaanDokterTrimester1Controller {
	return &PemeriksaanDokterTrimester1Controller{usecase: u}
}

func (c *PemeriksaanDokterTrimester1Controller) Create(ctx echo.Context) error {
	var req usecases.PemeriksaanDokterTrimester1Request

	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "format request tidak valid",
		})
	}

	if err := c.usecase.Create(&req); err != nil {
		return ctx.JSON(customerror.GetStatusCode(err), map[string]string{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusCreated, map[string]string{
		"message": "Data berhasil disimpan",
	})
}

func (c *PemeriksaanDokterTrimester1Controller) Update(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "id tidak valid"})
	}

	var req usecases.PemeriksaanDokterTrimester1Request
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "format request tidak valid"})
	}

	if err := c.usecase.Update(int32(id), &req); err != nil {
		return ctx.JSON(customerror.GetStatusCode(err), map[string]string{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, map[string]string{
		"message": "Data berhasil diperbarui",
	})
}

func (c *PemeriksaanDokterTrimester1Controller) GetByID(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "id tidak valid"})
	}

	data, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(customerror.GetStatusCode(err), map[string]string{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, data)
}

func (c *PemeriksaanDokterTrimester1Controller) GetByKehamilanID(ctx echo.Context) error {
	kehamilanID, err := strconv.ParseInt(ctx.QueryParam("kehamilan_id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "kehamilan_id tidak valid"})
	}

	data, err := c.usecase.GetByKehamilanID(int32(kehamilanID))
	if err != nil {
		return ctx.JSON(customerror.GetStatusCode(err), map[string]string{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, data)
}

func (c *PemeriksaanDokterTrimester1Controller) Delete(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "id tidak valid"})
	}

	if err := c.usecase.Delete(int32(id)); err != nil {
		return ctx.JSON(customerror.GetStatusCode(err), map[string]string{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, map[string]string{
		"message": "Data berhasil dihapus",
	})
}
