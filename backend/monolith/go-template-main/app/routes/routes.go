package routes

import (
	"monitoring-service/app/controllers"
	"monitoring-service/app/middlewares"

	"github.com/labstack/echo/v4"
)

func ConfigureRouter(e *echo.Echo, controller *controllers.Main) {
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "ok"})
	})

	e.POST("/login", controller.Login)
	e.POST("/logout", controller.Logout, middlewares.JWTAuth(controller.JWTSecret()))
	e.GET("/profile/keluarga", controller.ProfileKeluarga, middlewares.JWTAuth(controller.JWTSecret()))
	e.POST("/keluarga-lengkap", controller.AdminCreateKeluargaLengkap, middlewares.JWTAuth(controller.JWTSecret()))
}
