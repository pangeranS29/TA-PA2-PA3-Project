package controllers

import (
	"errors"
	"net/http"
	"strings"

	"monitoring-service/app/models"
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type LembarPemantauanController struct {
	usecase usecases.LembarPemantauanUsecase
}

func NewLembarPemantauanController(uc usecases.LembarPemantauanUsecase) *LembarPemantauanController {
	return &LembarPemantauanController{usecase: uc}
}

func getAuthClaims(ctx echo.Context) (*models.AuthClaims, bool) {
	claims, ok := ctx.Get("auth_claims").(*models.AuthClaims)
	if !ok || claims == nil {
		return nil, false
	}
	return claims, true
}

func isLembarPemantauanForbidden(err error) bool {
	return errors.Is(err, usecases.ErrLembarPemantauanForbidden)
}

// Create - POST /tenaga-kesehatan/lembar-pemantauan
func (c *LembarPemantauanController) Create(ctx echo.Context) error {
	var req models.LembarPemantauanRequest

	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "Format request tidak valid",
		})
	}

	lembar, err := c.usecase.Create(req)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    err.Error(),
		})
	}

	return ctx.JSON(http.StatusCreated, models.Response{
		StatusCode: http.StatusCreated,
		Message:    "Lembar pemantauan berhasil dibuat",
		Data:       lembar,
	})
}

// CreateForIbu - POST /ibu/lembar-pemantauan
func (c *LembarPemantauanController) CreateForIbu(ctx echo.Context) error {
	claims, ok := getAuthClaims(ctx)
	if !ok {
		return ctx.JSON(http.StatusUnauthorized, models.Response{StatusCode: http.StatusUnauthorized, Message: "Unauthorized"})
	}

	var req models.LembarPemantauanRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "Format request tidak valid"})
	}

	lembar, err := c.usecase.CreateForIbu(req, claims.UserID)
	if err != nil {
		if isLembarPemantauanForbidden(err) {
			return ctx.JSON(http.StatusForbidden, models.Response{StatusCode: http.StatusForbidden, Message: "Anda tidak memiliki akses ke data anak ini"})
		}
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}

	return ctx.JSON(http.StatusCreated, models.Response{StatusCode: http.StatusCreated, Message: "Lembar pemantauan berhasil dibuat", Data: lembar})
}

// GetByID - GET /tenaga-kesehatan/lembar-pemantauan/:id
func (c *LembarPemantauanController) GetByID(ctx echo.Context) error {
	id := ctx.Param("id")

	lembar, err := c.usecase.GetByID(id)
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{
			StatusCode: http.StatusNotFound,
			Message:    err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Data:       lembar,
	})
}

// GetByAnakID - GET /tenaga-kesehatan/lembar-pemantauan?anak_id=X
func (c *LembarPemantauanController) GetByAnakID(ctx echo.Context) error {
	anakID := ctx.QueryParam("anak_id")

	// Jika anak_id tidak diberikan, ambil semua
	if anakID == "" {
		lembars, err := c.usecase.GetAll()
		if err != nil {
			return ctx.JSON(http.StatusInternalServerError, models.Response{
				StatusCode: http.StatusInternalServerError,
				Message:    err.Error(),
			})
		}
		return ctx.JSON(http.StatusOK, models.Response{
			StatusCode: http.StatusOK,
			Data:       lembars,
		})
	}

	lembars, err := c.usecase.GetByAnakID(anakID)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Data:       lembars,
	})
}

// GetByAnakIDForIbu - GET /ibu/lembar-pemantauan?anak_id=X
func (c *LembarPemantauanController) GetByAnakIDForIbu(ctx echo.Context) error {
	claims, ok := getAuthClaims(ctx)
	if !ok {
		return ctx.JSON(http.StatusUnauthorized, models.Response{StatusCode: http.StatusUnauthorized, Message: "Unauthorized"})
	}

	anakID := strings.TrimSpace(ctx.QueryParam("anak_id"))
	if anakID == "" {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "anak_id wajib diisi"})
	}

	lembars, err := c.usecase.GetByAnakIDForIbu(anakID, claims.UserID)
	if err != nil {
		if isLembarPemantauanForbidden(err) {
			return ctx.JSON(http.StatusForbidden, models.Response{StatusCode: http.StatusForbidden, Message: "Anda tidak memiliki akses ke data anak ini"})
		}
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}

	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: lembars})
}

// Update - PUT /tenaga-kesehatan/lembar-pemantauan/:id
func (c *LembarPemantauanController) Update(ctx echo.Context) error {
	id := ctx.Param("id")

	var req models.LembarPemantauanRequest

	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "Format request tidak valid",
		})
	}

	lembar, err := c.usecase.Update(id, req)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Message:    "Lembar pemantauan berhasil diupdate",
		Data:       lembar,
	})
}

// Delete - DELETE /tenaga-kesehatan/lembar-pemantauan/:id
func (c *LembarPemantauanController) Delete(ctx echo.Context) error {
	id := ctx.Param("id")

	err := c.usecase.Delete(id)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{
			StatusCode: http.StatusBadRequest,
			Message:    err.Error(),
		})
	}

	return ctx.JSON(http.StatusOK, models.Response{
		StatusCode: http.StatusOK,
		Message:    "Lembar pemantauan berhasil dihapus",
	})
}
