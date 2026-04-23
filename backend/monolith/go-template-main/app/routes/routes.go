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

	auth := e.Group("/auth")
	auth.POST("/register", controller.Register)
	auth.POST("/login", controller.Login)

	secured := auth.Group("")
	secured.Use(middlewares.JWTAuth(controller.JWTSecret()))
	secured.GET("/me", controller.Me)

	vaksinGroup := e.Group("/vaksin", middlewares.JWTAuth(controller.JWTSecret()))
	vaksinGroup.POST("/create_vaksin", controller.CreateVaksin)
	vaksinGroup.DELETE("/:id", controller.DeleteVaksin)
	vaksinGroup.PUT("/:id", controller.UpdateVaksin)

}
