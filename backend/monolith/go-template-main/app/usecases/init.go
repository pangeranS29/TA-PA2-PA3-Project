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
	Rujukan                       RujukanUseCase
	PemantauanIbu                 PemantauanIbuUseCase
	PemantauanAnak                PemantauanAnakUseCase
	SkriningDMGestasional         SkriningDMGestasionalUsecase
	SkriningPreeklampsia          SkriningPreeklampsiaUsecase
	SkriningPemantauan            SkriningPemantauanUsecase
	KategoriTandaBahaya           KategoriTandaBahayaUsecase
	PelayananIbuNifas             PelayananIbuNifasUsecase
	Ibu                           IbuUsecase
	RiwayatKehamilanLalu          RiwayatKehamilanLaluUsecase
	// RegisterOrangTua              *RegisterOrangTuaUsecase
	AdminAkunKeluarga                  *AdminAkunKeluargaUsecase
	AdminTenagaKesehatan               *AdminTenagaKesehatanUsecase
	KeteranganLahir                    KeteranganLahirUsecase
	PemantauanIndikator                PemantauanIndikatorUsecase
	EdukasiInformasiUmum               EdukasiInformasiUmumUsecase
	EdukasiTandaBahayaTrimester        EdukasiTandaBahayaTrimesterUsecase
	EdukasiTandaMelahirkan             EdukasiTandaMelahirkanUsecase
	EdukasiImd                         EdukasiIMDUsecase
	EdukasiSetelahMelahirkan           EdukasiSetelahMelahirkanUsecase
	EdukasiMenyusuiAsi                 EdukasiMenyusuiASIUsecase
	EdukasiPolaAsuh                    EdukasiPolaAsuhUsecase
	EdukasiKesehatanMental             EdukasiKesehatanMentalUsecase
	EdukasiPerawatanAnak               EdukasiPerawatanAnakUseCase
	KeluhanAnak                        KeluhanAnakUseCase
	KesehatanLingkunganDanCatatanKader KesehatanLingkunganDanCatatanKaderUsecase
	JenisPelayanan                     JenisPelayananUsecase
	Pertumbuhan                        PertumbuhanUseCase
	PerkembanganAnak                   PerkembanganAnakUseCase
	EdukasiMPASI                       EdukasiMPASIUsecase
	KesehatanLingkungan                KesehatanLingkunganUsecase
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
	m.Anak = NewAnakUseCase(opts.Repository.Anak, opts.Repository.Kependudukan)
	m.PelayananKesehatanAnak = NewPelayananKesehatanAnakUseCase(opts.Repository.PelayananKesehatanAnak)
	m.Neonatus = NewPelayananNeonatusUseCase(opts.Repository.Neonatus)
	m.KunjunganGizi = NewKunjunganGiziUseCase(opts.Repository.KunjunganGizi)
	m.KunjunganVitamin = NewKunjunganVitaminUseCase(opts.Repository.KunjunganVitamin)
	m.KunjunganImunisasi = NewKunjunganImunisasiUseCase(opts.Repository.KunjunganImunisasi)
	m.PemeriksaanGigi = NewPemeriksaanGigiUseCase(opts.Repository.PemeriksaanGigi)
	m.PemantauanPertumbuhan = NewPemantauanPertumbuhanUseCase(opts.Repository.PemantauanPertumbuhan, 
		opts.Repository.Anak, 
		opts.Repository,
	)
	m.PengukuranLilA = NewPengukuranLilAUseCase(opts.Repository.PengukuranLilA)
	m.CatatanPelayanan = NewCatatanPelayananUseCase(opts.Repository.CatatanPelayanan)

	// Inisialisasi usecase baru
	// m.KartuKeluarga = NewKartuKeluargaUsecase(opts.Repository.KartuKeluarga)
	m.Kehamilan = NewKehamilanUsecase(opts.Repository.Kehamilan)
	m.PemeriksaanKehamilan = NewPemeriksaanKehamilanUsecase(opts.Repository.PemeriksaanKehamilan)
	m.EvaluasiKesehatanIbu = NewEvaluasiKesehatanIbuUsecase(opts.Repository.EvaluasiKesehatanIbu)
	m.PemeriksaanDokterTrimester1 = NewPemeriksaanDokterTrimester1Usecase(opts.Repository.PemeriksaanDokterTrimester1, opts.Repository.PemeriksaanLaboratoriumJiwa)
	m.PemeriksaanDokterTrimester3 = NewPemeriksaanDokterTrimester3Usecase(opts.Repository.PemeriksaanDokterTrimester3, opts.Repository.PemeriksaanLaboratoriumJiwa)
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
	m.Rujukan = NewRujukanUseCase(opts.Repository.Rujukan)
	m.PemantauanIbu = NewPemantauanIbuUseCase(opts.Repository.PemantauanIbu)
	m.PemantauanAnak = NewPemantauanAnakUseCase(opts.Repository.PemantauanAnak)
	m.SkriningDMGestasional = NewSkriningDMGestasionalUsecase(opts.Repository.SkriningDMGestasional)
	m.SkriningPreeklampsia = NewSkriningPreeklampsiaUsecase(opts.Repository.SkriningPreeklampsia)
	m.SkriningPemantauan = NewSkriningPemantauanUsecase(opts.Repository.SkriningPemantauan)
	m.KategoriTandaBahaya = NewKategoriTandaBahayaUsecase(opts.Repository.KategoriTandaBahaya)
	m.PelayananIbuNifas = NewPelayananIbuNifasUsecase(opts.Repository.PelayananIbuNifas)
	m.Ibu = NewIbuUsecase(opts.Repository.Ibu, opts.Repository.Kependudukan)
	m.RiwayatKehamilanLalu = NewRiwayatKehamilanLaluUsecase(opts.Repository.RiwayatKehamilanLalu)
	m.EdukasiInformasiUmum = NewEdukasiInformasiUmumUsecase(opts.Repository.EdukasiInformasiUmum)
	m.EdukasiTandaBahayaTrimester = NewEdukasiTandaBahayaTrimesterUsecase(opts.Repository.EdukasiTandaBahayaTrimester)
	m.EdukasiTandaMelahirkan = NewEdukasiTandaMelahirkanUsecase(opts.Repository.EdukasiTandaMelahirkan)
	m.EdukasiImd = NewEdukasiIMDUsecase(opts.Repository.EdukasiImd)
	m.EdukasiSetelahMelahirkan = NewEdukasiSetelahMelahirkanUsecase(opts.Repository.EdukasiSetelahMelahirkan)
	m.EdukasiMenyusuiAsi = NewEdukasiMenyusuiASIUsecase(opts.Repository.EdukasiMenyusuiAsi)
	m.EdukasiPolaAsuh = NewEdukasiPolaAsuhUsecase(opts.Repository.EdukasiPolaAsuh)
	m.EdukasiKesehatanMental = NewEdukasiKesehatanMentalUsecase(opts.Repository.EdukasiKesehatanMental)
	m.EdukasiPerawatanAnak = NewEdukasiPerawatanAnakUseCase(opts.Repository.EdukasiPerawatanAnak)
	m.KeluhanAnak = NewKeluhanAnakUseCase(opts.Repository.KeluhanAnak)
	m.KesehatanLingkunganDanCatatanKader = NewKesehatanLingkunganDanCatatanKaderUsecase(opts.Repository.KesehatanLingkunganDanCatatanKader)
	m.PemantauanIndikator = NewPemantauanIndikatorUsecase(opts.Repository.PemantauanIndikator)
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
	m.Pertumbuhan = NewPertumbuhanUseCase(opts.Repository)
	m.PerkembanganAnak = NewPerkembanganAnakUseCase(opts.Repository.PerkembanganAnak)
	m.EdukasiMPASI = NewEdukasiMPASIUsecase(opts.Repository.EdukasiMPASI)
	m.KesehatanLingkungan = NewKesehatanLingkunganUsecase(opts.Repository.KesehatanLingkungan)

	return m
}
