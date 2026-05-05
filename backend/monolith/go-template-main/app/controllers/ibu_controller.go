package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"monitoring-service/app/models"
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type IbuController struct {
	usecase usecases.IbuUsecase
}

func NewIbuController(u usecases.IbuUsecase) *IbuController {
	return &IbuController{usecase: u}
}

type createIbuRequest struct {
	IDKependudukan  int32  `json:"id_kependudukan"`
	StatusKehamilan string `json:"status_kehamilan"`
}

type updateIbuRequest struct {
	StatusKehamilan string `json:"status_kehamilan"`
}

// Create - Membuat data ibu baru
func (c *IbuController) Create(ctx echo.Context) error {
	claims, _ := ctx.Get("auth_claims").(*models.AuthClaims)
	if claims == nil {
		return ctx.JSON(http.StatusUnauthorized, models.Response{
			StatusCode: http.StatusUnauthorized,
			Message:    "Unauthorized",
		})
	}

	var req createIbuRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "Format request tidak valid: " + err.Error(),
		})
	}

	// Validasi input
	if req.IDKependudukan == 0 {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "id_kependudukan wajib diisi dan harus lebih dari 0",
		})
	}

	if req.StatusKehamilan == "" {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "status_kehamilan wajib diisi",
		})
	}

	ibu := &models.Ibu{
		IDKependudukan:  req.IDKependudukan,
		// StatusKehamilan: req.StatusKehamilan,
	}

	if err := c.usecase.Create(ibu); err != nil {
		fmt.Println("Error creating ibu:", err.Error())
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    "Gagal membuat data ibu: " + err.Error(),
		})
	}

	return ctx.JSON(http.StatusCreated, models.Response{
		StatusCode: http.StatusCreated,
		Message:    "Berhasil membuat data ibu",
		Data:       ibu,
	})
}

// GetByID - Mengambil data ibu berdasarkan ID
func (c *IbuController) GetByID(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "ID tidak valid",
		})
	}

	data, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{
			StatusCode: http.StatusNotFound,
			Message:    "Data ibu tidak ditemukan: " + err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Message:    "Berhasil mengambil data ibu",
		Data:       data,
	})
}

// GetAll - Mengambil semua data ibu
func (c *IbuController) GetAll(ctx echo.Context) error {
	list, err := c.usecase.GetAll()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    "Gagal mengambil data ibu: " + err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Message:    "Berhasil mengambil data ibu",
		Data:       list,
	})
}

// Update - Memperbarui data ibu
func (c *IbuController) Update(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "ID tidak valid",
		})
	}

	var req updateIbuRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "Format request tidak valid: " + err.Error(),
		})
	}

	existing, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{
			StatusCode: http.StatusNotFound,
			Message:    "Data ibu tidak ditemukan",
		})
	}

	// if req.StatusKehamilan != "" {
	// 	existing.StatusKehamilan = req.StatusKehamilan
	// }

	if err := c.usecase.Update(existing); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    "Gagal memperbarui data ibu: " + err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Message:    "Berhasil memperbarui data ibu",
		Data:       existing,
	})
}

// Delete - Menghapus data ibu
func (c *IbuController) Delete(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "ID tidak valid",
		})
	}

	if err := c.usecase.Delete(int32(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    "Gagal menghapus data ibu: " + err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Message:    "Berhasil menghapus data ibu",
	})
}
func (c *IbuController) GetDashboard(ctx echo.Context) error {
	list, err := c.usecase.GetDashboard()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: 500,
			Message:    err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: 200,
		Message:    "Dashboard ibu hamil",
		Data:       list,
	})
}