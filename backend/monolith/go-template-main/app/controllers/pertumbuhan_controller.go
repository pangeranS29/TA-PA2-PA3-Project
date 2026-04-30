package controllers

import (
	"net/http"
	"strconv"

	"monitoring-service/app/models"
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type PertumbuhanController struct {
	usecase usecases.PertumbuhanUseCase
}

func NewPertumbuhanController(u usecases.PertumbuhanUseCase) *PertumbuhanController {
	return &PertumbuhanController{usecase: u}
}

func (c *PertumbuhanController) Create(ctx echo.Context) error {
	var req models.CreatePertumbuhanRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}

	if err := c.usecase.AddCatatanPertumbuhan(&req); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}

	return ctx.JSON(http.StatusCreated, models.Response{StatusCode: http.StatusCreated, Message: "Berhasil menambahkan catatan pertumbuhan"})
}

func (c *PertumbuhanController) GetRiwayat(ctx echo.Context) error {
	anakID, err := strconv.ParseInt(ctx.Param("anak_id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "anak_id tidak valid"})
	}

	data, err := c.usecase.GetRiwayatPertumbuhan(int32(anakID))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}

	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *PertumbuhanController) GetDetail(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "id tidak valid"})
	}

	data, err := c.usecase.GetDetailCatatanPertumbuhan(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: err.Error()})
	}

	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *PertumbuhanController) Update(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "id tidak valid"})
	}

	var req models.UpdatePertumbuhanRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}

	if err := c.usecase.UpdateCatatanPertumbuhan(int32(id), &req); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}

	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Message: "Berhasil memperbarui catatan pertumbuhan"})
}

func (c *PertumbuhanController) Delete(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "id tidak valid"})
	}

	if err := c.usecase.DeleteCatatanPertumbuhan(int32(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}

	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Message: "Berhasil menghapus catatan pertumbuhan"})
}

func (c *PertumbuhanController) GetChartData(ctx echo.Context) error {
	anakID, err := strconv.ParseInt(ctx.Param("anak_id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "anak_id tidak valid"})
	}

	data, err := c.usecase.GetChartData(int32(anakID))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}

	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}
