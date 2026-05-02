package controllers

import (
	"monitoring-service/app/models"
	"monitoring-service/app/usecases"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type PerkembanganAnakController struct {
	usecase usecases.PerkembanganAnakUseCase
}

func NewPerkembanganAnakController(u usecases.PerkembanganAnakUseCase) *PerkembanganAnakController {
	return &PerkembanganAnakController{u}
}

func (ctrl *PerkembanganAnakController) GetRentangUsia(c echo.Context) error {
	res, err := ctrl.usecase.GetRentangUsia()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, res)
}

func (ctrl *PerkembanganAnakController) GetKategori(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("rentang_id"))
	res, err := ctrl.usecase.GetKategoriByRentang(int32(id))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, res)
}

func (ctrl *PerkembanganAnakController) Save(c echo.Context) error {
	var req models.LembarPerkembanganAnakRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": "Invalid request"})
	}

	if err := ctrl.usecase.Save(req); err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}

	return c.JSON(http.StatusCreated, echo.Map{"message": "Data perkembangan berhasil disimpan"})
}

func (ctrl *PerkembanganAnakController) GetHistory(c echo.Context) error {
	anakID, _ := strconv.Atoi(c.QueryParam("anak_id"))
	rentangID, _ := strconv.Atoi(c.QueryParam("rentang_usia_id"))
	
	res, err := ctrl.usecase.GetHistory(int32(anakID), int32(rentangID))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, res)
}

func (ctrl *PerkembanganAnakController) CreateKategori(c echo.Context) error {
	var req models.KategoriPerkembangan
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": "Invalid request"})
	}

	if err := ctrl.usecase.CreateKategori(req); err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}

	return c.JSON(http.StatusCreated, echo.Map{"message": "Kategori perkembangan berhasil ditambahkan"})
}

func (ctrl *PerkembanganAnakController) UpdateKategori(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	var req models.KategoriPerkembangan
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": "Invalid request"})
	}

	if err := ctrl.usecase.UpdateKategori(int32(id), req); err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "Kategori perkembangan berhasil diupdate"})
}

func (ctrl *PerkembanganAnakController) DeleteKategori(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := ctrl.usecase.DeleteKategori(int32(id)); err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, echo.Map{"message": "Kategori perkembangan berhasil dihapus"})
}
