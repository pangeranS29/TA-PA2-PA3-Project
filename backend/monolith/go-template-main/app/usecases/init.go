package usecases

import (
	"monitoring-service/app/repositories"
	"monitoring-service/pkg/config"
)

type Main struct {
	repository *repositories.Main
	config     *config.Config

	Anak                   *AnakUseCase
	PelayananKesehatanAnak PelayananKesehatanAnakUseCase
	Neonatus               NeonatusUsecase
	KunjunganGizi          KunjunganGiziUseCase
	KunjunganVitamin       KunjunganVitaminUseCase
	KunjunganImunisasi     KunjunganImunisasiUseCase
	PemeriksaanGigi        PemeriksaanGigiUseCase
	PemantauanPertumbuhan  PemantauanPertumbuhanAnakUseCase
	PengukuranLilA         PengukuranLilAUseCase
	CatatanPelayanan	   CatatanPelayananUseCase
}

type usecase struct {
	Options Options
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
	return m
}
