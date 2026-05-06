package controllers

import (
	"net/http"
	"strconv"

	"monitoring-service/app/models"
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type EdukasiTrimesterController struct {
	usecase usecases.EdukasiTrimesterUsecase
}

func NewEdukasiTrimesterController(usecase usecases.EdukasiTrimesterUsecase) *EdukasiTrimesterController {
	return &EdukasiTrimesterController{
		usecase: usecase,
	}
}

func (c *EdukasiTrimesterController) Create(ctx echo.Context) error {
	var input models.EdukasiTrimester

	if err := ctx.Bind(&input); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "input tidak valid",
		})
	}

	if err := c.usecase.Create(&input); err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusCreated, map[string]interface{}{
		"message": "berhasil tambah edukasi trimester",
		"data":    input,
	})
}

func (c *EdukasiTrimesterController) GetAll(ctx echo.Context) error {
	data, err := c.usecase.GetAll()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"message": "success",
		"data":    data,
	})
}

func (c *EdukasiTrimesterController) GetByID(ctx echo.Context) error {
	idParam := ctx.Param("id")

	id, err := strconv.Atoi(idParam)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "id tidak valid",
		})
	}

	data, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, map[string]interface{}{
			"message": "data tidak ditemukan",
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"message": "success",
		"data":    data,
	})
}

func (c *EdukasiTrimesterController) Update(ctx echo.Context) error {
	idParam := ctx.Param("id")

	id, err := strconv.Atoi(idParam)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "id tidak valid",
		})
	}

	var input models.EdukasiTrimester

	if err := ctx.Bind(&input); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "input tidak valid",
		})
	}

	err = c.usecase.Update(int32(id), &input)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"message": "berhasil update edukasi trimester",
	})
}

func (c *EdukasiTrimesterController) Delete(ctx echo.Context) error {
	idParam := ctx.Param("id")

	id, err := strconv.Atoi(idParam)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"message": "id tidak valid",
		})
	}

	err = c.usecase.Delete(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, map[string]interface{}{
		"message": "berhasil hapus edukasi trimester",
	})
}