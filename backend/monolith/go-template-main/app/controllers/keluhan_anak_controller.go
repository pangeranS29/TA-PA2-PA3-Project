package controllers

import (
	"monitoring-service/app/models"
	"monitoring-service/app/usecases"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type KeluhanAnakController struct {
	useCase usecases.KeluhanAnakUseCase
}

func NewKeluhanAnakController(useCase usecases.KeluhanAnakUseCase) *KeluhanAnakController {
	return &KeluhanAnakController{useCase}
}

func (c *KeluhanAnakController) Create(ctx echo.Context) error {
	var data models.KeluhanAnak
	if err := ctx.Bind(&data); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}
	if err := c.useCase.Create(&data); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusCreated, models.Response{StatusCode: http.StatusCreated, Data: data})
}

func (c *KeluhanAnakController) Update(ctx echo.Context) error {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var data models.KeluhanAnak
	if err := ctx.Bind(&data); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}
	if err := c.useCase.Update(uint(id), &data); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *KeluhanAnakController) Delete(ctx echo.Context) error {
	id, _ := strconv.Atoi(ctx.Param("id"))
	if err := c.useCase.Delete(uint(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Message: "Deleted"})
}

func (c *KeluhanAnakController) GetByAnakID(ctx echo.Context) error {
	anakID, _ := strconv.Atoi(ctx.Param("anak_id"))
	data, err := c.useCase.GetByAnakID(uint(anakID))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *KeluhanAnakController) GetByID(ctx echo.Context) error {
	id, _ := strconv.Atoi(ctx.Param("id"))
	data, err := c.useCase.GetByID(uint(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}
