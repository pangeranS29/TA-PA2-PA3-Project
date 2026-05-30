package middlewares

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

func normalizeRole(role string) string {
	role = strings.TrimSpace(strings.ToLower(role))
	role = strings.ReplaceAll(role, " ", "")
	role = strings.ReplaceAll(role, "_", "")
	role = strings.ReplaceAll(role, "-", "")
	return role
}

// GetRole mengambil role pengguna dari Echo context.
func GetRole(c echo.Context) string {
	role, _ := c.Get("role").(string)
	return role
}

func TenagaKesehatan() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			role, _ := c.Get("role").(string)

			if role == "" {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"status_code": http.StatusUnauthorized,
					"message":     "role tidak ditemukan",
				})
			}

			normalized := normalizeRole(role)
			if normalized != "bidan" && normalized != "dokter" && normalized != "tenagakesehatan" {
				return c.JSON(http.StatusForbidden, map[string]interface{}{
					"status_code": http.StatusForbidden,
					"message":     "Anda Tidak Memiliki Akses",
				})
			}

			return next(c)
		}
	}
}

func AdminOnly() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			role, _ := c.Get("role").(string)

			if role == "" {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"status_code": http.StatusUnauthorized,
					"message":     "role tidak ditemukan",
				})
			}

			normalized := normalizeRole(role)
			if normalized != "admin" && normalized != "superadmin" {
				return c.JSON(http.StatusForbidden, map[string]interface{}{
					"status_code": http.StatusForbidden,
					"message":     "Anda Tidak Memiliki Akses",
				})
			}

			return next(c)
		}
	}
}

func SuperAdminOnly() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			role, _ := c.Get("role").(string)

			if role == "" {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"status_code": http.StatusUnauthorized,
					"message":     "role tidak ditemukan",
				})
			}

			normalized := normalizeRole(role)
			if normalized != "superadmin" {
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

			normalized := normalizeRole(role)
			if normalized != "ibu" && normalized != "orangtua" {
				return c.JSON(http.StatusForbidden, map[string]interface{}{
					"status_code": http.StatusForbidden,
					"message":     "Anda Tidak Memiliki Akses",
				})
			}

			return next(c)
		}
	}
}

func BidanOnly() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			role, _ := c.Get("role").(string)

			if role == "" {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"status_code": http.StatusUnauthorized,
					"message":     "role tidak ditemukan",
				})
			}

			normalized := normalizeRole(role)
			if normalized != "bidan" {
				return c.JSON(http.StatusForbidden, map[string]interface{}{
					"status_code": http.StatusForbidden,
					"message":     "Anda Tidak Memiliki Akses",
				})
			}

			return next(c)
		}
	}
}
