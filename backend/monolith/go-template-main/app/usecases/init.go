package usecases

import (
	"monitoring-service/app/repositories"
	"monitoring-service/pkg/config"
)

type Main struct {
	repository *repositories.Main
	config     *config.Config

	// Existing usecases
	Anak                   *AnakUseCase
	PelayananKesehatanAnak PelayananKesehatanAnakUseCase
	Neonatus               NeonatusUsecase
	KunjunganGizi          KunjunganGiziUseCase
	KunjunganVitamin       KunjunganVitaminUseCase
	KunjunganImunisasi     KunjunganImunisasiUseCase
	PemeriksaanGigi        PemeriksaanGigiUseCase
	PemantauanPertumbuhan  PemantauanPertumbuhanAnakUseCase
	PengukuranLilA         PengukuranLilAUseCase
	CatatanPelayanan       CatatanPelayananUseCase

	// New usecases
	IbuHamil                      IbuHamilUsecase
	PemeriksaanKehamilan          PemeriksaanKehamilanUsecase
	EvaluasiKesehatanIbu          EvaluasiKesehatanIbuUsecase
	RiwayatKehamilanLalu          RiwayatKehamilanLaluUsecase
	PemeriksaanDokterTrimester1   PemeriksaanDokterTrimester1Usecase
	PemeriksaanLaboratoriumJiwa   PemeriksaanLaboratoriumJiwaUsecase
	CatatanPelayananTrimester1    CatatanPelayananTrimester1Usecase
	SkriningPreeklampsia          SkriningPreeklampsiaUsecase
	SkriningDMGestasional         SkriningDMGestasionalUsecase
	CatatanPelayananTrimester2    CatatanPelayananTrimester2Usecase
	PemeriksaanDokterTrimester3   PemeriksaanDokterTrimester3Usecase
	PemeriksaanLanjutanTrimester3 PemeriksaanLanjutanTrimester3Usecase
	CatatanPelayananTrimester3    CatatanPelayananTrimester3Usecase
	GrafikEvaluasiKehamilan       GrafikEvaluasiKehamilanUsecase
	GrafikPeningkatanBB           GrafikPeningkatanBBUsecase
	PenjelasanHasilGrafik         PenjelasanHasilGrafikUsecase
	RencanaPersalinan             RencanaPersalinanUsecase
	RingkasanPelayananPersalinan  RingkasanPelayananPersalinanUsecase
	KeteranganLahir               KeteranganLahirUsecase
	RiwayatProsesMelahirkan       RiwayatProsesMelahirkanUsecase
	PelayananIbuNifas             PelayananIbuNifasUsecase
	CatatanPelayananNifas         CatatanPelayananNifasUsecase
	Rujukan                       RujukanUsecase
}

type Options struct {
	Repository *repositories.Main
	Config     *config.Config
}

func Init(opts Options) *Main {
	m := &Main{
		repository: opts.Repository,
		config:     opts.Config,
	}

	// Existing usecases
	m.Anak = NewAnakUseCase(opts.Repository.Anak)
	m.PelayananKesehatanAnak = NewPelayananKesehatanAnakUseCase(opts.Repository.PelayananKesehatanAnak)

	// New usecases
	m.IbuHamil = NewIbuHamilUsecase(opts.Repository.IbuHamil)
	m.PemeriksaanKehamilan = NewPemeriksaanKehamilanUsecase(opts.Repository.PemeriksaanKehamilan)
	m.EvaluasiKesehatanIbu = NewEvaluasiKesehatanIbuUsecase(opts.Repository.EvaluasiKesehatanIbu)
	m.RiwayatKehamilanLalu = NewRiwayatKehamilanLaluUsecase(opts.Repository.RiwayatKehamilanLalu)
	m.PemeriksaanDokterTrimester1 = NewPemeriksaanDokterTrimester1Usecase(opts.Repository.PemeriksaanDokterTrimester1)
	m.PemeriksaanLaboratoriumJiwa = NewPemeriksaanLaboratoriumJiwaUsecase(opts.Repository.PemeriksaanLaboratoriumJiwa)
	m.CatatanPelayananTrimester1 = NewCatatanPelayananTrimester1Usecase(opts.Repository.CatatanPelayananTrimester1)
	m.SkriningPreeklampsia = NewSkriningPreeklampsiaUsecase(opts.Repository.SkriningPreeklampsia)
	m.SkriningDMGestasional = NewSkriningDMGestasionalUsecase(opts.Repository.SkriningDMGestasional)
	m.CatatanPelayananTrimester2 = NewCatatanPelayananTrimester2Usecase(opts.Repository.CatatanPelayananTrimester2)
	m.PemeriksaanDokterTrimester3 = NewPemeriksaanDokterTrimester3Usecase(opts.Repository.PemeriksaanDokterTrimester3)
	m.PemeriksaanLanjutanTrimester3 = NewPemeriksaanLanjutanTrimester3Usecase(opts.Repository.PemeriksaanLanjutanTrimester3)
	m.CatatanPelayananTrimester3 = NewCatatanPelayananTrimester3Usecase(opts.Repository.CatatanPelayananTrimester3)
	m.GrafikEvaluasiKehamilan = NewGrafikEvaluasiKehamilanUsecase(opts.Repository.GrafikEvaluasiKehamilan)
	m.GrafikPeningkatanBB = NewGrafikPeningkatanBBUsecase(opts.Repository.GrafikPeningkatanBB)
	m.PenjelasanHasilGrafik = NewPenjelasanHasilGrafikUsecase(opts.Repository.PenjelasanHasilGrafik)
	m.RencanaPersalinan = NewRencanaPersalinanUsecase(opts.Repository.RencanaPersalinan)
	m.RingkasanPelayananPersalinan = NewRingkasanPelayananPersalinanUsecase(opts.Repository.RingkasanPelayananPersalinan)
	m.KeteranganLahir = NewKeteranganLahirUsecase(opts.Repository.KeteranganLahir)
	m.RiwayatProsesMelahirkan = NewRiwayatProsesMelahirkanUsecase(opts.Repository.RiwayatProsesMelahirkan)
	m.PelayananIbuNifas = NewPelayananIbuNifasUsecase(opts.Repository.PelayananIbuNifas)
	m.CatatanPelayananNifas = NewCatatanPelayananNifasUsecase(opts.Repository.CatatanPelayananNifas)
	m.Rujukan = NewRujukanUsecase(opts.Repository.Rujukan)
	m.Neonatus = NewPelayananNeonatusUseCase(opts.Repository.Neonatus)
	m.KunjunganGizi = NewKunjunganGiziUseCase(opts.Repository.KunjunganGizi)
	m.KunjunganVitamin = NewKunjunganVitaminUseCase(opts.Repository.KunjunganVitamin)
	m.KunjunganImunisasi = NewKunjunganImunisasiUseCase(opts.Repository.KunjunganImunisasi)
	m.PemeriksaanGigi = NewPemeriksaanGigiUseCase(opts.Repository.PemeriksaanGigi)
	m.PemantauanPertumbuhan = NewPemantauanPertumbuhanUseCase(opts.Repository.PemantauanPertumbuhan)
	m.PengukuranLilA = NewPengukuranLilAUseCase(opts.Repository.PengukuranLilA)
	m.CatatanPelayanan = NewCatatanPelayananUseCase(opts.Repository.CatatanPelayanan)
	return m
}
