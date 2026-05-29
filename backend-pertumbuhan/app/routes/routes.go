package routes

import (
    "backend-pertumbuhan/app/controllers"

    "github.com/labstack/echo/v4"
)

func ConfigureRouter(e *echo.Echo, controller *controllers.Controllers) {
    e.GET("/health", controller.Health)

    tenaga := e.Group("/tenaga-kesehatan")
    // pertumbuhan endpoints
    tenaga.GET("/pertumbuhan/anak/:anak_id", controller.GetRiwayatPertumbuhan)
    tenaga.POST("/pertumbuhan", controller.AddCatatanPertumbuhan)
    tenaga.PUT("/pertumbuhan/:id", controller.UpdateCatatanPertumbuhan)
    tenaga.DELETE("/pertumbuhan/:id", controller.DeleteCatatanPertumbuhan)
}
