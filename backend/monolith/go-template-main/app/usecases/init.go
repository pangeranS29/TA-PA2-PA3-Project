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
	EdukasiInformasiUmum   EdukasiInformasiUmumUsecase
	EdukasiTandaBahayaTrimester EdukasiTandaBahayaTrimesterUsecase
	EdukasiTandaMelahirkan      EdukasiTandaMelahirkanUsecase
	EdukasiIMD                  EdukasiIMDUsecase
	EdukasiSetelahMelahirkan    EdukasiSetelahMelahirkanUsecase
	EdukasiMenyusuiASI          EdukasiMenyusuiASIUsecase
	EdukasiPolaAsuh             EdukasiPolaAsuhUsecase
	EdukasiKesehatanMental      EdukasiKesehatanMentalUsecase

	// Usecase baru (terkait kehamilan)
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
	RegisterOrangTua              *RegisterOrangTuaUsecase
	KeteranganLahir               KeteranganLahirUsecase // <-- TAMBAHKAN INI
	PemantauanIndikator           PemantauanIndikatorUsecase
	KesehatanLingkunganDanCatatanKader KesehatanLingkunganDanCatatanKaderUsecase
	JenisPelayanan                JenisPelayananUsecase
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
	m.EdukasiInformasiUmum = NewEdukasiInformasiUmumUsecase(opts.Repository.EdukasiInformasiUmum)
	m.EdukasiTandaBahayaTrimester = NewEdukasiTandaBahayaTrimesterUsecase(opts.Repository.EdukasiTandaBahayaTrimester)
	m.EdukasiTandaMelahirkan = NewEdukasiTandaMelahirkanUsecase(opts.Repository.EdukasiTandaMelahirkan)
	m.EdukasiIMD = NewEdukasiIMDUsecase(opts.Repository.EdukasiIMD)
	m.EdukasiSetelahMelahirkan = NewEdukasiSetelahMelahirkanUsecase(opts.Repository.EdukasiSetelahMelahirkan)
	m.EdukasiMenyusuiASI = NewEdukasiMenyusuiASIUsecase(opts.Repository.EdukasiMenyusuiASI)
	m.EdukasiPolaAsuh = NewEdukasiPolaAsuhUsecase(opts.Repository.EdukasiPolaAsuh)
	m.EdukasiKesehatanMental = NewEdukasiKesehatanMentalUsecase(opts.Repository.EdukasiKesehatanMental)

	// Inisialisasi usecase baru
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
	m.GrafikPeningkatanBB = NewGrafikPeningkatanBBUsecase(opts.Repository.GrafikPeningkatanBB)
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
	m.Kependudukan = NewKependudukanUsecase(opts.Repository.Kependudukan)
	m.RegisterOrangTua = NewRegisterOrangTuaUsecase(
		opts.Repository.User,
		opts.Repository.Role,
		opts.Repository.Kebabura,
		opts.Repository.Kependudukan,
		opts.Repository.Ibu,
	)
	m.KeteranganLahir = NewKeteranganLahirUsecase(opts.Repository.KeteranganLahir) // <-- TAMBAHKAN INI
	m.PemantauanIndikator = NewPemantauanIndikatorUsecase(opts.Repository.PemantauanIndikator)
	m.KesehatanLingkunganDanCatatanKader = NewKesehatanLingkunganDanCatatanKaderUsecase(opts.Repository.KesehatanLingkunganDanCatatanKader)
	m.JenisPelayanan = NewJenisPelayananUsecase(opts.Repository.JenisPelayanan)

	return m
}
