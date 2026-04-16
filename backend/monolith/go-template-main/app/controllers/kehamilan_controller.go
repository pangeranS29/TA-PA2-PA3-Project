package controllers

import (
	"net/http"
	"strconv" // Tambahkan ini
	"monitoring-service/app/constants"
	"monitoring-service/app/helpers"
	"monitoring-service/pkg/customerror"

	"github.com/labstack/echo/v4"
)

func (m *Main) GetActiveKehamilan(c echo.Context) error {
	// Ambil dari user_id
	idStr := c.QueryParam("user_id")
	if idStr == "" {
		return helpers.Response(c, http.StatusBadRequest, []string{"user_id wajib dikirim di URL (contoh: ?user_id=1)"})
	}
	
	userID, _ := strconv.Atoi(idStr)

	// Usecase
	data, err := m.usecases.GetActiveKehamilanDetail(uint(userID))
	if err != nil {
		statusCode := customerror.GetStatusCode(err)
		return helpers.Response(c, statusCode, []string{err.Error()})
	}

	return helpers.StandardResponse(c, http.StatusOK, []string{constants.SUCCESS_RESPONSE_MESSAGE}, data, nil)
}