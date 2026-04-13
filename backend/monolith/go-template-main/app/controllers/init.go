package controllers

import (
	"monitoring-service/app/usecases"
	"monitoring-service/pkg/config"
)

type Main struct {
	usecases *usecases.Main
	config   *config.Config

	// Controller yang sudah ada
	Anak                   *AnakController
	PelayananKesehatanAnak *PelayananKesehatanAnakController

	// Controller baru
	IbuHamil                      *IbuHamilController
	PemeriksaanKehamilan          *PemeriksaanKehamilanController
	EvaluasiKesehatanIbu          *EvaluasiKesehatanIbuController
	RiwayatKehamilanLalu          *RiwayatKehamilanLaluController
	PemeriksaanDokterTrimester1   *PemeriksaanDokterTrimester1Controller
	PemeriksaanLaboratoriumJiwa   *PemeriksaanLaboratoriumJiwaController
	CatatanPelayananTrimester1    *CatatanPelayananTrimester1Controller
	SkriningPreeklampsia          *SkriningPreeklampsiaController
	SkriningDMGestasional         *SkriningDMGestasionalController
	CatatanPelayananTrimester2    *CatatanPelayananTrimester2Controller
	PemeriksaanDokterTrimester3   *PemeriksaanDokterTrimester3Controller
	PemeriksaanLanjutanTrimester3 *PemeriksaanLanjutanTrimester3Controller
	CatatanPelayananTrimester3    *CatatanPelayananTrimester3Controller
	GrafikEvaluasiKehamilan       *GrafikEvaluasiKehamilanController
	GrafikPeningkatanBB           *GrafikPeningkatanBBController
	PenjelasanHasilGrafik         *PenjelasanHasilGrafikController
	RencanaPersalinan             *RencanaPersalinanController
	RingkasanPelayananPersalinan  *RingkasanPelayananPersalinanController
	KeteranganLahir               *KeteranganLahirController
	RiwayatProsesMelahirkan       *RiwayatProsesMelahirkanController
	PelayananIbuNifas             *PelayananIbuNifasController
	CatatanPelayananNifas         *CatatanPelayananNifasController
	Rujukan                       *RujukanController
}

type Options struct {
	Config   *config.Config
	UseCases *usecases.Main
}

func Init(opts Options) *Main {
	m := &Main{
		usecases: opts.UseCases,
		config:   opts.Config,
	}

	// Controller yang sudah ada
	m.Anak = NewAnakController(opts.UseCases.Anak)
	m.PelayananKesehatanAnak = NewPelayananKesehatanAnakController(opts.UseCases.PelayananKesehatanAnak)

	// Controller baru (pastikan usecases sudah terisi)
	m.IbuHamil = NewIbuHamilController(opts.UseCases.IbuHamil)
	m.PemeriksaanKehamilan = NewPemeriksaanKehamilanController(opts.UseCases.PemeriksaanKehamilan)
	m.EvaluasiKesehatanIbu = NewEvaluasiKesehatanIbuController(opts.UseCases.EvaluasiKesehatanIbu)
	m.RiwayatKehamilanLalu = NewRiwayatKehamilanLaluController(opts.UseCases.RiwayatKehamilanLalu)
	m.PemeriksaanDokterTrimester1 = NewPemeriksaanDokterTrimester1Controller(opts.UseCases.PemeriksaanDokterTrimester1)
	m.PemeriksaanLaboratoriumJiwa = NewPemeriksaanLaboratoriumJiwaController(opts.UseCases.PemeriksaanLaboratoriumJiwa)
	m.CatatanPelayananTrimester1 = NewCatatanPelayananTrimester1Controller(opts.UseCases.CatatanPelayananTrimester1)
	m.SkriningPreeklampsia = NewSkriningPreeklampsiaController(opts.UseCases.SkriningPreeklampsia)
	m.SkriningDMGestasional = NewSkriningDMGestasionalController(opts.UseCases.SkriningDMGestasional)
	m.CatatanPelayananTrimester2 = NewCatatanPelayananTrimester2Controller(opts.UseCases.CatatanPelayananTrimester2)
	m.PemeriksaanDokterTrimester3 = NewPemeriksaanDokterTrimester3Controller(opts.UseCases.PemeriksaanDokterTrimester3)
	m.PemeriksaanLanjutanTrimester3 = NewPemeriksaanLanjutanTrimester3Controller(opts.UseCases.PemeriksaanLanjutanTrimester3)
	m.CatatanPelayananTrimester3 = NewCatatanPelayananTrimester3Controller(opts.UseCases.CatatanPelayananTrimester3)
	m.GrafikEvaluasiKehamilan = NewGrafikEvaluasiKehamilanController(opts.UseCases.GrafikEvaluasiKehamilan)
	m.GrafikPeningkatanBB = NewGrafikPeningkatanBBController(opts.UseCases.GrafikPeningkatanBB)
	m.PenjelasanHasilGrafik = NewPenjelasanHasilGrafikController(opts.UseCases.PenjelasanHasilGrafik)
	m.RencanaPersalinan = NewRencanaPersalinanController(opts.UseCases.RencanaPersalinan)
	m.RingkasanPelayananPersalinan = NewRingkasanPelayananPersalinanController(opts.UseCases.RingkasanPelayananPersalinan)
	m.KeteranganLahir = NewKeteranganLahirController(opts.UseCases.KeteranganLahir)
	m.RiwayatProsesMelahirkan = NewRiwayatProsesMelahirkanController(opts.UseCases.RiwayatProsesMelahirkan)
	m.PelayananIbuNifas = NewPelayananIbuNifasController(opts.UseCases.PelayananIbuNifas)
	m.CatatanPelayananNifas = NewCatatanPelayananNifasController(opts.UseCases.CatatanPelayananNifas)
	m.Rujukan = NewRujukanController(opts.UseCases.Rujukan)

	return m
}

func (m *Main) JWTSecret() string {
	return m.config.JWTSecret
}
