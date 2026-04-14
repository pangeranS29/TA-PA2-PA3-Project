package middlewares

import (
	"monitoring-service/app/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

func TenagaKesehatan() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Ambil claims yang sudah disimpan oleh JWTAuth
			claims, ok := c.Get("auth_claims").(*models.AuthClaims)
			if !ok || claims == nil {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"status_code": http.StatusUnauthorized,
					"message":     []string{"Unauthorized: token missing or invalid"},
				})
			}

			// Cek role
			if claims.Role != "Tenaga-kesehatan" {
				return c.JSON(http.StatusForbidden, map[string]interface{}{
					"status_code": http.StatusForbidden,
					"message":     []string{"Forbidden: role '" + claims.Role + "' not allowed"},
				})
			}

			// Simpan juga role jika perlu
			c.Set("role", claims.Role)
			return next(c)
		}
	}
}
