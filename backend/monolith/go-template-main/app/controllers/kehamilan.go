package controllers

import (
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type KehamilanController struct {
	usecase usecases.KehamilanUsecase
}

func NewKehamilanController(u usecases.KehamilanUsecase) *KehamilanController {
	return &KehamilanController{usecase: u}
}

func (h *KehamilanController) GetActive(c echo.Context) error {
	data, err := h.usecase.GetActiveKehamilan()
	if err != nil {
		return c.JSON(500, map[string]interface{}{
			"message": err.Error(),
		})
	}

	return c.JSON(200, map[string]interface{}{
		"message": "success",
		"data":    data,
	})
}
