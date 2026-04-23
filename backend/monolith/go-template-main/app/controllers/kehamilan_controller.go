package controllers

import (
	"net/http"
	"strconv"
	"time"

	"monitoring-service/app/models"
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type KehamilanController struct {
	usecase usecases.KehamilanUsecase
}

func NewKehamilanController(u usecases.KehamilanUsecase) *KehamilanController {
	return &KehamilanController{usecase: u}
}

type createKehamilanRequest struct {
	IbuID                    int32  `json:"ibu_id"`
	HPHT                     string `json:"hpht,omitempty"`
	TaksiranPersalinan       string `json:"taksiran_persalinan,omitempty"`
	UKKehamilanSaatIni       int32  `json:"uk_kehamilan_saat_ini,omitempty"`
	JarakKehamilanSebelumnya int32  `json:"jarak_kehamilan_sebelumnya,omitempty"`
	StatusKehamilan          string `json:"status_kehamilan,omitempty"`
}

type updateKehamilanRequest struct {
	HPHT                     string `json:"hpht,omitempty"`
	TaksiranPersalinan       string `json:"taksiran_persalinan,omitempty"`
	UKKehamilanSaatIni       int32  `json:"uk_kehamilan_saat_ini,omitempty"`
	JarakKehamilanSebelumnya int32  `json:"jarak_kehamilan_sebelumnya,omitempty"`
	StatusKehamilan          string `json:"status_kehamilan,omitempty"`
}

func (c *KehamilanController) Create(ctx echo.Context) error {
	claims, ok := ctx.Get("auth_claims").(*models.AuthClaims)
	if !ok || claims == nil {
		return ctx.JSON(http.StatusUnauthorized, models.Response{
			StatusCode: http.StatusUnauthorized,
			Message:    "Unauthorized",
		})
	}

	var req createKehamilanRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    err.Error(),
		})
	}

	if req.IbuID == 0 {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "ibu_id wajib diisi",
		})
	}

	kehamilan := &models.Kehamilan{
		IbuID:                    req.IbuID,
		UKKehamilanSaatIni:       req.UKKehamilanSaatIni,
		JarakKehamilanSebelumnya: req.JarakKehamilanSebelumnya,
		StatusKehamilan:          req.StatusKehamilan,
	}

	// Parse tanggal jika ada
	if req.HPHT != "" {
		t, err := time.Parse("2006-01-02", req.HPHT)
		if err != nil {
			return ctx.JSON(http.StatusBadRequest, models.Response{
				StatusCode: http.StatusBadRequest,
				Message:    "format hpht harus YYYY-MM-DD",
			})
		}
		kehamilan.HPHT = &t
	}
	if req.TaksiranPersalinan != "" {
		t, err := time.Parse("2006-01-02", req.TaksiranPersalinan)
		if err != nil {
			return ctx.JSON(http.StatusBadRequest, models.Response{
				StatusCode: http.StatusBadRequest,
				Message:    "format taksiran_persalinan harus YYYY-MM-DD",
			})
		}
		kehamilan.TaksiranPersalinan = &t
	}

	if err := c.usecase.Create(kehamilan); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    err.Error(),
		})
	}

	return ctx.JSON(http.StatusCreated, models.Response{
		StatusCode: http.StatusCreated,
		Data:       kehamilan,
	})
}

func (c *KehamilanController) GetByID(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "invalid id",
		})
	}
	data, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{
			StatusCode: http.StatusNotFound,
			Message:    err.Error(),
		})
	}
	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Data:       data,
	})
}

func (c *KehamilanController) GetByIbuID(ctx echo.Context) error {
	ibuID, err := strconv.ParseInt(ctx.QueryParam("ibu_id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "ibu_id required",
		})
	}
	list, err := c.usecase.GetByIbuID(int32(ibuID))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    err.Error(),
		})
	}
	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Data:       list,
	})
}

func (c *KehamilanController) GetAll(ctx echo.Context) error {
	list, err := c.usecase.GetAll()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    err.Error(),
		})
	}
	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Data:       list,
	})
}

func (c *KehamilanController) Update(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "invalid id",
		})
	}

	var req updateKehamilanRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    err.Error(),
		})
	}

	existing, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{
			StatusCode: http.StatusNotFound,
			Message:    "Data tidak ditemukan",
		})
	}

	if req.HPHT != "" {
		t, err := time.Parse("2006-01-02", req.HPHT)
		if err != nil {
			return ctx.JSON(http.StatusBadRequest, models.Response{
				StatusCode: http.StatusBadRequest,
				Message:    "format hpht harus YYYY-MM-DD",
			})
		}
		existing.HPHT = &t
	}
	if req.TaksiranPersalinan != "" {
		t, err := time.Parse("2006-01-02", req.TaksiranPersalinan)
		if err != nil {
			return ctx.JSON(http.StatusBadRequest, models.Response{
				StatusCode: http.StatusBadRequest,
				Message:    "format taksiran_persalinan harus YYYY-MM-DD",
			})
		}
		existing.TaksiranPersalinan = &t
	}
	if req.UKKehamilanSaatIni != 0 {
		existing.UKKehamilanSaatIni = &req.UKKehamilanSaatIni
	}
	if req.JarakKehamilanSebelumnya != 0 {
		existing.JarakKehamilanSebelumnya = &req.JarakKehamilanSebelumnya
	}
	if req.StatusKehamilan != "" {
		existing.StatusKehamilan = req.StatusKehamilan
	}

	if err := c.usecase.Update(existing); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Data:       existing,
	})
}

func (c *KehamilanController) GetKehamilanAktif(ctx echo.Context) error {
	data, err := c.usecase.GetKehamilanAktif()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    "Gagal mengambil data kehamilan aktif",
		})
	}
	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Message:    "Berhasil mengambil data",
		Data:       data,
	})
}

func (c *KehamilanController) Delete(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "invalid id",
		})
	}
	if err := c.usecase.Delete(int32(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    err.Error(),
		})
	}
	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Message:    "deleted",
	})
}
