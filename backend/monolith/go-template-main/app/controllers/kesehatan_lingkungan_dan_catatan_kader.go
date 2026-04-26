package controllers

import (
	"net/http"
	"strconv"

	"monitoring-service/app/models"
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type KesehatanLingkunganDanCatatanKaderController struct {
	usecase  usecases.KesehatanLingkunganDanCatatanKaderUsecase
	ibuUsecase usecases.IbuUsecase
}

func NewKesehatanLingkunganDanCatatanKaderController(u usecases.KesehatanLingkunganDanCatatanKaderUsecase, ibuUsecase usecases.IbuUsecase) *KesehatanLingkunganDanCatatanKaderController {
	return &KesehatanLingkunganDanCatatanKaderController{usecase: u, ibuUsecase: ibuUsecase}
}

func (c *KesehatanLingkunganDanCatatanKaderController) Create(ctx echo.Context) error {
	var req models.CreateKesehatanLingkunganDanCatatanKaderRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "request tidak valid"})
	}

	data, err := c.usecase.Create(req)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}

	return ctx.JSON(http.StatusCreated, models.Response{StatusCode: http.StatusCreated, Data: data})
}

func (c *KesehatanLingkunganDanCatatanKaderController) GetAll(ctx echo.Context) error {
	claims, _ := ctx.Get("auth_claims").(*models.AuthClaims)
	role := ""
	if claims != nil {
		role = claims.Role
	}

	// Jika user adalah Ibu, hanya tampilkan data miliknya sendiri
	if role == "Orangtua" {
		ibu, err := c.ibuUsecase.GetByUserID(claims.UserID)
		if err != nil {
			return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: "Data ibu tidak ditemukan"})
		}
		data, err := c.usecase.GetAll(&ibu.IDIbu)
		if err != nil {
			return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
		}
		return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
	}

	// Untuk tenaga kesehatan: bisa filter by ibu_id atau ambil semua
	var ibuIDPtr *int32
	if ibuIDStr := ctx.QueryParam("ibu_id"); ibuIDStr != "" {
		parsed, err := strconv.ParseInt(ibuIDStr, 10, 32)
		if err != nil {
			return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "ibu_id tidak valid"})
		}
		converted := int32(parsed)
		ibuIDPtr = &converted
	}

	data, err := c.usecase.GetAll(ibuIDPtr)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *KesehatanLingkunganDanCatatanKaderController) GetByID(ctx echo.Context) error {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "id tidak valid"})
	}

	data, err := c.usecase.GetByID(uint(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: err.Error()})
	}

	// Role-based access: Ibu hanya bisa melihat data milik sendiri
	claims, _ := ctx.Get("auth_claims").(*models.AuthClaims)
	if claims != nil && (claims.Role == "Orangtua") {
		ibu, err := c.ibuUsecase.GetByUserID(claims.UserID)
		if err != nil {
			return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: "Data ibu tidak ditemukan"})
		}
		if data.IbuID != ibu.IDIbu {
			return ctx.JSON(http.StatusForbidden, models.Response{StatusCode: http.StatusForbidden, Message: "Anda tidak memiliki akses ke data ini"})
		}
	}

	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *KesehatanLingkunganDanCatatanKaderController) CreateCatatan(ctx echo.Context) error {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "id tidak valid"})
	}

	var req models.CreateCatatanKaderKesehatanLingkunganRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "request tidak valid"})
	}

	data, err := c.usecase.CreateCatatan(uint(id), req)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}

	return ctx.JSON(http.StatusCreated, models.Response{StatusCode: http.StatusCreated, Data: data})
}

func (c *KesehatanLingkunganDanCatatanKaderController) GetCatatan(ctx echo.Context) error {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "id tidak valid"})
	}

	// Jika user adalah Ibu, pastikan form ini belong to them
	claims, _ := ctx.Get("auth_claims").(*models.AuthClaims)
	if claims != nil && (claims.Role == "Orangtua") {
		// Cek kepemilikan form
		kesehatan, err := c.usecase.GetByID(uint(id))
		if err != nil {
			return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: "Data tidak ditemukan"})
		}
		ibu, err := c.ibuUsecase.GetByUserID(claims.UserID)
		if err != nil {
			return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: "Data ibu tidak ditemukan"})
		}
		if kesehatan.IbuID != ibu.IDIbu {
			return ctx.JSON(http.StatusForbidden, models.Response{StatusCode: http.StatusForbidden, Message: "Anda tidak memiliki akses ke data ini"})
		}
	}

	data, err := c.usecase.GetCatatanByKesehatanID(uint(id))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *KesehatanLingkunganDanCatatanKaderController) UpdateCatatan(ctx echo.Context) error {
	kesehatanID, err := strconv.ParseUint(ctx.Param("id"), 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "id tidak valid"})
	}

	catatanID, err := strconv.ParseUint(ctx.Param("catatanId"), 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "catatan_id tidak valid"})
	}

	var req models.CreateCatatanKaderKesehatanLingkunganRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "request tidak valid"})
	}

	data, err := c.usecase.UpdateCatatan(uint(kesehatanID), uint(catatanID), req)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}

	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *KesehatanLingkunganDanCatatanKaderController) DeleteCatatan(ctx echo.Context) error {
	kesehatanID, err := strconv.ParseUint(ctx.Param("id"), 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "id tidak valid"})
	}

	catatanID, err := strconv.ParseUint(ctx.Param("catatanId"), 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "catatan_id tidak valid"})
	}

	if err := c.usecase.DeleteCatatan(uint(kesehatanID), uint(catatanID)); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}

	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Message: "catatan berhasil dihapus"})
}

func (c *KesehatanLingkunganDanCatatanKaderController) KirimCatatanKeMobile(ctx echo.Context) error {
	kesehatanID, err := strconv.ParseUint(ctx.Param("id"), 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "id tidak valid"})
	}

	catatanID, err := strconv.ParseUint(ctx.Param("catatanId"), 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "catatan_id tidak valid"})
	}

	data, err := c.usecase.MarkCatatanSentToMobile(uint(kesehatanID), uint(catatanID))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}

	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data, Message: "catatan berhasil dikirim ke mobile"})
}

// Update digunakan oleh Ibu untuk mengisi form (checklist)
func (c *KesehatanLingkunganDanCatatanKaderController) Update(ctx echo.Context) error {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "id tidak valid"})
	}

	var req models.CreateKesehatanLingkunganDanCatatanKaderRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "request tidak valid"})
	}

	// Cek apakah data milik ibu yang sedang login (jika user adalah ibu)
	claims, _ := ctx.Get("auth_claims").(*models.AuthClaims)
	if claims != nil && claims.Role == "Orangtua" {
		// Dapatkan data ibu berdasarkan user ID
		ibu, err := c.ibuUsecase.GetByUserID(claims.UserID)
		if err != nil {
			return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: "data ibu tidak ditemukan"})
		}
		// Cek apakah form ini milik ibu tersebut
		existing, err := c.usecase.GetByID(uint(id))
		if err != nil {
			return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: "data tidak ditemukan"})
		}
		if existing.IbuID != ibu.IDIbu {
			return ctx.JSON(http.StatusForbidden, models.Response{StatusCode: http.StatusForbidden, Message: "Anda tidak memiliki akses ke data ini"})
		}
	}

	data, err := c.usecase.Update(uint(id), req)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}

	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}
