package controllers

import (
	"monitoring-service/app/usecases"
	"monitoring-service/pkg/config"
)

type Main struct {
	usecases *usecases.Main
	config   *config.Config

	// Controller yang sudah ada (untuk modul lain)
	Anak                   *AnakController
	PelayananKesehatanAnak *PelayananKesehatanAnakController
	Neonatus               *NeonatusController
	PelayananGiziAnak      *kunjunganGiziController
	KunjunganVitamin       *KunjunganVitaminController
	KunjunganImunisasi     *KunjunganImunisasiController
	PemeriksaanGigi        *PemeriksaanGigiController
	PemantauanPertumbuhan  *PemantauanPertumbuhanController
	PengukuranLilA         *PengukuranLilAController
	CatatanPelayanan       *CatatanPelayananController

	// Controller baru untuk edukasi informasi umum
	EdukasiInformasiUmum        *EdukasiInformasiUmumController
	EdukasiTandaBahayaTrimester *EdukasiTandaBahayaTrimesterController
	EdukasiTandaMelahirkan      *EdukasiTandaMelahirkanController
	EdukasiImd                  *EdukasiIMDController
	EdukasiSetelahMelahirkan    *EdukasiSetelahMelahirkanController
	EdukasiMenyusuiAsi          *EdukasiMenyusuiASIController
	EdukasiPolaAsuh             *EdukasiPolaAsuhController
	EdukasiKesehatanMental      *EdukasiKesehatanMentalController
	EdukasiPerawatanAnak        *EdukasiPerawatanAnakController
	KeluhanAnak                 *KeluhanAnakController
	KesehatanLingkunganDanCatatanKader *KesehatanLingkunganDanCatatanKaderController

	// Controller baru untuk struktur kehamilan
	Ibu                           *IbuController
	// KartuKeluarga                 *KartuKeluargaController
	Kehamilan                     *KehamilanController
	PemeriksaanKehamilan          *PemeriksaanKehamilanController
	EvaluasiKesehatanIbu          *EvaluasiKesehatanIbuController
	PemeriksaanDokterTrimester1   *PemeriksaanDokterTrimester1Controller
	PemeriksaanDokterTrimester3   *PemeriksaanDokterTrimester3Controller
	PemeriksaanDokterCombined     *PemeriksaanDokterCombinedController
	PemeriksaanLaboratoriumJiwa   *PemeriksaanLaboratoriumJiwaController
	PemeriksaanLanjutanTrimester3 *PemeriksaanLanjutanTrimester3Controller
	CatatanPelayananTrimester1    *CatatanPelayananTrimester1Controller
	CatatanPelayananTrimester2    *CatatanPelayananTrimester2Controller
	CatatanPelayananTrimester3    *CatatanPelayananTrimester3Controller
	CatatanPelayananNifas         *CatatanPelayananNifasController
	GrafikEvaluasiKehamilan       *GrafikEvaluasiKehamilanController
	GrafikPeningkatanBB           *GrafikPeningkatanBBController
	PenjelasanHasilGrafik         *PenjelasanHasilGrafikController
	RencanaPersalinan             *RencanaPersalinanController
	RingkasanPelayananPersalinan  *RingkasanPelayananPersalinanController
	RiwayatProsesMelahirkan       *RiwayatProsesMelahirkanController
	Rujukan                       *RujukanController
	PemantauanIbu                 *PemantauanIbuController
	PemantauanAnak                *PemantauanAnakController
	SkriningDMGestasional         *SkriningDMGestasionalController
	SkriningPreeklampsia          *SkriningPreeklampsiaController
	SkriningPemantauan            *SkriningPemantauanController
	KategoriTandaBahaya           *KategoriTandaBahayaController
	PelayananIbuNifas             *PelayananIbuNifasController
	RiwayatKehamilanLalu          *RiwayatKehamilanLaluController
	PemantauanIndikator           *PemantauanIndikatorController
	KeteranganLahir               *KeteranganLahirController // <-- TAMBAHKAN INI
	Kependudukan                  *KependudukanController
	JenisPelayanan                *JenisPelayananController
	Pertumbuhan                   *PertumbuhanController
	PerkembanganAnak              *PerkembanganAnakController
	EdukasiMPASI                  *EdukasiMPASIController
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

	// Controller yang sudah ada (tidak diubah)
	m.Anak = NewAnakController(opts.UseCases.Anak)
	m.PelayananKesehatanAnak = NewPelayananKesehatanAnakController(opts.UseCases.PelayananKesehatanAnak)
	m.Neonatus = NewPelayananNeonatusController(opts.UseCases.Neonatus)
	m.PelayananGiziAnak = NewKunjunganGiziController(opts.UseCases.KunjunganGizi)
	m.KunjunganVitamin = NewKunjunganVitaminController(opts.UseCases.KunjunganVitamin)
	m.KunjunganImunisasi = NewKunjunganImunisasiController(opts.UseCases.KunjunganImunisasi)
	m.PemeriksaanGigi = NewPemeriksaanGigiController(opts.UseCases.PemeriksaanGigi)
	m.PemantauanPertumbuhan = NewPemantauanPertumbuhanController(opts.UseCases.PemantauanPertumbuhan)
	m.PengukuranLilA = NewPengukuranLilAController(opts.UseCases.PengukuranLilA)
	m.CatatanPelayanan = NewCatatanPelayananController(opts.UseCases.CatatanPelayanan)

	// Controller baru
	m.EdukasiInformasiUmum = NewEdukasiInformasiUmumController(opts.UseCases.EdukasiInformasiUmum)
	m.EdukasiTandaBahayaTrimester = NewEdukasiTandaBahayaTrimesterController(opts.UseCases.EdukasiTandaBahayaTrimester)
	m.EdukasiTandaMelahirkan = NewEdukasiTandaMelahirkanController(opts.UseCases.EdukasiTandaMelahirkan)
	m.EdukasiImd = NewEdukasiIMDController(opts.UseCases.EdukasiImd)
	m.EdukasiSetelahMelahirkan = NewEdukasiSetelahMelahirkanController(opts.UseCases.EdukasiSetelahMelahirkan)
	m.EdukasiMenyusuiAsi = NewEdukasiMenyusuiASIController(opts.UseCases.EdukasiMenyusuiAsi)
	m.EdukasiPolaAsuh = NewEdukasiPolaAsuhController(opts.UseCases.EdukasiPolaAsuh)
	m.EdukasiKesehatanMental = NewEdukasiKesehatanMentalController(opts.UseCases.EdukasiKesehatanMental)
	m.EdukasiPerawatanAnak = NewEdukasiPerawatanAnakController(opts.UseCases.EdukasiPerawatanAnak)
	m.KeluhanAnak = NewKeluhanAnakController(opts.UseCases.KeluhanAnak)
	m.KesehatanLingkunganDanCatatanKader = NewKesehatanLingkunganDanCatatanKaderController(opts.UseCases.KesehatanLingkunganDanCatatanKader, opts.UseCases.Ibu)

	// Controller baru
	m.Ibu = NewIbuController(opts.UseCases.Ibu)
	m.Kehamilan = NewKehamilanController(opts.UseCases.Kehamilan)
	m.PemeriksaanKehamilan = NewPemeriksaanKehamilanController(opts.UseCases.PemeriksaanKehamilan)
	m.EvaluasiKesehatanIbu = NewEvaluasiKesehatanIbuController(opts.UseCases.EvaluasiKesehatanIbu)
	m.PemeriksaanDokterTrimester1 = NewPemeriksaanDokterTrimester1Controller(opts.UseCases.PemeriksaanDokterTrimester1)
	m.PemeriksaanDokterTrimester3 = NewPemeriksaanDokterTrimester3Controller(opts.UseCases.PemeriksaanDokterTrimester3)
	m.PemeriksaanDokterCombined = NewPemeriksaanDokterCombinedController(
		opts.UseCases.PemeriksaanDokterTrimester1,
		opts.UseCases.PemeriksaanDokterTrimester3,
	)
	m.PemeriksaanLaboratoriumJiwa = NewPemeriksaanLaboratoriumJiwaController(opts.UseCases.PemeriksaanLaboratoriumJiwa)
	m.PemeriksaanLanjutanTrimester3 = NewPemeriksaanLanjutanTrimester3Controller(opts.UseCases.PemeriksaanLanjutanTrimester3)
	m.CatatanPelayananTrimester1 = NewCatatanPelayananTrimester1Controller(opts.UseCases.CatatanPelayananTrimester1)
	m.CatatanPelayananTrimester2 = NewCatatanPelayananTrimester2Controller(opts.UseCases.CatatanPelayananTrimester2)
	m.CatatanPelayananTrimester3 = NewCatatanPelayananTrimester3Controller(opts.UseCases.CatatanPelayananTrimester3)
	m.CatatanPelayananNifas = NewCatatanPelayananNifasController(opts.UseCases.CatatanPelayananNifas)
	m.GrafikEvaluasiKehamilan = NewGrafikEvaluasiKehamilanController(opts.UseCases.GrafikEvaluasiKehamilan)
	m.GrafikPeningkatanBB = NewGrafikPeningkatanBBController(opts.UseCases.GrafikPeningkatanBB)
	m.PenjelasanHasilGrafik = NewPenjelasanHasilGrafikController(opts.UseCases.PenjelasanHasilGrafik)
	m.RencanaPersalinan = NewRencanaPersalinanController(opts.UseCases.RencanaPersalinan)
	m.RingkasanPelayananPersalinan = NewRingkasanPelayananPersalinanController(opts.UseCases.RingkasanPelayananPersalinan)
	m.RiwayatProsesMelahirkan = NewRiwayatProsesMelahirkanController(opts.UseCases.RiwayatProsesMelahirkan)
	m.Rujukan = NewRujukanController(opts.UseCases.Rujukan)
	m.PemantauanIbu = NewPemantauanIbuController(opts.UseCases.PemantauanIbu)
	m.PemantauanAnak = NewPemantauanAnakController(opts.UseCases.PemantauanAnak)
	m.SkriningDMGestasional = NewSkriningDMGestasionalController(opts.UseCases.SkriningDMGestasional)
	m.SkriningPreeklampsia = NewSkriningPreeklampsiaController(opts.UseCases.SkriningPreeklampsia)
	m.SkriningPemantauan = NewSkriningPemantauanController(opts.UseCases.SkriningPemantauan)
	m.KategoriTandaBahaya = NewKategoriTandaBahayaController(opts.UseCases.KategoriTandaBahaya)
	m.PelayananIbuNifas = NewPelayananIbuNifasController(opts.UseCases.PelayananIbuNifas)
	m.RiwayatKehamilanLalu = NewRiwayatKehamilanLaluController(opts.UseCases.RiwayatKehamilanLalu)
	m.KeteranganLahir = NewKeteranganLahirController(opts.UseCases.KeteranganLahir)
	m.PemantauanIndikator = NewPemantauanIndikatorController(opts.UseCases.PemantauanIndikator)
	m.Kependudukan = NewKependudukanController(opts.UseCases.Kependudukan)
	m.JenisPelayanan = NewJenisPelayananController(opts.UseCases.JenisPelayanan)
	m.Pertumbuhan = NewPertumbuhanController(opts.UseCases.Pertumbuhan)
	m.PerkembanganAnak = NewPerkembanganAnakController(opts.UseCases.PerkembanganAnak)
	m.EdukasiMPASI = NewEdukasiMPASIController(opts.UseCases.EdukasiMPASI)

	return m
}

func (m *Main) JWTSecret() string {
	return m.config.JWTSecret
}
