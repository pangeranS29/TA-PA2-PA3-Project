package controllers

import (
	"net/http"
	"strconv"

	"monitoring-service/app/models"
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type IbuController struct {
	usecase usecases.IbuUsecase
}

func NewIbuController(u usecases.IbuUsecase) *IbuController {
	return &IbuController{usecase: u}
}

// ================= REQUEST DTO =================

type createIbuRequest struct {
	PendudukID int32 `json:"penduduk_id"`
	Gravida    int32 `json:"gravida"`
	Paritas    int32 `json:"paritas"`
	Abortus    int32 `json:"abortus"`
}

type updateIbuRequest struct {
	Gravida int32 `json:"gravida"`
	Paritas int32 `json:"paritas"`
	Abortus int32 `json:"abortus"`
}

// ================= CREATE =================
func (c *IbuController) Create(ctx echo.Context) error {
	claims, _ := ctx.Get("auth_claims").(*models.AuthClaims)
	if claims == nil {
		return ctx.JSON(http.StatusUnauthorized, models.Response{
			StatusCode: http.StatusUnauthorized,
			Message:    "Unauthorized",
		})
	}

	var req createIbuRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    err.Error(),
		})
	}

	if req.PendudukID == 0 {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "penduduk_id wajib diisi",
		})
	}

	ibu := &models.Ibu{
		PendudukID: req.PendudukID,
		Gravida:    req.Gravida,
		Paritas:    req.Paritas,
		Abortus:    req.Abortus,
	}

	if err := c.usecase.Create(ibu); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    err.Error(),
		})
	}

	return ctx.JSON(http.StatusCreated, models.Response{
		StatusCode: http.StatusCreated,
		Data:       ibu,
	})
}

// ================= GET BY ID =================
func (c *IbuController) GetByID(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "invalid id",
		})
	}

	data, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{
			StatusCode: http.StatusNotFound,
			Message:    err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Data:       data,
	})
}

// ================= GET ALL =================
func (c *IbuController) GetAll(ctx echo.Context) error {
	list, err := c.usecase.GetAll()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Data:       list,
	})
}

// ================= UPDATE =================
func (c *IbuController) Update(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "invalid id",
		})
	}

	var req updateIbuRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    err.Error(),
		})
	}

	existing, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{
			StatusCode: http.StatusNotFound,
			Message:    "Data tidak ditemukan",
		})
	}

	existing.Gravida = req.Gravida
	existing.Paritas = req.Paritas
	existing.Abortus = req.Abortus

	if err := c.usecase.Update(existing); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Data:       existing,
	})
}

// ================= DELETE =================
func (c *IbuController) Delete(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "invalid id",
		})
	}

	if err := c.usecase.Delete(int32(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Message:    "deleted",
	})
}