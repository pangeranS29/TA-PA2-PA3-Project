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
	//untuk get berdasarkan id anak atau keseluruhan
	tenaga.GET("/Pelayanan-Kesehatan-Anak/:id", controller.PelayananKesehatanAnak.GetByID) //untuk get berasarkan id kunjungan
	tenaga.POST("/Pelayanan-Kesehatan-Anak", controller.PelayananKesehatanAnak.CreatePelayananHandler)
	tenaga.PUT("/Pelayanan-Kesehatan-Anak/:id", controller.PelayananKesehatanAnak.Update)
	tenaga.DELETE("/Pelayanan-Kesehatan-Anak/:id", controller.PelayananKesehatanAnak.Delete)

	//CRUD Pelayanan Neonatus Anak
	tenaga.GET("/Neonatus", controller.Neonatus.GetByAnakID) //untuk get berdasarkan id anak atau keseluruhan
	tenaga.GET("/Neonatus/:id", controller.Neonatus.GetByID) //untuk get berasarkan id kunjungan
	tenaga.POST("/Neonatus", controller.Neonatus.CreatePelayananHandler)
	tenaga.PUT("/Neonatus/:id", controller.Neonatus.Update)
	tenaga.DELETE("/Neonatus/:id", controller.Neonatus.Delete)

	//CRUD Pelayanan kunjungan gizi Anak
	tenaga.GET("/Pelayanan-Gizi-Anak", controller.PelayananGiziAnak.GetByAnakID) //untuk get berdasarkan id anak atau keseluruhan
	tenaga.GET("/Pelayanan-Gizi-Anak/:id", controller.PelayananGiziAnak.GetByID) //untuk get berasarkan id kunjungan
	tenaga.POST("/Pelayanan-Gizi-Anak", controller.PelayananGiziAnak.Create)
	tenaga.PUT("/Pelayanan-Gizi-Anak/:id", controller.PelayananGiziAnak.Update)
	tenaga.DELETE("/Pelayanan-Gizi-Anak/:id", controller.PelayananGiziAnak.Delete)

	//CRUD Pelayanan kunjungan gizi Anak
	tenaga.GET("/Pelayanan-Vitamin-ObatCacing", controller.KunjunganVitamin.GetByAnakID) //untuk get berdasarkan id anak atau keseluruhan
	tenaga.GET("/Pelayanan-Vitamin-ObatCacing/:id", controller.KunjunganVitamin.GetByID) //untuk get berasarkan id kunjungan
	tenaga.POST("/Pelayanan-Vitamin-ObatCacing", controller.KunjunganVitamin.Create)
	tenaga.PUT("/Pelayanan-Vitamin-ObatCacing/:id", controller.KunjunganVitamin.Update)
	tenaga.DELETE("/Pelayanan-Vitamin-ObatCacing/:id", controller.KunjunganVitamin.Delete)

	//CRUD Pelayanan kunjungan gizi Anak
	tenaga.GET("/Pelayanan-Imunisasi", controller.KunjunganImunisasi.GetByAnakID) //untuk get berdasarkan id anak atau keseluruhan
	tenaga.GET("/Pelayanan-Imunisasi/:id", controller.KunjunganImunisasi.GetByID) //untuk get berasarkan id kunjungan
	tenaga.POST("/Pelayanan-Imunisasi", controller.KunjunganImunisasi.Create)
	tenaga.PUT("/Pelayanan-Imunisasi/:id", controller.KunjunganImunisasi.Update)
	tenaga.DELETE("/Pelayanan-Imunisasi/:id", controller.KunjunganImunisasi.Delete)

	tenaga.GET("/Pemeriksaan-Gigi", controller.PemeriksaanGigi.GetByAnakID) //untuk get berdasarkan id anak atau keseluruhan
	tenaga.GET("/Pemeriksaan-Gigi/:id", controller.PemeriksaanGigi.GetByID) //untuk get berasarkan id kunjungan
	tenaga.POST("/Pemeriksaan-Gigi", controller.PemeriksaanGigi.Create)
	tenaga.PUT("/Pemeriksaan-Gigi/:id", controller.PemeriksaanGigi.Update)
	tenaga.DELETE("/Pemeriksaan-Gigi/:id", controller.PemeriksaanGigi.Delete)

	tenaga.GET("/Pemantauan-Pertumbuhan-Anak", controller.PemantauanPertumbuhan.GetByAnakID) //untuk get berdasarkan id anak atau keseluruhan
	tenaga.GET("/Pemantauan-Pertumbuhan-Anak/:id", controller.PemantauanPertumbuhan.GetByID) //untuk get berasarkan id kunjungan
	tenaga.POST("/Pemantauan-Pertumbuhan-Anak", controller.PemantauanPertumbuhan.Create)
	tenaga.PUT("/Pemantauan-Pertumbuhan-Anak/:id", controller.PemantauanPertumbuhan.Update)
	tenaga.DELETE("/Pemantauan-Pertumbuhan-Anak/:id", controller.PemantauanPertumbuhan.Delete)

	tenaga.GET("/Pengukuran-LilA", controller.PengukuranLilA.GetByAnakID) //untuk get berdasarkan id anak atau keseluruhan
	tenaga.GET("/Pengukuran-LilA/:id", controller.PengukuranLilA.GetByID) //untuk get berasarkan id kunjungan
	tenaga.POST("/Pengukuran-LilA", controller.PengukuranLilA.Create)
	tenaga.PUT("/Pengukuran-LilA/:id", controller.PengukuranLilA.Update)
	tenaga.DELETE("/Pengukuran-LilA/:id", controller.PengukuranLilA.Delete)

	tenaga.GET("/Catatan-Pelayanan", controller.CatatanPelayanan.GetByAnakID) //untuk get berdasarkan id anak atau keseluruhan
	tenaga.GET("/Catatan-Pelayanan/:id", controller.CatatanPelayanan.GetByID) //untuk get berasarkan id kunjungan
	tenaga.POST("/Catatan-Pelayanan", controller.CatatanPelayanan.Create)
	tenaga.PUT("/Catatan-Pelayanan/:id", controller.CatatanPelayanan.Update)
	tenaga.DELETE("/Catatan-Pelayanan/:id", controller.CatatanPelayanan.Delete)
}
