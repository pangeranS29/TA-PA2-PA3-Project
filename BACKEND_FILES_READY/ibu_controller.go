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

// Create - Membuat data ibu baru dengan validasi lengkap
// Returns: Created Ibu object on success, error message on failure
func (c *IbuController) Create(ctx echo.Context) error {
	// Authenticate user
	claims, _ := ctx.Get("auth_claims").(*models.AuthClaims)
	if claims == nil {
		return ctx.JSON(http.StatusUnauthorized, models.Response{
			StatusCode: http.StatusUnauthorized,
			Message:    "Unauthorized - Silakan login terlebih dahulu",
		})
	}

	// Parse request body
	var req createIbuRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "Format request tidak valid: " + err.Error(),
		})
	}

	// Validate: IDKependudukan must be provided and > 0
	if req.IDKependudukan == 0 {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "id_kependudukan wajib diisi dan harus lebih dari 0",
		})
	}

	// Validate: StatusKehamilan must be provided
	if req.StatusKehamilan == "" {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "status_kehamilan wajib diisi",
		})
	}

	// Create ibu object
	ibu := &models.Ibu{
		IDKependudukan:  req.IDKependudukan,
		StatusKehamilan: req.StatusKehamilan,
	}

	// Log for debugging
	fmt.Printf("[IBU_CONTROLLER] Creating Ibu with IDKependudukan=%d, StatusKehamilan=%s\n", req.IDKependudukan, req.StatusKehamilan)

	// Execute create operation
	if err := c.usecase.Create(ibu); err != nil {
		fmt.Printf("[IBU_CONTROLLER] Error creating ibu: %v\n", err)
		return ctx.JSON(http.StatusInternalServerError, models.Response{
			StatusCode: http.StatusInternalServerError,
			Message:    "Gagal membuat data ibu: " + err.Error(),
		})
	}

	fmt.Printf("[IBU_CONTROLLER] Successfully created Ibu with ID=%d\n", ibu.IDIbu)

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
			Message:    "ID tidak valid - pastikan ID berupa angka",
		})
	}

	data, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{
			StatusCode: http.StatusNotFound,
			Message:    "Data ibu dengan ID " + ctx.Param("id") + " tidak ditemukan",
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
		fmt.Printf("[IBU_CONTROLLER] Error getting all ibu: %v\n", err)
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

// Update - Memperbarui data ibu berdasarkan ID
func (c *IbuController) Update(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "ID tidak valid - pastikan ID berupa angka",
		})
	}

	var req updateIbuRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "Format request tidak valid: " + err.Error(),
		})
	}

	// Check if ibu exists
	existing, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{
			StatusCode: http.StatusNotFound,
			Message:    "Data ibu dengan ID " + ctx.Param("id") + " tidak ditemukan",
		})
	}

	// Update status kehamilan if provided
	if req.StatusKehamilan != "" {
		existing.StatusKehamilan = req.StatusKehamilan
	}

	// Execute update
	if err := c.usecase.Update(existing); err != nil {
		fmt.Printf("[IBU_CONTROLLER] Error updating ibu: %v\n", err)
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

// Delete - Menghapus data ibu berdasarkan ID
func (c *IbuController) Delete(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "ID tidak valid - pastikan ID berupa angka",
		})
	}

	if err := c.usecase.Delete(int32(id)); err != nil {
		fmt.Printf("[IBU_CONTROLLER] Error deleting ibu: %v\n", err)
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
