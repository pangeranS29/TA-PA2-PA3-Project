package controllers

import (
	"monitoring-service/app/helpers"
	"monitoring-service/app/models"
	"monitoring-service/app/usecases"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type BblController interface {
	GetByAnakID(c echo.Context) error
	Upsert(c echo.Context) error
}

type bblController struct {
	bblUsecase usecases.BblUsecase
}

func NewBblController(bblUsecase usecases.BblUsecase) BblController {
	return &bblController{
		bblUsecase: bblUsecase,
	}
}

func (ctrl *bblController) GetByAnakID(c echo.Context) error {
	anakIDStr := c.Param("anak_id")
	anakID, err := strconv.Atoi(anakIDStr)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "Invalid Anak ID", nil, nil)
	}

	bbl, err := ctrl.bblUsecase.GetByAnakID(int32(anakID))
	if err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "BBL data not found", nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusOK, "BBL data fetched successfully", bbl, nil)
}

func (ctrl *bblController) Upsert(c echo.Context) error {
	anakIDStr := c.Param("anak_id")
	anakID, err := strconv.Atoi(anakIDStr)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "Invalid Anak ID", nil, nil)
	}

	var req models.Bbl
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "Invalid request payload: "+err.Error(), nil, nil)
	}
	req.AnakID = int32(anakID)

	err = ctrl.bblUsecase.Upsert(&req)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "Failed to upsert BBL data: "+err.Error(), nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusOK, "BBL data updated successfully", req, nil)
}
