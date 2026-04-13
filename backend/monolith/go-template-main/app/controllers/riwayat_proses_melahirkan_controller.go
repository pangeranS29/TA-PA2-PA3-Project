package controllers

import (
	"monitoring-service/app/models"
	"monitoring-service/app/usecases"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type RiwayatProsesMelahirkanController struct {
	usecase usecases.RiwayatProsesMelahirkanUsecase
}

func NewRiwayatProsesMelahirkanController(u usecases.RiwayatProsesMelahirkanUsecase) *RiwayatProsesMelahirkanController {
	return &RiwayatProsesMelahirkanController{usecase: u}
}

func (c *RiwayatProsesMelahirkanController) Create(ctx echo.Context) error {
	var req models.RiwayatProsesMelahirkan
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: err.Error()})
	}
	if err := c.usecase.Create(&req); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: 500, Message: err.Error()})
	}
	return ctx.JSON(http.StatusCreated, models.Response{StatusCode: 201, Data: req})
}

func (c *RiwayatProsesMelahirkanController) GetByID(ctx echo.Context) error {
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

func (c *RiwayatProsesMelahirkanController) GetByIbuID(ctx echo.Context) error {
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

func (c *RiwayatProsesMelahirkanController) Update(ctx echo.Context) error {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: "invalid id"})
	}
	var req models.RiwayatProsesMelahirkan
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: err.Error()})
	}
	req.IDRiwayatMelahirkan = uint(id)
	if err := c.usecase.Update(&req); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: 500, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: 200, Data: req})
}

func (c *RiwayatProsesMelahirkanController) Delete(ctx echo.Context) error {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: 400, Message: "invalid id"})
	}
	if err := c.usecase.Delete(uint(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: 500, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: 200, Message: "deleted"})
}
