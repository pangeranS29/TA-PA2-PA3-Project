package controllers

import (
	"monitoring-service/app/models"
	"monitoring-service/app/usecases"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type PemeriksaanDokterTrimester1Controller struct {
	usecase usecases.PemeriksaanDokterTrimester1Usecase
}

func NewPemeriksaanDokterTrimester1Controller(u usecases.PemeriksaanDokterTrimester1Usecase) *PemeriksaanDokterTrimester1Controller {
	return &PemeriksaanDokterTrimester1Controller{usecase: u}
}

func (c *PemeriksaanDokterTrimester1Controller) Create(ctx echo.Context) error {
	var req models.PemeriksaanDokterTrimester1
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: err.Error()})
	}
	if err := c.usecase.Create(&req); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: 500, Message: err.Error()})
	}
	return ctx.JSON(http.StatusCreated, models.Response{StatusCode: 201, Data: req})
}

func (c *PemeriksaanDokterTrimester1Controller) GetByID(ctx echo.Context) error {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: "invalid id"})
	}
	data, err := c.usecase.GetByID(uint(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: 404, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: 200, Data: data})
}

func (c *PemeriksaanDokterTrimester1Controller) GetByIbuID(ctx echo.Context) error {
	ibuID, err := strconv.ParseUint(ctx.QueryParam("ibu_id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: "ibu_id required"})
	}
	list, err := c.usecase.GetByIbuID(uint(ibuID))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: 500, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: 200, Data: list})
}

func (c *PemeriksaanDokterTrimester1Controller) Update(ctx echo.Context) error {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: "invalid id"})
	}
	var req models.PemeriksaanDokterTrimester1
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: err.Error()})
	}
	req.IDTrimester1 = uint(id)
	if err := c.usecase.Update(&req); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: 500, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: 200, Data: req})
}

func (c *PemeriksaanDokterTrimester1Controller) Delete(ctx echo.Context) error {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: "invalid id"})
	}
	if err := c.usecase.Delete(uint(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: 500, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: 200, Message: "deleted"})
}
