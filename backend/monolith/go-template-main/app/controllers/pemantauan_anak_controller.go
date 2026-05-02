package controllers

import (
	"monitoring-service/app/models"
	"monitoring-service/app/usecases"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type PemantauanAnakController struct {
	useCase usecases.PemantauanAnakUseCase
}

func NewPemantauanAnakController(useCase usecases.PemantauanAnakUseCase) *PemantauanAnakController {
	return &PemantauanAnakController{useCase}
}

func (c *PemantauanAnakController) Save(ctx echo.Context) error {
	var req models.LembarPemantauanAnakRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, echo.Map{"message": "Invalid request"})
	}

	if err := req.Validate(); err != nil {
		return ctx.JSON(http.StatusBadRequest, echo.Map{"message": err.Error()})
	}

	if err := c.useCase.SavePemantauan(&req); err != nil {
		return ctx.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}

	return ctx.JSON(http.StatusOK, echo.Map{"message": "Data pemantauan berhasil disimpan"})
}

func (c *PemantauanAnakController) GetHistory(ctx echo.Context) error {
	anakID, _ := strconv.Atoi(ctx.QueryParam("anak_id"))
	rentangID, _ := strconv.Atoi(ctx.QueryParam("rentang_usia_id"))

	data, err := c.useCase.GetHistory(int32(anakID), int32(rentangID))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}

	return ctx.JSON(http.StatusOK, echo.Map{"data": data})
}

func (c *PemantauanAnakController) GetRentangUsia(ctx echo.Context) error {
	data, err := c.useCase.GetRentangUsia()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}

	return ctx.JSON(http.StatusOK, echo.Map{"data": data})
}

func (c *PemantauanAnakController) GetKategori(ctx echo.Context) error {
	rentangID, _ := strconv.Atoi(ctx.Param("rentang_id"))

	data, err := c.useCase.GetKategoriByRentang(int32(rentangID))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}

	return ctx.JSON(http.StatusOK, echo.Map{"data": data})
}

func (c *PemantauanAnakController) Delete(ctx echo.Context) error {
	id, _ := strconv.Atoi(ctx.Param("id"))

	if err := c.useCase.DeletePemantauan(int32(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}

	return ctx.JSON(http.StatusOK, echo.Map{"message": "Data berhasil dihapus"})
}

func (c *PemantauanAnakController) CreateKategori(ctx echo.Context) error {
	var data models.KategoriTandaSakit
	if err := ctx.Bind(&data); err != nil {
		return ctx.JSON(http.StatusBadRequest, echo.Map{"message": "Invalid request"})
	}

	if err := c.useCase.CreateKategori(&data); err != nil {
		return ctx.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}

	return ctx.JSON(http.StatusCreated, echo.Map{"data": data})
}

func (c *PemantauanAnakController) UpdateKategori(ctx echo.Context) error {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var data models.KategoriTandaSakit
	if err := ctx.Bind(&data); err != nil {
		return ctx.JSON(http.StatusBadRequest, echo.Map{"message": "Invalid request"})
	}

	if err := c.useCase.UpdateKategori(int32(id), &data); err != nil {
		return ctx.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}

	return ctx.JSON(http.StatusOK, echo.Map{"data": data})
}

func (c *PemantauanAnakController) DeleteKategori(ctx echo.Context) error {
	id, _ := strconv.Atoi(ctx.Param("id"))

	if err := c.useCase.DeleteKategori(int32(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, echo.Map{"message": err.Error()})
	}

	return ctx.JSON(http.StatusOK, echo.Map{"message": "Indikator berhasil dihapus"})
}
