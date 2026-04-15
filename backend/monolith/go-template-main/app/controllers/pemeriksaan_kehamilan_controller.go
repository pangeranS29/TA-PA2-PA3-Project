package controllers

import (
	"monitoring-service/app/models"
	"monitoring-service/app/usecases"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type PemeriksaanKehamilanController struct {
	usecase usecases.PemeriksaanKehamilanUsecase
}

func NewPemeriksaanKehamilanController(u usecases.PemeriksaanKehamilanUsecase) *PemeriksaanKehamilanController {
	return &PemeriksaanKehamilanController{usecase: u}
}

func (c *PemeriksaanKehamilanController) Create(ctx echo.Context) error {
	var req models.PemeriksaanKehamilan
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: err.Error()})
	}
	if err := c.usecase.Create(&req); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: 500, Message: err.Error()})
	}
	return ctx.JSON(http.StatusCreated, models.Response{StatusCode: 201, Data: req})
}

func (c *PemeriksaanKehamilanController) GetByID(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: "invalid id"})
	}
	data, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: 404, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: 200, Data: data})
}

func (c *PemeriksaanKehamilanController) GetByIbuID(ctx echo.Context) error {
	ibuID, err := strconv.ParseInt(ctx.QueryParam("ibu_id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: "ibu_id required"})
	}
	list, err := c.usecase.GetByIbuID(int32(ibuID))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: 500, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: 200, Data: list})
}

func (c *PemeriksaanKehamilanController) Update(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: "invalid id"})
	}
	var req models.PemeriksaanKehamilan
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: err.Error()})
	}
	req.IDPeriksa = int32(id)
	if err := c.usecase.Update(&req); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: 500, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: 200, Data: req})
}

func (c *PemeriksaanKehamilanController) Delete(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: "invalid id"})
	}
	if err := c.usecase.Delete(int32(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: 500, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: 200, Message: "deleted"})
}
