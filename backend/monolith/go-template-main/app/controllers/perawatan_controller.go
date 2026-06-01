package controllers

import (
	"monitoring-service/app/models"
	"monitoring-service/app/usecases"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
)

// ─────────────────────────────────────────────────────────
// KATEGORI CAPAIAN CONTROLLER
// ─────────────────────────────────────────────────────────

type KategoriCapaianController struct {
	useCase usecases.KategoriCapaianUsecase
}

func NewKategoriCapaianController(useCase usecases.KategoriCapaianUsecase) *KategoriCapaianController {
	return &KategoriCapaianController{useCase}
}

func (c *KategoriCapaianController) GetAll(ctx echo.Context) error {
	// Support filter by rentang_usia query param
	rentang := ctx.QueryParam("rentang_usia")
	if rentang != "" {
		data, err := c.useCase.GetByRentangUsia(rentang)
		if err != nil {
			return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
		}
		return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
	}

	data, err := c.useCase.GetAll()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *KategoriCapaianController) GetByID(ctx echo.Context) error {
	id, _ := strconv.Atoi(ctx.Param("id"))
	data, err := c.useCase.GetByID(uint(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *KategoriCapaianController) Create(ctx echo.Context) error {
	var data models.KategoriCapaian
	if err := ctx.Bind(&data); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}
	if err := c.useCase.Create(&data); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusCreated, models.Response{StatusCode: http.StatusCreated, Data: data})
}

func (c *KategoriCapaianController) Update(ctx echo.Context) error {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var data models.KategoriCapaian
	if err := ctx.Bind(&data); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}
	if err := c.useCase.Update(uint(id), &data); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *KategoriCapaianController) Delete(ctx echo.Context) error {
	id, _ := strconv.Atoi(ctx.Param("id"))
	if err := c.useCase.Delete(uint(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Message: "Deleted"})
}

// ─────────────────────────────────────────────────────────
// PERAWATAN CONTROLLER
// ─────────────────────────────────────────────────────────

type PerawatanController struct {
	useCase usecases.PerawatanUsecase
}

func NewPerawatanController(useCase usecases.PerawatanUsecase) *PerawatanController {
	return &PerawatanController{useCase}
}

func (c *PerawatanController) GetByAnakID(ctx echo.Context) error {
	anakIDStr := ctx.QueryParam("anak_id")
	if anakIDStr == "" {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "anak_id is required"})
	}
	anakID, err := strconv.Atoi(anakIDStr)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "anak_id must be a number"})
	}
	data, err := c.useCase.GetByAnakID(int32(anakID))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *PerawatanController) GetByID(ctx echo.Context) error {
	id, _ := strconv.Atoi(ctx.Param("id"))
	data, err := c.useCase.GetByID(uint(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

// createPerawatanRequest adalah body request untuk POST /perawatan
type createPerawatanRequest struct {
	AnakID            int32  `json:"anak_id"`
	KategoriCapaianID uint   `json:"kategori_capaian_id"`
	Jawaban           *bool  `json:"jawaban"`
	TanggalPeriksa    string `json:"tanggal_periksa"`
}

func (c *PerawatanController) Create(ctx echo.Context) error {
	var req createPerawatanRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}

	data := &models.Perawatan{
		AnakID:            req.AnakID,
		KategoriCapaianID: req.KategoriCapaianID,
		Jawaban:           req.Jawaban,
	}

	if req.TanggalPeriksa != "" {
		t, err := time.Parse("2006-01-02", req.TanggalPeriksa)
		if err == nil {
			data.TanggalPeriksa = &t
		}
	}

	if err := c.useCase.Create(data); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusCreated, models.Response{StatusCode: http.StatusCreated, Data: data})
}

// updatePerawatanRequest adalah body request untuk PUT /perawatan/:id
type updatePerawatanRequest struct {
	Jawaban        *bool  `json:"jawaban"`
	TanggalPeriksa string `json:"tanggal_periksa"`
}

func (c *PerawatanController) Update(ctx echo.Context) error {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var req updatePerawatanRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}

	data := &models.Perawatan{
		Jawaban: req.Jawaban,
	}

	if req.TanggalPeriksa != "" {
		t, err := time.Parse("2006-01-02", req.TanggalPeriksa)
		if err == nil {
			data.TanggalPeriksa = &t
		}
	}

	if err := c.useCase.Update(uint(id), data); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *PerawatanController) Delete(ctx echo.Context) error {
	id, _ := strconv.Atoi(ctx.Param("id"))
	if err := c.useCase.Delete(uint(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Message: "Deleted"})
}
