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
	//jwt
	secured := auth.Group("")
	secured.Use(middlewares.JWTAuth(controller.JWTSecret()))
	secured.GET("/me", controller.Me)

	//akses role
	tenaga := e.Group("/tenaga-kesehatan")
	tenaga.Use(middlewares.JWTAuth(controller.JWTSecret()))
	tenaga.Use(middlewares.TenagaKesehatan())

	//CRUD Anak
	tenaga.GET("/anak", controller.Anak.AdminList)
	tenaga.POST("/anak", controller.Anak.Create)
	tenaga.GET("/anak/:id", controller.Anak.Detail)
	tenaga.PUT("/anak/:id", controller.Anak.Update)
	tenaga.DELETE("/anak/:id", controller.Anak.Delete)

	//CRUD Pelayanan Kesehtan Anak
	tenaga.GET("/Pelayanan-Kesehatan-Anak", controller.PelayananKesehatanAnak.GetByAnakID) //untuk get berdasarkan id anak atau keseluruhan
	tenaga.GET("/Pelayanan-Kesehatan-Anak/:id", controller.PelayananKesehatanAnak.GetByID)  //untuk get berasarkan id kunjungan
	tenaga.POST("/Pelayanan-Kesehatan-Anak", controller.PelayananKesehatanAnak.CreatePelayananHandler)
	tenaga.PUT("/Pelayanan-Kesehatan-Anak/:id", controller.PelayananKesehatanAnak.Update)
	tenaga.DELETE("/Pelayanan-Kesehatan-Anak/:id", controller.PelayananKesehatanAnak.Delete)

}
