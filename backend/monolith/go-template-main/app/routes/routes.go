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

	auth := e.Group("")
	secured := auth.Group("")
	secured.Use(middlewares.JWTAuth(controller.JWTSecret()))
	secured.GET("/me", controller.Me)

	vaksinGroup := e.Group("/vaksin")
	vaksinGroup.POST("/create_vaksin", controller.CreateVaksin)
	vaksinGroup.DELETE("/:id", controller.DeleteVaksin)
	vaksinGroup.PUT("/:id", controller.UpdateVaksin)

	e.POST("/keluarga-lengkap", controller.AdminCreateKeluargaLengkap, middlewares.JWTAuth(controller.JWTSecret()))
	e.POST("/penduduk/akun", controller.AdminCreateAkunPenduduk, middlewares.JWTAuth(controller.JWTSecret()))
}