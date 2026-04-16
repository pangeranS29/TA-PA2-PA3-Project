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
	


	// MODUL IBU | BAGIAN IBU ======================================================= 
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "ok"})
	})
	api := e.Group("/modul-ibu");

	// Kehamilan
	api.GET("/kehamilan/active", controller.GetActiveKehamilan);
	// ANC
	api.GET("/anc/:kehamilan_id", controller.GetRiwayatANC);
	

	// MODUL IBU | BAGIAN NAKES =======================================================
	api.POST("/anc", controller.CreateANC);

	// BAGIAN PREEKLAMPSIA

	api.GET("/preeklampsia/:kehamilan_id", controller.GetSkriningByKehamilan);
	api.POST("/preeklampsia", controller.CreateSkrining);
}
