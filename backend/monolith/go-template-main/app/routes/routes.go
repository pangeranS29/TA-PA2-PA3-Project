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

	// Auth routes
	auth := e.Group("/auth")
	auth.POST("/register", controller.Register)
	auth.POST("/login", controller.Login)
	// auth.POST("/register/ortu", controller.RegisterOrangTua) // registrasi khusus orang tua
	secured := auth.Group("")
	secured.Use(middlewares.JWTAuth(controller.JWTSecret()))
	secured.GET("/me", controller.Me)

	// ==================== INFORMASI UMUM ====================
	informasiUmum := e.Group("/informasi-umum")
	informasiUmum.GET("", controller.InformasiUmum.GetAll)
	informasiUmum.GET("/:id", controller.InformasiUmum.Detail)
	// CRUD dibuka agar web dashboard bisa langsung mengelola Informasi Umum.
	informasiUmum.POST("", controller.InformasiUmum.Create)
	informasiUmum.PUT("/:id", controller.InformasiUmum.Update)
	informasiUmum.DELETE("/:id", controller.InformasiUmum.Delete)

	// ==================== MODUL ADMIN  ====================

	admin := e.Group("/admin")
	admin.Use(middlewares.JWTAuth(controller.JWTSecret()))
	admin.Use(middlewares.AdminOnly())
	admin.POST("/akun-keluarga", controller.AdminCreateAkunKeluarga)
	admin.GET("/kartu-keluarga", controller.AdminListKartuKeluarga)
	admin.GET("/kartu-keluarga/:kartu_keluarga_id", controller.AdminDetailKartuKeluarga)
	admin.PUT("/kartu-keluarga/:kartu_keluarga_id", controller.AdminUpdateKartuKeluarga)
	admin.PUT("/kartu-keluarga/:kartu_keluarga_id/anggota/:penduduk_id", controller.AdminUpdateAnggotaKeluarga)
	admin.POST("/kartu-keluarga/:kartu_keluarga_id/anggota", controller.AdminAddAnggotaKeluarga)
	admin.DELETE("/kartu-keluarga/:kartu_keluarga_id/anggota/:penduduk_id", controller.AdminDeleteAnggotaKeluarga)
	admin.DELETE("/kartu-keluarga/:kartu_keluarga_id", controller.AdminDeleteKartuKeluarga)
	admin.GET("/penduduk/eligible", controller.AdminListEligiblePenduduk)
	admin.POST("/posyandu", controller.AdminTambahPosyandu)
	admin.GET("/posyandu", controller.AdminListPosyandu)
	admin.POST("/bidan", controller.AdminTambahBidan)
	admin.GET("/bidan", controller.AdminListBidan)
	admin.PUT("/bidan/:id", controller.AdminUpdateBidan)
	admin.PATCH("/bidan/:id/status", controller.AdminUpdateStatusBidan)
	admin.POST("/kader", controller.AdminTambahKader)
	admin.GET("/kader", controller.AdminListKader)
	admin.PUT("/kader/:id", controller.AdminUpdateKader)
	admin.PATCH("/kader/:id/status", controller.AdminUpdateStatusKader)

	// Master Standar Routes
	masterStandar := e.Group("/master-standar")
	masterStandar.Use(middlewares.JWTAuth(controller.JWTSecret()))
	// masterStandar.GET("", controller.GetMasterStandar)
	// masterStandar.POST("", controller.CreateMasterStandar)

	// Pertumbuhan Routes
	pertumbuhan := e.Group("/pertumbuhan")
	pertumbuhan.Use(middlewares.JWTAuth(controller.JWTSecret()))
	// pertumbuhan.POST("", controller.AddCatatanPertumbuhan)
	// pertumbuhan.GET("/:anak_id", controller.GetRiwayatPertumbuhan)
	// pertumbuhan.GET("/detail/:id", controller.GetDetailCatatanPertumbuhan)
	// pertumbuhan.PUT("/:id", controller.UpdateCatatanPertumbuhan)
	// pertumbuhan.DELETE("/:id", controller.DeleteCatatanPertumbuhan)

	// Kategori Capaian Routes
	kategoriCapaian := e.Group("/kategori-capaian")
	kategoriCapaian.Use(middlewares.JWTAuth(controller.JWTSecret()))
	// kategoriCapaian.GET("", controller.GetAllKategoriCapaian)
	// kategoriCapaian.GET("/:id", controller.GetKategoriCapaianById)
	// kategoriCapaian.GET("/rentang-usia", controller.GetKategoriCapaianByRentangUsia)
	// kategoriCapaian.POST("", controller.CreateKategoriCapaian)
	// kategoriCapaian.PUT("/:id", controller.UpdateKategoriCapaian)
	// kategoriCapaian.DELETE("/:id", controller.DeleteKategoriCapaian)

	// Perkembangan Routes
	perkembangan := e.Group("/perkembangan")
	perkembangan.Use(middlewares.JWTAuth(controller.JWTSecret()))
	// perkembangan.GET("", controller.GetAllPerkembangan)
	// perkembangan.GET("/:id", controller.GetPerkembanganById)
	// perkembangan.GET("/anak/:anak_id", controller.GetPerkembanganByAnakId)
	// perkembangan.GET("/anak/:anak_id/kategori/:kategori_capaian_id", controller.GetPerkembanganByAnakIdAndKategoriId)
	// perkembangan.POST("", controller.CreatePerkembangan)
	// perkembangan.PUT("/:id", controller.UpdatePerkembangan)
	// perkembangan.DELETE("/:id", controller.DeletePerkembangan)
	// perkembangan.GET("/search", controller.SearchPerkembangan)

	// Group untuk tenaga kesehatan (termasuk bidan, dokter, tenaga-kesehatan)
	tenaga := e.Group("/tenaga-kesehatan")
	tenaga.Use(middlewares.JWTAuth(controller.JWTSecret()))
	tenaga.Use(middlewares.TenagaKesehatan())

	// ==================== MODUL ANAK & PELAYANAN ANAK (yang sudah ada) ====================
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

	tenaga.GET("/Neonatus", controller.Neonatus.GetByAnakID)
	tenaga.GET("/Neonatus/:id", controller.Neonatus.GetByID)
	tenaga.POST("/Neonatus", controller.Neonatus.CreatePelayananHandler)
	tenaga.PUT("/Neonatus/:id", controller.Neonatus.Update)
	tenaga.DELETE("/Neonatus/:id", controller.Neonatus.Delete)

	tenaga.GET("/Pelayanan-Gizi-Anak", controller.PelayananGiziAnak.GetByAnakID)
	tenaga.GET("/Pelayanan-Gizi-Anak/:id", controller.PelayananGiziAnak.GetByID)
	tenaga.POST("/Pelayanan-Gizi-Anak", controller.PelayananGiziAnak.Create)
	tenaga.PUT("/Pelayanan-Gizi-Anak/:id", controller.PelayananGiziAnak.Update)
	tenaga.DELETE("/Pelayanan-Gizi-Anak/:id", controller.PelayananGiziAnak.Delete)

	tenaga.GET("/Pelayanan-Vitamin-ObatCacing", controller.KunjunganVitamin.GetByAnakID)
	tenaga.GET("/Pelayanan-Vitamin-ObatCacing/:id", controller.KunjunganVitamin.GetByID)
	tenaga.POST("/Pelayanan-Vitamin-ObatCacing", controller.KunjunganVitamin.Create)
	tenaga.PUT("/Pelayanan-Vitamin-ObatCacing/:id", controller.KunjunganVitamin.Update)
	tenaga.DELETE("/Pelayanan-Vitamin-ObatCacing/:id", controller.KunjunganVitamin.Delete)

	tenaga.GET("/Pelayanan-Imunisasi", controller.KunjunganImunisasi.GetByAnakID)
	tenaga.GET("/Pelayanan-Imunisasi/:id", controller.KunjunganImunisasi.GetByID)
	tenaga.POST("/Pelayanan-Imunisasi", controller.KunjunganImunisasi.Create)
	tenaga.PUT("/Pelayanan-Imunisasi/:id", controller.KunjunganImunisasi.Update)
	tenaga.DELETE("/Pelayanan-Imunisasi/:id", controller.KunjunganImunisasi.Delete)

	tenaga.GET("/Pemeriksaan-Gigi", controller.PemeriksaanGigi.GetByAnakID)
	tenaga.GET("/Pemeriksaan-Gigi/:id", controller.PemeriksaanGigi.GetByID)
	tenaga.POST("/Pemeriksaan-Gigi", controller.PemeriksaanGigi.Create)
	tenaga.PUT("/Pemeriksaan-Gigi/:id", controller.PemeriksaanGigi.Update)
	tenaga.DELETE("/Pemeriksaan-Gigi/:id", controller.PemeriksaanGigi.Delete)

	tenaga.GET("/Pemantauan-Pertumbuhan-Anak", controller.PemantauanPertumbuhan.GetByAnakID)
	tenaga.GET("/Pemantauan-Pertumbuhan-Anak/:id", controller.PemantauanPertumbuhan.GetByID)
	tenaga.POST("/Pemantauan-Pertumbuhan-Anak", controller.PemantauanPertumbuhan.Create)
	tenaga.PUT("/Pemantauan-Pertumbuhan-Anak/:id", controller.PemantauanPertumbuhan.Update)
	tenaga.DELETE("/Pemantauan-Pertumbuhan-Anak/:id", controller.PemantauanPertumbuhan.Delete)

	tenaga.GET("/Pengukuran-LilA", controller.PengukuranLilA.GetByAnakID)
	tenaga.GET("/Pengukuran-LilA/:id", controller.PengukuranLilA.GetByID)
	tenaga.POST("/Pengukuran-LilA", controller.PengukuranLilA.Create)
	tenaga.PUT("/Pengukuran-LilA/:id", controller.PengukuranLilA.Update)
	tenaga.DELETE("/Pengukuran-LilA/:id", controller.PengukuranLilA.Delete)

	tenaga.GET("/Catatan-Pelayanan", controller.CatatanPelayanan.GetByAnakID)
	tenaga.GET("/Catatan-Pelayanan/:id", controller.CatatanPelayanan.GetByID)
	tenaga.POST("/Catatan-Pelayanan", controller.CatatanPelayanan.Create)
	tenaga.PUT("/Catatan-Pelayanan/:id", controller.CatatanPelayanan.Update)
	tenaga.DELETE("/Catatan-Pelayanan/:id", controller.CatatanPelayanan.Delete)

	// ==================== LEMBAR PEMANTAUAN ANAK ====================
	tenaga.GET("/lembar-pemantauan", controller.LembarPemantauan.GetByAnakID)
	tenaga.GET("/lembar-pemantauan/:id", controller.LembarPemantauan.GetByID)
	tenaga.POST("/lembar-pemantauan", controller.LembarPemantauan.Create)
	tenaga.PUT("/lembar-pemantauan/:id", controller.LembarPemantauan.Update)
	tenaga.DELETE("/lembar-pemantauan/:id", controller.LembarPemantauan.Delete)

	// ==================== MODUL IBU & KEHAMILAN ====================
	tenaga.POST("/ibu", controller.Ibu.Create)
	tenaga.GET("/ibu", controller.Ibu.GetAll)
	tenaga.GET("/ibu/:id", controller.Ibu.GetByID)
	tenaga.PUT("/ibu/:id", controller.Ibu.Update)
	tenaga.DELETE("/ibu/:id", controller.Ibu.Delete)

	tenaga.POST("/kehamilan", controller.Kehamilan.Create)
	tenaga.GET("/kehamilan/:id", controller.Kehamilan.GetByID)
	tenaga.GET("/kehamilan", controller.Kehamilan.GetByIbuID)
	tenaga.PUT("/kehamilan/:id", controller.Kehamilan.Update)
	tenaga.DELETE("/kehamilan/:id", controller.Kehamilan.Delete)

	// ==================== PEMERIKSAAN KEHAMILAN (RUTIN) ====================
	tenaga.POST("/pemeriksaan-kehamilan", controller.PemeriksaanKehamilan.Create)
	tenaga.GET("/pemeriksaan-kehamilan/:id", controller.PemeriksaanKehamilan.GetByID)
	tenaga.GET("/pemeriksaan-kehamilan", controller.PemeriksaanKehamilan.GetByKehamilanID)
	tenaga.PUT("/pemeriksaan-kehamilan/:id", controller.PemeriksaanKehamilan.Update)
	tenaga.DELETE("/pemeriksaan-kehamilan/:id", controller.PemeriksaanKehamilan.Delete)

	// ==================== EVALUASI KESEHATAN IBU ====================
	tenaga.POST("/evaluasi-kesehatan-ibu", controller.EvaluasiKesehatanIbu.Create)
	tenaga.GET("/evaluasi-kesehatan-ibu/:id", controller.EvaluasiKesehatanIbu.GetByID)
	tenaga.GET("/evaluasi-kesehatan-ibu", controller.EvaluasiKesehatanIbu.GetByKehamilanID)
	tenaga.PUT("/evaluasi-kesehatan-ibu/:id", controller.EvaluasiKesehatanIbu.Update)
	tenaga.DELETE("/evaluasi-kesehatan-ibu/:id", controller.EvaluasiKesehatanIbu.Delete)

	// ==================== RIWAYAT KEHAMILAN LALU (terhubung ke evaluasi) ====================
	tenaga.POST("/riwayat-kehamilan-lalu", controller.RiwayatKehamilanLalu.Create)
	tenaga.GET("/riwayat-kehamilan-lalu/:id", controller.RiwayatKehamilanLalu.GetByID)
	tenaga.GET("/riwayat-kehamilan-lalu", controller.RiwayatKehamilanLalu.GetByEvaluasiID)
	tenaga.PUT("/riwayat-kehamilan-lalu/:id", controller.RiwayatKehamilanLalu.Update)
	tenaga.DELETE("/riwayat-kehamilan-lalu/:id", controller.RiwayatKehamilanLalu.Delete)

	// ==================== PEMERIKSAAN DOKTER TRIMESTER 1 ====================
	tenaga.POST("/pemeriksaan-dokter-t1", controller.PemeriksaanDokterTrimester1.Create)
	tenaga.GET("/pemeriksaan-dokter-t1/:id", controller.PemeriksaanDokterTrimester1.GetByID)
	tenaga.GET("/pemeriksaan-dokter-t1", controller.PemeriksaanDokterTrimester1.GetByKehamilanID)
	tenaga.PUT("/pemeriksaan-dokter-t1/:id", controller.PemeriksaanDokterTrimester1.Update)
	tenaga.DELETE("/pemeriksaan-dokter-t1/:id", controller.PemeriksaanDokterTrimester1.Delete)

	// ==================== PEMERIKSAAN LABORATORIUM & JIWA ====================
	tenaga.POST("/pemeriksaan-lab-jiwa", controller.PemeriksaanLaboratoriumJiwa.Create)
	tenaga.GET("/pemeriksaan-lab-jiwa/:id", controller.PemeriksaanLaboratoriumJiwa.GetByID)
	tenaga.GET("/pemeriksaan-lab-jiwa", controller.PemeriksaanLaboratoriumJiwa.GetByKehamilanID)
	tenaga.PUT("/pemeriksaan-lab-jiwa/:id", controller.PemeriksaanLaboratoriumJiwa.Update)
	tenaga.DELETE("/pemeriksaan-lab-jiwa/:id", controller.PemeriksaanLaboratoriumJiwa.Delete)

	// ==================== CATATAN PELAYANAN TRIMESTER 1 ====================
	tenaga.POST("/catatan-pelayanan-t1", controller.CatatanPelayananTrimester1.Create)
	tenaga.GET("/catatan-pelayanan-t1/:id", controller.CatatanPelayananTrimester1.GetByID)
	tenaga.GET("/catatan-pelayanan-t1", controller.CatatanPelayananTrimester1.GetByKehamilanID)
	tenaga.PUT("/catatan-pelayanan-t1/:id", controller.CatatanPelayananTrimester1.Update)
	tenaga.DELETE("/catatan-pelayanan-t1/:id", controller.CatatanPelayananTrimester1.Delete)

	// ==================== CATATAN PELAYANAN TRIMESTER 2 ====================
	tenaga.POST("/catatan-pelayanan-t2", controller.CatatanPelayananTrimester2.Create)
	tenaga.GET("/catatan-pelayanan-t2/:id", controller.CatatanPelayananTrimester2.GetByID)
	tenaga.GET("/catatan-pelayanan-t2", controller.CatatanPelayananTrimester2.GetByKehamilanID)
	tenaga.PUT("/catatan-pelayanan-t2/:id", controller.CatatanPelayananTrimester2.Update)
	tenaga.DELETE("/catatan-pelayanan-t2/:id", controller.CatatanPelayananTrimester2.Delete)

	// ==================== CATATAN PELAYANAN TRIMESTER 3 ====================
	tenaga.POST("/catatan-pelayanan-t3", controller.CatatanPelayananTrimester3.Create)
	tenaga.GET("/catatan-pelayanan-t3/:id", controller.CatatanPelayananTrimester3.GetByID)
	tenaga.GET("/catatan-pelayanan-t3", controller.CatatanPelayananTrimester3.GetByKehamilanID)
	tenaga.PUT("/catatan-pelayanan-t3/:id", controller.CatatanPelayananTrimester3.Update)
	tenaga.DELETE("/catatan-pelayanan-t3/:id", controller.CatatanPelayananTrimester3.Delete)

	// ==================== CATATAN PELAYANAN NIFAS ====================
	tenaga.POST("/catatan-pelayanan-nifas", controller.CatatanPelayananNifas.Create)
	tenaga.GET("/catatan-pelayanan-nifas/:id", controller.CatatanPelayananNifas.GetByID)
	tenaga.GET("/catatan-pelayanan-nifas", controller.CatatanPelayananNifas.GetByKehamilanID)
	tenaga.PUT("/catatan-pelayanan-nifas/:id", controller.CatatanPelayananNifas.Update)
	tenaga.DELETE("/catatan-pelayanan-nifas/:id", controller.CatatanPelayananNifas.Delete)

	// ==================== GRAFIK EVALUASI KEHAMILAN ====================
	tenaga.POST("/grafik-evaluasi-kehamilan", controller.GrafikEvaluasiKehamilan.Create)
	tenaga.GET("/grafik-evaluasi-kehamilan/grafik", controller.GrafikEvaluasiKehamilan.GetGrafik)
	tenaga.GET("/grafik-evaluasi-kehamilan/:id", controller.GrafikEvaluasiKehamilan.GetByID)
	tenaga.GET("/grafik-evaluasi-kehamilan", controller.GrafikEvaluasiKehamilan.GetByKehamilanID)
	tenaga.PUT("/grafik-evaluasi-kehamilan/:id", controller.GrafikEvaluasiKehamilan.Update)
	tenaga.DELETE("/grafik-evaluasi-kehamilan/:id", controller.GrafikEvaluasiKehamilan.Delete)

	// ==================== GRAFIK PENINGKATAN BERAT BADAN ====================
	tenaga.POST("/grafik-peningkatan-bb", controller.GrafikPeningkatanBB.Create)
	tenaga.GET("/grafik-peningkatan-bb/:id", controller.GrafikPeningkatanBB.GetByID)
	tenaga.GET("/grafik-peningkatan-bb", controller.GrafikPeningkatanBB.GetByKehamilanID)
	tenaga.PUT("/grafik-peningkatan-bb/:id", controller.GrafikPeningkatanBB.Update)
	tenaga.DELETE("/grafik-peningkatan-bb/:id", controller.GrafikPeningkatanBB.Delete)

	// ==================== PENJELASAN HASIL GRAFIK ====================
	tenaga.POST("/penjelasan-hasil-grafik", controller.PenjelasanHasilGrafik.Create)
	tenaga.GET("/penjelasan-hasil-grafik/:id", controller.PenjelasanHasilGrafik.GetByID)
	tenaga.GET("/penjelasan-hasil-grafik", controller.PenjelasanHasilGrafik.GetByKehamilanID)
	tenaga.PUT("/penjelasan-hasil-grafik/:id", controller.PenjelasanHasilGrafik.Update)
	tenaga.DELETE("/penjelasan-hasil-grafik/:id", controller.PenjelasanHasilGrafik.Delete)

	// ==================== RENCANA PERSALINAN ====================
	tenaga.POST("/rencana-persalinan", controller.RencanaPersalinan.Create)
	tenaga.GET("/rencana-persalinan/:id", controller.RencanaPersalinan.GetByID)
	tenaga.GET("/rencana-persalinan", controller.RencanaPersalinan.GetByKehamilanID)
	tenaga.PUT("/rencana-persalinan/:id", controller.RencanaPersalinan.Update)
	tenaga.DELETE("/rencana-persalinan/:id", controller.RencanaPersalinan.Delete)

	// ==================== RINGKASAN PELAYANAN PERSALINAN ====================
	tenaga.POST("/ringkasan-persalinan", controller.RingkasanPelayananPersalinan.Create)
	tenaga.GET("/ringkasan-persalinan/:id", controller.RingkasanPelayananPersalinan.GetByID)
	tenaga.GET("/ringkasan-persalinan", controller.RingkasanPelayananPersalinan.GetByKehamilanID)
	tenaga.PUT("/ringkasan-persalinan/:id", controller.RingkasanPelayananPersalinan.Update)
	tenaga.DELETE("/ringkasan-persalinan/:id", controller.RingkasanPelayananPersalinan.Delete)

	// ==================== RIWAYAT PROSES MELAHIRKAN ====================
	tenaga.POST("/riwayat-proses-melahirkan", controller.RiwayatProsesMelahirkan.Create)
	tenaga.GET("/riwayat-proses-melahirkan/:id", controller.RiwayatProsesMelahirkan.GetByID)
	tenaga.GET("/riwayat-proses-melahirkan", controller.RiwayatProsesMelahirkan.GetByKehamilanID)
	tenaga.PUT("/riwayat-proses-melahirkan/:id", controller.RiwayatProsesMelahirkan.Update)
	tenaga.DELETE("/riwayat-proses-melahirkan/:id", controller.RiwayatProsesMelahirkan.Delete)

	// ==================== KETERANGAN LAHIR ====================
	tenaga.POST("/keterangan-lahir", controller.KeteranganLahir.Create)
	tenaga.GET("/keterangan-lahir/:id", controller.KeteranganLahir.GetByID)
	tenaga.GET("/keterangan-lahir", controller.KeteranganLahir.GetByIbuID) // menggunakan ibu_id relasi
	tenaga.PUT("/keterangan-lahir/:id", controller.KeteranganLahir.Update)
	tenaga.DELETE("/keterangan-lahir/:id", controller.KeteranganLahir.Delete)

	// ==================== PELAYANAN IBU NIFAS ====================
	tenaga.POST("/pelayanan-ibu-nifas", controller.PelayananIbuNifas.Create)
	tenaga.GET("/pelayanan-ibu-nifas/:id", controller.PelayananIbuNifas.GetByID)
	tenaga.GET("/pelayanan-ibu-nifas", controller.PelayananIbuNifas.GetByKehamilanID)
	tenaga.PUT("/pelayanan-ibu-nifas/:id", controller.PelayananIbuNifas.Update)
	tenaga.DELETE("/pelayanan-ibu-nifas/:id", controller.PelayananIbuNifas.Delete)

	// ==================== SKRINING PRE-EKLAMPSIA ====================
	tenaga.POST("/skrining-preeklampsia", controller.SkriningPreeklampsia.Create)
	tenaga.GET("/skrining-preeklampsia/:id", controller.SkriningPreeklampsia.GetByID)
	tenaga.GET("/skrining-preeklampsia", controller.SkriningPreeklampsia.GetByKehamilanID)
	tenaga.PUT("/skrining-preeklampsia/:id", controller.SkriningPreeklampsia.Update)
	tenaga.DELETE("/skrining-preeklampsia/:id", controller.SkriningPreeklampsia.Delete)

	// ==================== SKRINING DIABETES MELITUS GESTASIONAL ====================
	tenaga.POST("/skrining-dm-gestasional", controller.SkriningDMGestasional.Create)
	tenaga.GET("/skrining-dm-gestasional/:id", controller.SkriningDMGestasional.GetByID)
	tenaga.GET("/skrining-dm-gestasional", controller.SkriningDMGestasional.GetByKehamilanID)
	tenaga.PUT("/skrining-dm-gestasional/:id", controller.SkriningDMGestasional.Update)
	tenaga.DELETE("/skrining-dm-gestasional/:id", controller.SkriningDMGestasional.Delete)

	// ==================== RUJUKAN ====================
	tenaga.POST("/rujukan", controller.Rujukan.Create)
	tenaga.GET("/rujukan/:id", controller.Rujukan.GetByID)
	tenaga.GET("/rujukan", controller.Rujukan.GetByKehamilanID)
	tenaga.PUT("/rujukan/:id", controller.Rujukan.Update)
	tenaga.DELETE("/rujukan/:id", controller.Rujukan.Delete)

	// ==================== PEMERIKSAAN DOKTER TRIMESTER 3 ====================
	tenaga.POST("/pemeriksaan-dokter-t3", controller.PemeriksaanDokterTrimester3.Create)
	tenaga.GET("/pemeriksaan-dokter-t3/:id", controller.PemeriksaanDokterTrimester3.GetByID)
	tenaga.GET("/pemeriksaan-dokter-t3", controller.PemeriksaanDokterTrimester3.GetByKehamilanID)
	tenaga.PUT("/pemeriksaan-dokter-t3/:id", controller.PemeriksaanDokterTrimester3.Update)
	tenaga.DELETE("/pemeriksaan-dokter-t3/:id", controller.PemeriksaanDokterTrimester3.Delete)

	// ==================== PEMERIKSAAN LANJUTAN TRIMESTER 3 ====================
	tenaga.POST("/pemeriksaan-lanjutan-t3", controller.PemeriksaanLanjutanTrimester3.Create)
	tenaga.GET("/pemeriksaan-lanjutan-t3/:id", controller.PemeriksaanLanjutanTrimester3.GetByID)
	tenaga.GET("/pemeriksaan-lanjutan-t3", controller.PemeriksaanLanjutanTrimester3.GetByKehamilanID)
	tenaga.PUT("/pemeriksaan-lanjutan-t3/:id", controller.PemeriksaanLanjutanTrimester3.Update)
	tenaga.DELETE("/pemeriksaan-lanjutan-t3/:id", controller.PemeriksaanLanjutanTrimester3.Delete)

	// ==================== KARTU KELUARGA ====================
	// tenaga.GET("/kartu-keluarga", controller.KartuKeluarga.GetAll)
	// tenaga.POST("/kartu-keluarga", controller.KartuKeluarga.Create)
	// tenaga.GET("/kartu-keluarga/:id", controller.KartuKeluarga.GetByID)
	// tenaga.GET("/kartu-keluarga/no-kk/:no_kk", controller.KartuKeluarga.GetByNoKartuKeluarga)
	// tenaga.PUT("/kartu-keluarga/:id", controller.KartuKeluarga.Update)
	// tenaga.DELETE("/kartu-keluarga/:id", controller.KartuKeluarga.Delete)

	// ==================== KEPENDUDUKAN ====================
	// tenaga.GET("/kependudukan", controller.Kependudukan.GetAll)
	// tenaga.POST("/kependudukan", controller.Kependudukan.Create)
	// tenaga.GET("/kependudukan/:id", controller.Kependudukan.GetByID)
	// // tenaga.GET("/kep// endudukan/kartu-keluarga/:kartu_keluarga_id", controller.Kependudukan.GetByKartuKeluargaID)
	// tenaga.PUT("/kependudukan/:id", controller.Kependudukan.Update)
	// tenaga.DELETE("/kependudukan/:id", controller.Kependudukan.Delete)

	//jenis pelayanan neonatus
	tenaga.GET("/jenis-pelayanan", controller.JenisPelayanan.GetJenisPelayanan)

	ibu := e.Group("/ibu")
	ibu.Use(middlewares.JWTAuth(controller.JWTSecret()))
	ibu.Use(middlewares.Ibu())
	ibu.GET("/anak", controller.Ibu.GetAnakSaya)
	ibu.GET("/lembar-pemantauan/rentang-usia", controller.LembarPemantauan.GetRentangUsiaForIbu)
	ibu.GET("/lembar-pemantauan/kategori-tanda-sakit", controller.LembarPemantauan.GetKategoriByRentangUsiaForIbu)
	ibu.POST("/lembar-pemantauan", controller.LembarPemantauan.CreateForIbu)
	ibu.GET("/lembar-pemantauan", controller.LembarPemantauan.GetByAnakIDForIbu)

}
