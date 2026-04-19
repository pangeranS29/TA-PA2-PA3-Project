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

	anak := e.Group("/anak")
	anak.Use(middlewares.JWTAuth(controller.JWTSecret()))
	anak.GET("", controller.GetAllAnak)
	anak.GET("/search", controller.GetAnak)
	anak.GET("/:anak_id", controller.GetAnakById)

	pertumbuhan := e.Group("/pertumbuhan")
	pertumbuhan.Use(middlewares.JWTAuth(controller.JWTSecret()))
	pertumbuhan.POST("", controller.AddCatatanPertumbuhan)
	pertumbuhan.GET("/:anak_id", controller.GetRiwayatPertumbuhan)
	pertumbuhan.GET("/detail/:id", controller.GetDetailCatatanPertumbuhan)
	pertumbuhan.PUT("/:id", controller.UpdateCatatanPertumbuhan)
	pertumbuhan.DELETE("/:id", controller.DeleteCatatanPertumbuhan)

	masterStandar := e.Group("/master-standar")
	masterStandar.Use(middlewares.JWTAuth(controller.JWTSecret()))
	masterStandar.GET("", controller.GetMasterStandar)
	masterStandar.POST("", controller.CreateMasterStandar)
}
