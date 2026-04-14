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

	tenaga := e.Group("/tenaga-kesehatan")
	tenaga.Use(middlewares.JWTAuth(controller.JWTSecret())) // HARUS PERTAMA
	tenaga.Use(middlewares.TenagaKesehatan())               // KEDUA
	tenaga.POST("/ibu-hamil", controller.IbuHamil.Create)
	tenaga.GET("/ibu-hamil", controller.IbuHamil.GetAll)

	// ===== EXISTING ROUTES =====
	tenaga.GET("/anak", controller.Anak.AdminList)
	tenaga.POST("/anak", controller.Anak.Create)
	tenaga.GET("/anak/:id", controller.Anak.Detail)
	tenaga.PUT("/anak/:id", controller.Anak.Update)
	tenaga.DELETE("/anak/:id", controller.Anak.Delete)

	tenaga.GET("/pelayanan-kesehatan-anak", controller.PelayananKesehatanAnak.GetByAnakID)
	tenaga.GET("/pelayanan-kesehatan-anak/:id", controller.PelayananKesehatanAnak.GetByID)
	tenaga.POST("/pelayanan-kesehatan-anak", controller.PelayananKesehatanAnak.CreatePelayananHandler)
	tenaga.PUT("/pelayanan-kesehatan-anak/:id", controller.PelayananKesehatanAnak.Update)
	tenaga.DELETE("/pelayanan-kesehatan-anak/:id", controller.PelayananKesehatanAnak.Delete)

	// ===== NEW ROUTES FOR IBU HAMIL & PEMERIKSAAN =====
	tenaga.POST("/ibu-hamil", controller.IbuHamil.Create)
	tenaga.GET("/ibu-hamil", controller.IbuHamil.GetAll)
	tenaga.GET("/ibu-hamil/:id", controller.IbuHamil.GetByID)
	tenaga.PUT("/ibu-hamil/:id", controller.IbuHamil.Update)
	tenaga.DELETE("/ibu-hamil/:id", controller.IbuHamil.Delete)

	tenaga.POST("/pemeriksaan-kehamilan", controller.PemeriksaanKehamilan.Create)
	tenaga.GET("/pemeriksaan-kehamilan/:id", controller.PemeriksaanKehamilan.GetByID)
	tenaga.GET("/pemeriksaan-kehamilan", controller.PemeriksaanKehamilan.GetByIbuID)
	tenaga.PUT("/pemeriksaan-kehamilan/:id", controller.PemeriksaanKehamilan.Update)
	tenaga.DELETE("/pemeriksaan-kehamilan/:id", controller.PemeriksaanKehamilan.Delete)

	tenaga.POST("/evaluasi-kesehatan-ibu", controller.EvaluasiKesehatanIbu.Create)
	tenaga.GET("/evaluasi-kesehatan-ibu/:id", controller.EvaluasiKesehatanIbu.GetByID)
	tenaga.GET("/evaluasi-kesehatan-ibu", controller.EvaluasiKesehatanIbu.GetByIbuID)
	tenaga.PUT("/evaluasi-kesehatan-ibu/:id", controller.EvaluasiKesehatanIbu.Update)
	tenaga.DELETE("/evaluasi-kesehatan-ibu/:id", controller.EvaluasiKesehatanIbu.Delete)

	tenaga.POST("/riwayat-kehamilan-lalu", controller.RiwayatKehamilanLalu.Create)
	tenaga.GET("/riwayat-kehamilan-lalu/:id", controller.RiwayatKehamilanLalu.GetByID)
	tenaga.GET("/riwayat-kehamilan-lalu", controller.RiwayatKehamilanLalu.GetByEvaluasiID)
	tenaga.PUT("/riwayat-kehamilan-lalu/:id", controller.RiwayatKehamilanLalu.Update)
	tenaga.DELETE("/riwayat-kehamilan-lalu/:id", controller.RiwayatKehamilanLalu.Delete)

	tenaga.POST("/pemeriksaan-dokter-t1", controller.PemeriksaanDokterTrimester1.Create)
	tenaga.GET("/pemeriksaan-dokter-t1/:id", controller.PemeriksaanDokterTrimester1.GetByID)
	tenaga.GET("/pemeriksaan-dokter-t1", controller.PemeriksaanDokterTrimester1.GetByIbuID)
	tenaga.PUT("/pemeriksaan-dokter-t1/:id", controller.PemeriksaanDokterTrimester1.Update)
	tenaga.DELETE("/pemeriksaan-dokter-t1/:id", controller.PemeriksaanDokterTrimester1.Delete)

	tenaga.POST("/pemeriksaan-lab-jiwa", controller.PemeriksaanLaboratoriumJiwa.Create)
	tenaga.GET("/pemeriksaan-lab-jiwa/:id", controller.PemeriksaanLaboratoriumJiwa.GetByID)
	tenaga.GET("/pemeriksaan-lab-jiwa", controller.PemeriksaanLaboratoriumJiwa.GetByIbuID)
	tenaga.PUT("/pemeriksaan-lab-jiwa/:id", controller.PemeriksaanLaboratoriumJiwa.Update)
	tenaga.DELETE("/pemeriksaan-lab-jiwa/:id", controller.PemeriksaanLaboratoriumJiwa.Delete)

	tenaga.POST("/catatan-pelayanan-t1", controller.CatatanPelayananTrimester1.Create)
	tenaga.GET("/catatan-pelayanan-t1/:id", controller.CatatanPelayananTrimester1.GetByID)
	tenaga.GET("/catatan-pelayanan-t1", controller.CatatanPelayananTrimester1.GetByIbuID)
	tenaga.PUT("/catatan-pelayanan-t1/:id", controller.CatatanPelayananTrimester1.Update)
	tenaga.DELETE("/catatan-pelayanan-t1/:id", controller.CatatanPelayananTrimester1.Delete)

	tenaga.POST("/skrining-preeklampsia", controller.SkriningPreeklampsia.Create)
	tenaga.GET("/skrining-preeklampsia/:id", controller.SkriningPreeklampsia.GetByID)
	tenaga.GET("/skrining-preeklampsia", controller.SkriningPreeklampsia.GetByIbuID)
	tenaga.PUT("/skrining-preeklampsia/:id", controller.SkriningPreeklampsia.Update)
	tenaga.DELETE("/skrining-preeklampsia/:id", controller.SkriningPreeklampsia.Delete)

	tenaga.POST("/skrining-dm-gestasional", controller.SkriningDMGestasional.Create)
	tenaga.GET("/skrining-dm-gestasional/:id", controller.SkriningDMGestasional.GetByID)
	tenaga.GET("/skrining-dm-gestasional", controller.SkriningDMGestasional.GetByIbuID)
	tenaga.PUT("/skrining-dm-gestasional/:id", controller.SkriningDMGestasional.Update)
	tenaga.DELETE("/skrining-dm-gestasional/:id", controller.SkriningDMGestasional.Delete)

	tenaga.POST("/catatan-pelayanan-t2", controller.CatatanPelayananTrimester2.Create)
	tenaga.GET("/catatan-pelayanan-t2/:id", controller.CatatanPelayananTrimester2.GetByID)
	tenaga.GET("/catatan-pelayanan-t2", controller.CatatanPelayananTrimester2.GetByIbuID)
	tenaga.PUT("/catatan-pelayanan-t2/:id", controller.CatatanPelayananTrimester2.Update)
	tenaga.DELETE("/catatan-pelayanan-t2/:id", controller.CatatanPelayananTrimester2.Delete)

	tenaga.POST("/pemeriksaan-dokter-t3", controller.PemeriksaanDokterTrimester3.Create)
	tenaga.GET("/pemeriksaan-dokter-t3/:id", controller.PemeriksaanDokterTrimester3.GetByID)
	tenaga.GET("/pemeriksaan-dokter-t3", controller.PemeriksaanDokterTrimester3.GetByIbuID)
	tenaga.PUT("/pemeriksaan-dokter-t3/:id", controller.PemeriksaanDokterTrimester3.Update)
	tenaga.DELETE("/pemeriksaan-dokter-t3/:id", controller.PemeriksaanDokterTrimester3.Delete)

	tenaga.POST("/pemeriksaan-lanjutan-t3", controller.PemeriksaanLanjutanTrimester3.Create)
	tenaga.GET("/pemeriksaan-lanjutan-t3/:id", controller.PemeriksaanLanjutanTrimester3.GetByID)
	tenaga.GET("/pemeriksaan-lanjutan-t3", controller.PemeriksaanLanjutanTrimester3.GetByIbuID)
	tenaga.PUT("/pemeriksaan-lanjutan-t3/:id", controller.PemeriksaanLanjutanTrimester3.Update)
	tenaga.DELETE("/pemeriksaan-lanjutan-t3/:id", controller.PemeriksaanLanjutanTrimester3.Delete)

	tenaga.POST("/catatan-pelayanan-t3", controller.CatatanPelayananTrimester3.Create)
	tenaga.GET("/catatan-pelayanan-t3/:id", controller.CatatanPelayananTrimester3.GetByID)
	tenaga.GET("/catatan-pelayanan-t3", controller.CatatanPelayananTrimester3.GetByIbuID)
	tenaga.PUT("/catatan-pelayanan-t3/:id", controller.CatatanPelayananTrimester3.Update)
	tenaga.DELETE("/catatan-pelayanan-t3/:id", controller.CatatanPelayananTrimester3.Delete)

	tenaga.POST("/grafik-evaluasi-kehamilan", controller.GrafikEvaluasiKehamilan.Create)
	tenaga.GET("/grafik-evaluasi-kehamilan/:id", controller.GrafikEvaluasiKehamilan.GetByID)
	tenaga.GET("/grafik-evaluasi-kehamilan", controller.GrafikEvaluasiKehamilan.GetByIbuID)
	tenaga.PUT("/grafik-evaluasi-kehamilan/:id", controller.GrafikEvaluasiKehamilan.Update)
	tenaga.DELETE("/grafik-evaluasi-kehamilan/:id", controller.GrafikEvaluasiKehamilan.Delete)

	tenaga.POST("/grafik-peningkatan-bb", controller.GrafikPeningkatanBB.Create)
	tenaga.GET("/grafik-peningkatan-bb/:id", controller.GrafikPeningkatanBB.GetByID)
	tenaga.GET("/grafik-peningkatan-bb", controller.GrafikPeningkatanBB.GetByIbuID)
	tenaga.PUT("/grafik-peningkatan-bb/:id", controller.GrafikPeningkatanBB.Update)
	tenaga.DELETE("/grafik-peningkatan-bb/:id", controller.GrafikPeningkatanBB.Delete)

	tenaga.POST("/penjelasan-hasil-grafik", controller.PenjelasanHasilGrafik.Create)
	tenaga.GET("/penjelasan-hasil-grafik/:id", controller.PenjelasanHasilGrafik.GetByID)
	tenaga.GET("/penjelasan-hasil-grafik", controller.PenjelasanHasilGrafik.GetByIbuID)
	tenaga.PUT("/penjelasan-hasil-grafik/:id", controller.PenjelasanHasilGrafik.Update)
	tenaga.DELETE("/penjelasan-hasil-grafik/:id", controller.PenjelasanHasilGrafik.Delete)

	tenaga.POST("/rencana-persalinan", controller.RencanaPersalinan.Create)
	tenaga.GET("/rencana-persalinan/:id", controller.RencanaPersalinan.GetByID)
	tenaga.GET("/rencana-persalinan", controller.RencanaPersalinan.GetByIbuID)
	tenaga.PUT("/rencana-persalinan/:id", controller.RencanaPersalinan.Update)
	tenaga.DELETE("/rencana-persalinan/:id", controller.RencanaPersalinan.Delete)

	tenaga.POST("/ringkasan-persalinan", controller.RingkasanPelayananPersalinan.Create)
	tenaga.GET("/ringkasan-persalinan/:id", controller.RingkasanPelayananPersalinan.GetByID)
	tenaga.GET("/ringkasan-persalinan", controller.RingkasanPelayananPersalinan.GetByIbuID)
	tenaga.PUT("/ringkasan-persalinan/:id", controller.RingkasanPelayananPersalinan.Update)
	tenaga.DELETE("/ringkasan-persalinan/:id", controller.RingkasanPelayananPersalinan.Delete)

	tenaga.POST("/keterangan-lahir", controller.KeteranganLahir.Create)
	tenaga.GET("/keterangan-lahir/:id", controller.KeteranganLahir.GetByID)
	tenaga.GET("/keterangan-lahir", controller.KeteranganLahir.GetByIbuID)
	tenaga.PUT("/keterangan-lahir/:id", controller.KeteranganLahir.Update)
	tenaga.DELETE("/keterangan-lahir/:id", controller.KeteranganLahir.Delete)

	tenaga.POST("/riwayat-proses-melahirkan", controller.RiwayatProsesMelahirkan.Create)
	tenaga.GET("/riwayat-proses-melahirkan/:id", controller.RiwayatProsesMelahirkan.GetByID)
	tenaga.GET("/riwayat-proses-melahirkan", controller.RiwayatProsesMelahirkan.GetByIbuID)
	tenaga.PUT("/riwayat-proses-melahirkan/:id", controller.RiwayatProsesMelahirkan.Update)
	tenaga.DELETE("/riwayat-proses-melahirkan/:id", controller.RiwayatProsesMelahirkan.Delete)

	tenaga.POST("/pelayanan-ibu-nifas", controller.PelayananIbuNifas.Create)
	tenaga.GET("/pelayanan-ibu-nifas/:id", controller.PelayananIbuNifas.GetByID)
	tenaga.GET("/pelayanan-ibu-nifas", controller.PelayananIbuNifas.GetByIbuID)
	tenaga.PUT("/pelayanan-ibu-nifas/:id", controller.PelayananIbuNifas.Update)
	tenaga.DELETE("/pelayanan-ibu-nifas/:id", controller.PelayananIbuNifas.Delete)

	tenaga.POST("/catatan-pelayanan-nifas", controller.CatatanPelayananNifas.Create)
	tenaga.GET("/catatan-pelayanan-nifas/:id", controller.CatatanPelayananNifas.GetByID)
	tenaga.GET("/catatan-pelayanan-nifas", controller.CatatanPelayananNifas.GetByIbuID)
	tenaga.PUT("/catatan-pelayanan-nifas/:id", controller.CatatanPelayananNifas.Update)
	tenaga.DELETE("/catatan-pelayanan-nifas/:id", controller.CatatanPelayananNifas.Delete)

	tenaga.POST("/rujukan", controller.Rujukan.Create)
	tenaga.GET("/rujukan/:id", controller.Rujukan.GetByID)
	tenaga.GET("/rujukan", controller.Rujukan.GetByIbuID)
	tenaga.PUT("/rujukan/:id", controller.Rujukan.Update)
	tenaga.DELETE("/rujukan/:id", controller.Rujukan.Delete)
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
