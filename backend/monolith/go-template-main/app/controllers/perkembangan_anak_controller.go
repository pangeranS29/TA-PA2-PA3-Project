package controllers

import (
	"net/http"
	"strconv"

	"monitoring-service/app/models"
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type PerkembanganAnakController struct {
	usecase usecases.PerkembanganAnakUseCase
}

func NewPerkembanganAnakController(usecase usecases.PerkembanganAnakUseCase) *PerkembanganAnakController {
	return &PerkembanganAnakController{usecase: usecase}
}

func (c *PerkembanganAnakController) GetRentangUsia(ctx echo.Context) error {
	data, err := c.usecase.GetRentangUsia()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Gagal memuat rentang usia",
		})
	}
	return ctx.JSON(http.StatusOK, data)
}

func (c *PerkembanganAnakController) GetKategori(ctx echo.Context) error {
	rentangID := ctx.Param("rentang_id")
	id, err := strconv.ParseInt(rentangID, 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid rentang_id",
		})
	}

	data, err := c.usecase.GetKategori(id)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Gagal memuat kategori",
		})
	}
	return ctx.JSON(http.StatusOK, data)
}

func (c *PerkembanganAnakController) Save(ctx echo.Context) error {
	var req interface{}
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request",
		})
	}

	if err := c.usecase.Save(req); err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}
	return ctx.JSON(http.StatusOK, map[string]string{
		"message": "Data saved successfully",
	})
}

func (c *PerkembanganAnakController) GetHistory(ctx echo.Context) error {
	anakID := ctx.QueryParam("anak_id")
	rentangID := ctx.QueryParam("rentang_usia_id")

	anakIDInt, err := strconv.ParseInt(anakID, 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid anak_id",
		})
	}

	rentangIDInt, err := strconv.ParseInt(rentangID, 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid rentang_usia_id",
		})
	}

	data, err := c.usecase.GetHistory(anakIDInt, rentangIDInt)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Gagal memuat history",
		})
	}
	return ctx.JSON(http.StatusOK, data)
}

func (c *PerkembanganAnakController) CreateKategori(ctx echo.Context) error {
	var req models.KategoriTandaSakit
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request",
		})
	}

	if err := c.usecase.CreateKategori(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
	}
	return ctx.JSON(http.StatusCreated, req)
}

func (c *PerkembanganAnakController) UpdateKategori(ctx echo.Context) error {
	id := ctx.Param("id")
	idInt, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid id",
		})
	}

	var req models.KategoriTandaSakit
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request",
		})
	}

	if err := c.usecase.UpdateKategori(idInt, &req); err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}
	return ctx.JSON(http.StatusOK, map[string]string{
		"message": "Data updated successfully",
	})
}

func (c *PerkembanganAnakController) DeleteKategori(ctx echo.Context) error {
	id := ctx.Param("id")
	idInt, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid id",
		})
	}

	if err := c.usecase.DeleteKategori(idInt); err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}
	return ctx.JSON(http.StatusOK, map[string]string{
		"message": "Data deleted successfully",
	})
}
