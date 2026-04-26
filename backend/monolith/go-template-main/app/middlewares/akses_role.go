package middlewares

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

// GetRole mengambil role pengguna dari Echo context.
func GetRole(c echo.Context) string {
	role, _ := c.Get("role").(string)
	return role
}

func TenagaKesehatan() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			role, _ := c.Get("role").(string)
			normalized := strings.ToLower(strings.TrimSpace(role))
			normalized = strings.ReplaceAll(normalized, "_", "-")

			if role == "" {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"status_code": http.StatusUnauthorized,
					"message":     "role tidak ditemukan",
				})
			}

			if normalized != "bidan" && normalized != "dokter" && normalized != "tenaga-kesehatan" && normalized != "tenaga kesehatan" {
				return c.JSON(http.StatusForbidden, map[string]interface{}{
					"status_code": http.StatusForbidden,
					"message":     "Anda Tidak Memiliki Akses",
				})
			}

			return next(c)
		}
	}
}

func IbuOnly() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			role, _ := c.Get("role").(string)

			if role == "" {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"status_code": http.StatusUnauthorized,
					"message":     "role tidak ditemukan",
				})
			}

			if role != "Orangtua" {
				return c.JSON(http.StatusForbidden, map[string]interface{}{
					"status_code": http.StatusForbidden,
					"message":     "Hanya ibu yang dapat mengakses endpoint ini",
				})
			}

			return next(c)
		}
	}
}
