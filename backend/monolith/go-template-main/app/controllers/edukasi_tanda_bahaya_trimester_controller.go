package controllers

import (
	"net/http"
	"strconv"

	"monitoring-service/app/models"
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type EdukasiTandaBahayaTrimesterController struct {
	usecase usecases.EdukasiTandaBahayaTrimesterUsecase
}

func NewEdukasiTandaBahayaTrimesterController(u usecases.EdukasiTandaBahayaTrimesterUsecase) *EdukasiTandaBahayaTrimesterController {
	return &EdukasiTandaBahayaTrimesterController{u}
}

func (c *EdukasiTandaBahayaTrimesterController) Create(ctx echo.Context) error {
	var input models.EdukasiTandaBahayaTrimester

	if err := ctx.Bind(&input); err != nil {
		return ctx.JSON(http.StatusBadRequest, echo.Map{"error": err.Error()})
	}

	if err := c.usecase.Create(&input); err != nil {
		return ctx.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return ctx.JSON(http.StatusCreated, input)
}

func (c *EdukasiTandaBahayaTrimesterController) GetAll(ctx echo.Context) error {
	data, err := c.usecase.GetAll()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return ctx.JSON(http.StatusOK, data)
}

func (c *EdukasiTandaBahayaTrimesterController) GetByID(ctx echo.Context) error {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, echo.Map{"error": "invalid id"})
	}

	data, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, echo.Map{"error": "Data not found"})
	}

	return ctx.JSON(http.StatusOK, data)
}

func (c *EdukasiTandaBahayaTrimesterController) Update(ctx echo.Context) error {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, echo.Map{"error": "invalid id"})
	}

	var input models.EdukasiTandaBahayaTrimester
	if err := ctx.Bind(&input); err != nil {
		return ctx.JSON(http.StatusBadRequest, echo.Map{"error": err.Error()})
	}

	if err := c.usecase.Update(int32(id), &input); err != nil {
		return ctx.JSON(http.StatusNotFound, echo.Map{"error": err.Error()})
	}

	return ctx.JSON(http.StatusOK, echo.Map{"message": "updated successfully"})
}

func (c *EdukasiTandaBahayaTrimesterController) Delete(ctx echo.Context) error {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, echo.Map{"error": "invalid id"})
	}

	if err := c.usecase.Delete(int32(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return ctx.JSON(http.StatusOK, echo.Map{"message": "deleted successfully"})
}
