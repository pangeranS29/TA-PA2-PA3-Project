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

	// Master Standar Routes
	masterStandar := e.Group("/master-standar")
	masterStandar.Use(middlewares.JWTAuth(controller.JWTSecret()))
	masterStandar.GET("", controller.GetMasterStandar)
	masterStandar.POST("", controller.CreateMasterStandar)

	// Pertumbuhan Routes
	pertumbuhan := e.Group("/pertumbuhan")
	pertumbuhan.Use(middlewares.JWTAuth(controller.JWTSecret()))
	pertumbuhan.POST("", controller.AddCatatanPertumbuhan)
	pertumbuhan.GET("/:anak_id", controller.GetRiwayatPertumbuhan)
	pertumbuhan.GET("/detail/:id", controller.GetDetailCatatanPertumbuhan)
	pertumbuhan.PUT("/:id", controller.UpdateCatatanPertumbuhan)
	pertumbuhan.DELETE("/:id", controller.DeleteCatatanPertumbuhan)

	// Kategori Capaian Routes
	kategoriCapaian := e.Group("/kategori-capaian")
	kategoriCapaian.Use(middlewares.JWTAuth(controller.JWTSecret()))
	kategoriCapaian.GET("", controller.GetAllKategoriCapaian)
	kategoriCapaian.GET("/:id", controller.GetKategoriCapaianById)
	kategoriCapaian.GET("/rentang-usia", controller.GetKategoriCapaianByRentangUsia)
	kategoriCapaian.POST("", controller.CreateKategoriCapaian)
	kategoriCapaian.PUT("/:id", controller.UpdateKategoriCapaian)
	kategoriCapaian.DELETE("/:id", controller.DeleteKategoriCapaian)

	// Perkembangan Routes
	perkembangan := e.Group("/perkembangan")
	perkembangan.Use(middlewares.JWTAuth(controller.JWTSecret()))
	perkembangan.GET("", controller.GetAllPerkembangan)
	perkembangan.GET("/:id", controller.GetPerkembanganById)
	perkembangan.GET("/anak/:anak_id", controller.GetPerkembanganByAnakId)
	perkembangan.GET("/anak/:anak_id/kategori/:kategori_capaian_id", controller.GetPerkembanganByAnakIdAndKategoriId)
	perkembangan.POST("", controller.CreatePerkembangan)
	perkembangan.PUT("/:id", controller.UpdatePerkembangan)
	perkembangan.DELETE("/:id", controller.DeletePerkembangan)
	perkembangan.GET("/search", controller.SearchPerkembangan)

}
