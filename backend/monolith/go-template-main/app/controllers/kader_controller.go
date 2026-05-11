package controllers

import (
	"net/http"
	"strconv"

	"monitoring-service/app/constants"
	"monitoring-service/app/helpers"
	"monitoring-service/app/models"
	"monitoring-service/app/middlewares"
	"monitoring-service/app/usecases"
	"monitoring-service/pkg/customerror"

	"github.com/labstack/echo/v4"
)

// KaderController - Controller untuk mengelola kader profile
type KaderController struct {
	usecase usecases.KaderUsecase
}

func NewKaderController(usecase usecases.KaderUsecase) *KaderController {
	return &KaderController{usecase: usecase}
}

// ListMyKader - Bidan mendapatkan list kader di posyandu mereka
func (c *KaderController) ListMyKader(ctx echo.Context) error {
	// Ambil data bidan dari context
	claims, _ := ctx.Get("auth_claims").(*models.AuthClaims)
	if claims == nil {
		return helpers.Response(ctx, http.StatusUnauthorized, []string{"unauthorized"})
	}

	// Ambil search keyword dari query param
	searchKeyword := ctx.QueryParam("search")

	// Get posyandu ID dari bidan profile (perlu ada query ke database untuk get bidan posyandu)
	// Untuk sekarang, kita assume bidan sudah punya posyandu_id di claims atau perlu fetch dari DB
	
	// Sebaiknya kita query database untuk get posyandu_id dari bidan yang sesuai dengan user ID
	// Untuk implementasi sederhana, kita return error jika belum punya posyandu
	// TODO: implementasi fetch posyandu_id dari database
	
	kaders, err := c.usecase.GetMyKaderList(nil, searchKeyword)
	if err != nil {
		return helpers.Response(ctx, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(ctx, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, kaders, nil)
}

// GetKaderDetail - Mendapatkan detail profile kader
func (c *KaderController) GetKaderDetail(ctx echo.Context) error {
	idRaw, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{"id kader tidak valid"})
	}

	kader, err := c.usecase.GetKaderDetail(int32(idRaw))
	if err != nil {
		return helpers.Response(ctx, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(ctx, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, kader, nil)
}

// UpdateKaderProfile - Bidan mengupdate profile kader mereka
func (c *KaderController) UpdateKaderProfile(ctx echo.Context) error {
	// Check role - hanya bidan yang bisa
	role := middlewares.GetRole(ctx)
	if role != "Bidan" {
		return helpers.Response(ctx, http.StatusForbidden, []string{"hanya bidan yang dapat mengupdate kader"})
	}

	idRaw, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{"id kader tidak valid"})
	}

	var req usecases.UpdateKaderProfileRequest
	if err := ctx.Bind(&req); err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{"format request tidak valid: " + err.Error()})
	}

	kader, err := c.usecase.UpdateMyKaderProfile(int32(idRaw), &req)
	if err != nil {
		return helpers.Response(ctx, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(ctx, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, kader, nil)
}

// AdminGetAllKader - Admin mendapatkan semua kader
func (c *KaderController) AdminGetAllKader(ctx echo.Context) error {
	desa := ctx.QueryParam("desa")

	kaders, err := c.usecase.GetAllKader(desa)
	if err != nil {
		return helpers.Response(ctx, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(ctx, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, kaders, nil)
}

// AdminCreateKader - Admin membuat kader baru
func (c *KaderController) AdminCreateKader(ctx echo.Context) error {
	var req usecases.CreateKaderRequest
	if err := ctx.Bind(&req); err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{"format request tidak valid: " + err.Error()})
	}

	kader, err := c.usecase.CreateKader(&req)
	if err != nil {
		return helpers.Response(ctx, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(ctx, http.StatusCreated, []string{constants.SUCCESS_RESPONSE_MESSAGE}, kader, nil)
}

// AdminDeleteKader - Admin menghapus kader
func (c *KaderController) AdminDeleteKader(ctx echo.Context) error {
	idRaw, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return helpers.Response(ctx, http.StatusBadRequest, []string{"id kader tidak valid"})
	}

	if err := c.usecase.DeleteKader(int32(idRaw)); err != nil {
		return helpers.Response(ctx, customerror.GetStatusCode(err), []string{err.Error()})
	}

	return helpers.StandardResponse(ctx, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, map[string]bool{"deleted": true}, nil)
}
