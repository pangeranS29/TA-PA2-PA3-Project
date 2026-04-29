package usecases

import (
	"monitoring-service/app/repositories"
	"monitoring-service/pkg/config"
)

type Main struct {
	repository *repositories.Main
	config     *config.Config

	// Usecase yang sudah ada
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
	Kependudukan           KependudukanUsecase

	// Usecase baru (terkait kehamilan)
	// KartuKeluarga                 KartuKeluargaUsecase
	Kehamilan                     KehamilanUsecase
	PemeriksaanKehamilan          PemeriksaanKehamilanUsecase
	EvaluasiKesehatanIbu          EvaluasiKesehatanIbuUsecase
	PemeriksaanDokterTrimester1   PemeriksaanDokterTrimester1Usecase
	PemeriksaanDokterTrimester3   PemeriksaanDokterTrimester3Usecase
	PemeriksaanLaboratoriumJiwa   PemeriksaanLaboratoriumJiwaUsecase
	PemeriksaanLanjutanTrimester3 PemeriksaanLanjutanTrimester3Usecase
	CatatanPelayananTrimester1    CatatanPelayananTrimester1Usecase
	CatatanPelayananTrimester2    CatatanPelayananTrimester2Usecase
	CatatanPelayananTrimester3    CatatanPelayananTrimester3Usecase
	CatatanPelayananNifas         CatatanPelayananNifasUsecase
	GrafikEvaluasiKehamilan       GrafikEvaluasiKehamilanUsecase
	GrafikPeningkatanBB           GrafikPeningkatanBBUsecase
	PenjelasanHasilGrafik         PenjelasanHasilGrafikUsecase
	RencanaPersalinan             RencanaPersalinanUsecase
	RingkasanPelayananPersalinan  RingkasanPelayananPersalinanUsecase
	RiwayatProsesMelahirkan       RiwayatProsesMelahirkanUsecase
	Rujukan                       RujukanUsecase
	SkriningDMGestasional         SkriningDMGestasionalUsecase
	SkriningPreeklampsia          SkriningPreeklampsiaUsecase
	PelayananIbuNifas             PelayananIbuNifasUsecase
	Ibu                           IbuUsecase
	RiwayatKehamilanLalu          RiwayatKehamilanLaluUsecase
	LembarPemantauan              LembarPemantauanUsecase
	// RegisterOrangTua              *RegisterOrangTuaUsecase
	AdminAkunKeluarga    *AdminAkunKeluargaUsecase
	AdminTenagaKesehatan *AdminTenagaKesehatanUsecase
	KeteranganLahir      KeteranganLahirUsecase // <-- TAMBAHKAN INI
	JenisPelayanan       JenisPelayananUsecase
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

	// Inisialisasi usecase yang sudah ada
	m.Anak = NewAnakUseCase(opts.Repository.Anak)
	m.PelayananKesehatanAnak = NewPelayananKesehatanAnakUseCase(opts.Repository.PelayananKesehatanAnak)
	m.Neonatus = NewPelayananNeonatusUseCase(opts.Repository.Neonatus)
	m.KunjunganGizi = NewKunjunganGiziUseCase(opts.Repository.KunjunganGizi)
	m.KunjunganVitamin = NewKunjunganVitaminUseCase(opts.Repository.KunjunganVitamin)
	m.KunjunganImunisasi = NewKunjunganImunisasiUseCase(opts.Repository.KunjunganImunisasi)
	m.PemeriksaanGigi = NewPemeriksaanGigiUseCase(opts.Repository.PemeriksaanGigi)
	m.PemantauanPertumbuhan = NewPemantauanPertumbuhanUseCase(opts.Repository.PemantauanPertumbuhan)
	m.PengukuranLilA = NewPengukuranLilAUseCase(opts.Repository.PengukuranLilA)
	m.CatatanPelayanan = NewCatatanPelayananUseCase(opts.Repository.CatatanPelayanan)

	// Inisialisasi usecase baru
	// m.KartuKeluarga = NewKartuKeluargaUsecase(opts.Repository.KartuKeluarga)
	m.Kehamilan = NewKehamilanUsecase(opts.Repository.Kehamilan)
	m.PemeriksaanKehamilan = NewPemeriksaanKehamilanUsecase(opts.Repository.PemeriksaanKehamilan)
	m.EvaluasiKesehatanIbu = NewEvaluasiKesehatanIbuUsecase(opts.Repository.EvaluasiKesehatanIbu)
	m.PemeriksaanDokterTrimester1 = NewPemeriksaanDokterTrimester1Usecase(opts.Repository.PemeriksaanDokterTrimester1)
	m.PemeriksaanDokterTrimester3 = NewPemeriksaanDokterTrimester3Usecase(opts.Repository.PemeriksaanDokterTrimester3)
	m.PemeriksaanLaboratoriumJiwa = NewPemeriksaanLaboratoriumJiwaUsecase(opts.Repository.PemeriksaanLaboratoriumJiwa)
	m.PemeriksaanLanjutanTrimester3 = NewPemeriksaanLanjutanTrimester3Usecase(opts.Repository.PemeriksaanLanjutanTrimester3)
	m.CatatanPelayananTrimester1 = NewCatatanPelayananTrimester1Usecase(opts.Repository.CatatanPelayananTrimester1)
	m.CatatanPelayananTrimester2 = NewCatatanPelayananTrimester2Usecase(opts.Repository.CatatanPelayananTrimester2)
	m.CatatanPelayananTrimester3 = NewCatatanPelayananTrimester3Usecase(opts.Repository.CatatanPelayananTrimester3)
	m.CatatanPelayananNifas = NewCatatanPelayananNifasUsecase(opts.Repository.CatatanPelayananNifas)
	m.GrafikEvaluasiKehamilan = NewGrafikEvaluasiKehamilanUsecase(opts.Repository.GrafikEvaluasiKehamilan)
	m.GrafikPeningkatanBB = NewGrafikPeningkatanBBUsecase(opts.Repository.GrafikPeningkatanBB, opts.Repository.Kehamilan)
	m.PenjelasanHasilGrafik = NewPenjelasanHasilGrafikUsecase(opts.Repository.PenjelasanHasilGrafik)
	m.RencanaPersalinan = NewRencanaPersalinanUsecase(opts.Repository.RencanaPersalinan)
	m.RingkasanPelayananPersalinan = NewRingkasanPelayananPersalinanUsecase(opts.Repository.RingkasanPelayananPersalinan)
	m.RiwayatProsesMelahirkan = NewRiwayatProsesMelahirkanUsecase(opts.Repository.RiwayatProsesMelahirkan)
	m.Rujukan = NewRujukanUsecase(opts.Repository.Rujukan)
	m.SkriningDMGestasional = NewSkriningDMGestasionalUsecase(opts.Repository.SkriningDMGestasional)
	m.SkriningPreeklampsia = NewSkriningPreeklampsiaUsecase(opts.Repository.SkriningPreeklampsia)
	m.PelayananIbuNifas = NewPelayananIbuNifasUsecase(opts.Repository.PelayananIbuNifas)
	m.Ibu = NewIbuUsecase(opts.Repository.Ibu)
	m.RiwayatKehamilanLalu = NewRiwayatKehamilanLaluUsecase(opts.Repository.RiwayatKehamilanLalu)
	m.LembarPemantauan = NewLembarPemantauanUsecase(opts.Repository.LembarPemantauan)
	m.Kependudukan = NewKependudukanUsecase(opts.Repository.Kependudukan)
	// m.RegisterOrangTua = NewRegisterOrangTuaUsecase(
	// 	opts.Repository.User,
	// 	opts.Repository.Role,
	// 	opts.Repository.KartuKeluarga,
	// 	opts.Repository.Kependudukan,
	// 	opts.Repository.Ibu,
	// )
	m.AdminAkunKeluarga = NewAdminAkunKeluargaUsecase(
		opts.Repository.User,
		opts.Repository.Role,
		opts.Repository.KartuKeluarga,
		opts.Repository.Kependudukan,
	)
	m.AdminTenagaKesehatan = NewAdminTenagaKesehatanUsecase(
		opts.Repository.Bidan,
		opts.Repository.Kader,
		opts.Repository.Kependudukan,
		opts.Repository.User,
		opts.Repository.Role,
	)
	m.KeteranganLahir = NewKeteranganLahirUsecase(opts.Repository.KeteranganLahir) // <-- TAMBAHKAN INI
	m.JenisPelayanan = NewJenisPelayananUsecase(opts.Repository.JenisPelayanan)

	return m
}
