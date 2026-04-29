package controllers

import (
	"net/http"
	"strconv"

	"monitoring-service/app/helpers"
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type PemeriksaanDokterCompleteController struct {
	t1Usecase usecases.PemeriksaanDokterTrimester1Usecase
	t3Usecase usecases.PemeriksaanDokterTrimester3Usecase
}

func NewPemeriksaanDokterCompleteController(
	t1Usecase usecases.PemeriksaanDokterTrimester1Usecase,
	t3Usecase usecases.PemeriksaanDokterTrimester3Usecase,
) *PemeriksaanDokterCompleteController {
	return &PemeriksaanDokterCompleteController{
		t1Usecase: t1Usecase,
		t3Usecase: t3Usecase,
	}
}

// T1 Create
func (c *PemeriksaanDokterCompleteController) CreateT1(ctx echo.Context) error {
	var req usecases.PemeriksaanDokterTrimester1Request
	if err := ctx.Bind(&req); err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{err.Error()})
	}
	if err := c.t1Usecase.Create(&req); err != nil {
		return helpers.Response(ctx, http.StatusInternalServerError, []string{err.Error()})
	}
	return helpers.StandardResponse(ctx, http.StatusCreated, []string{"Success"}, nil, nil)
}

// T1 Update
func (c *PemeriksaanDokterCompleteController) UpdateT1(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{"invalid id"})
	}
	var req usecases.PemeriksaanDokterTrimester1Request
	if err := ctx.Bind(&req); err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{err.Error()})
	}
	if err := c.t1Usecase.Update(int32(id), &req); err != nil {
		return helpers.Response(ctx, http.StatusInternalServerError, []string{err.Error()})
	}
	return helpers.StandardResponse(ctx, http.StatusOK, []string{"Success"}, nil, nil)
}

// T1 Get By Kehamilan
func (c *PemeriksaanDokterCompleteController) GetT1ByKehamilan(ctx echo.Context) error {
	kehamilanID, err := strconv.ParseInt(ctx.QueryParam("kehamilan_id"), 10, 32)
	if err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{"kehamilan_id required"})
	}
	data, err := c.t1Usecase.GetByKehamilanID(int32(kehamilanID))
	if err != nil {
		return helpers.Response(ctx, http.StatusInternalServerError, []string{err.Error()})
	}
	return helpers.StandardResponse(ctx, http.StatusOK, []string{"Success"}, data, nil)
}

// T1 Get By ID
func (c *PemeriksaanDokterCompleteController) GetT1ByID(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{"invalid id"})
	}
	data, err := c.t1Usecase.GetByID(int32(id))
	if err != nil {
		return helpers.Response(ctx, http.StatusInternalServerError, []string{err.Error()})
	}
	return helpers.StandardResponse(ctx, http.StatusOK, []string{"Success"}, data, nil)
}

// T1 Delete
func (c *PemeriksaanDokterCompleteController) DeleteT1(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{"invalid id"})
	}
	if err := c.t1Usecase.Delete(int32(id)); err != nil {
		return helpers.Response(ctx, http.StatusInternalServerError, []string{err.Error()})
	}
	return helpers.StandardResponse(ctx, http.StatusOK, []string{"Success"}, nil, nil)
}

// ==================== T3 ====================

func (c *PemeriksaanDokterCompleteController) CreateT3(ctx echo.Context) error {
	var req usecases.PemeriksaanDokterTrimester3Request
	if err := ctx.Bind(&req); err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{err.Error()})
	}
	if err := c.t3Usecase.Create(&req); err != nil {
		return helpers.Response(ctx, http.StatusInternalServerError, []string{err.Error()})
	}
	return helpers.StandardResponse(ctx, http.StatusCreated, []string{"Success"}, nil, nil)
}

func (c *PemeriksaanDokterCompleteController) UpdateT3(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{"invalid id"})
	}
	var req usecases.PemeriksaanDokterTrimester3Request
	if err := ctx.Bind(&req); err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{err.Error()})
	}
	if err := c.t3Usecase.Update(int32(id), &req); err != nil {
		return helpers.Response(ctx, http.StatusInternalServerError, []string{err.Error()})
	}
	return helpers.StandardResponse(ctx, http.StatusOK, []string{"Success"}, nil, nil)
}

func (c *PemeriksaanDokterCompleteController) GetT3ByKehamilan(ctx echo.Context) error {
	kehamilanID, err := strconv.ParseInt(ctx.QueryParam("kehamilan_id"), 10, 32)
	if err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{"kehamilan_id required"})
	}
	data, err := c.t3Usecase.GetByKehamilanID(int32(kehamilanID))
	if err != nil {
		return helpers.Response(ctx, http.StatusInternalServerError, []string{err.Error()})
	}
	return helpers.StandardResponse(ctx, http.StatusOK, []string{"Success"}, data, nil)
}

func (c *PemeriksaanDokterCompleteController) GetT3ByID(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{"invalid id"})
	}
	data, err := c.t3Usecase.GetByID(int32(id))
	if err != nil {
		return helpers.Response(ctx, http.StatusInternalServerError, []string{err.Error()})
	}
	return helpers.StandardResponse(ctx, http.StatusOK, []string{"Success"}, data, nil)
}

func (c *PemeriksaanDokterCompleteController) DeleteT3(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{"invalid id"})
	}
	if err := c.t3Usecase.Delete(int32(id)); err != nil {
		return helpers.Response(ctx, http.StatusInternalServerError, []string{err.Error()})
	}
	return helpers.StandardResponse(ctx, http.StatusOK, []string{"Success"}, nil, nil)
}
