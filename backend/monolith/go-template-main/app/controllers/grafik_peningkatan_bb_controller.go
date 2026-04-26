package controllers

import (
	"net/http"
	"strconv"

	"monitoring-service/app/models"
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type GrafikPeningkatanBBController struct {
	usecase usecases.GrafikPeningkatanBBUsecase
}

func NewGrafikPeningkatanBBController(u usecases.GrafikPeningkatanBBUsecase) *GrafikPeningkatanBBController {
	return &GrafikPeningkatanBBController{usecase: u}
}

type createGrafikBBRequest struct {
	KehamilanID                 int32   `json:"kehamilan_id"`
	BBPraKehamilanKg            float64 `json:"bb_pra_kehamilan_kg"`
	IMTPraKehamilan             float64 `json:"imt_pra_kehamilan"`
	KategoriIMTPraKehamilan     string  `json:"kategori_imt_pra_kehamilan"`
	RekomendasiPeningkatanBBMin float64 `json:"rekomendasi_peningkatan_bb_min"`
	RekomendasiPeningkatanBBMax float64 `json:"rekomendasi_peningkatan_bb_max"`
	MingguKehamilan             int     `json:"minggu_kehamilan"`
	PeningkatanBBKg             float64 `json:"peningkatan_bb_kg"`
}

func (c *GrafikPeningkatanBBController) Create(ctx echo.Context) error {
	claims, ok := ctx.Get("auth_claims").(*models.AuthClaims)
	if !ok || claims == nil {
		return ctx.JSON(http.StatusUnauthorized, models.Response{StatusCode: http.StatusUnauthorized, Message: "Unauthorized"})
	}
	var req createGrafikBBRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}
	g := &models.GrafikPeningkatanBB{
		KehamilanID:                 req.KehamilanID,
		BBPraKehamilanKg:            &req.BBPraKehamilanKg,
		IMTPraKehamilan:             &req.IMTPraKehamilan,
		KategoriIMTPraKehamilan:     req.KategoriIMTPraKehamilan,
		RekomendasiPeningkatanBBMin: &req.RekomendasiPeningkatanBBMin,
		RekomendasiPeningkatanBBMax: &req.RekomendasiPeningkatanBBMax,
		MingguKehamilan:             &req.MingguKehamilan,
		PeningkatanBBKg:             &req.PeningkatanBBKg,
	}
	if err := c.usecase.Create(g); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusCreated, models.Response{StatusCode: http.StatusCreated, Data: g})
}

func (c *GrafikPeningkatanBBController) GetByID(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "invalid id"})
	}
	data, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *GrafikPeningkatanBBController) GetByKehamilanID(ctx echo.Context) error {
	kehamilanID, err := strconv.ParseInt(ctx.QueryParam("kehamilan_id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "kehamilan_id required"})
	}
	list, err := c.usecase.GetByKehamilanID(int32(kehamilanID))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: list})
}

func (c *GrafikPeningkatanBBController) Update(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "invalid id"})
	}
	var req createGrafikBBRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}
	existing, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: "Data tidak ditemukan"})
	}
	if req.BBPraKehamilanKg != 0 {
		existing.BBPraKehamilanKg = &req.BBPraKehamilanKg
	}
	if req.IMTPraKehamilan != 0 {
		existing.IMTPraKehamilan = &req.IMTPraKehamilan
	}
	if req.KategoriIMTPraKehamilan != "" {
		existing.KategoriIMTPraKehamilan = req.KategoriIMTPraKehamilan
	}
	if req.RekomendasiPeningkatanBBMin != 0 {
		existing.RekomendasiPeningkatanBBMin = &req.RekomendasiPeningkatanBBMin
	}
	if req.RekomendasiPeningkatanBBMax != 0 {
		existing.RekomendasiPeningkatanBBMax = &req.RekomendasiPeningkatanBBMax
	}
	if req.MingguKehamilan != 0 {
		existing.MingguKehamilan = &req.MingguKehamilan
	}
	if req.PeningkatanBBKg != 0 {
		existing.PeningkatanBBKg = &req.PeningkatanBBKg
	}
	if err := c.usecase.Update(existing); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: existing})
}

func (c *GrafikPeningkatanBBController) Delete(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "invalid id"})
	}
	if err := c.usecase.Delete(int32(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Message: "deleted"})
}
