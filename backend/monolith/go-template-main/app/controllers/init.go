package controllers

import (
	"monitoring-service/app/usecases"
	"monitoring-service/pkg/config"
)

type Main struct {
	usecases *usecases.Main
	config   *config.Config

	Anak                   *AnakController
	PelayananKesehatanAnak *PelayananKesehatanAnakController
	Neonatus               *NeonatusController
	PelayananGiziAnak      *kunjunganGiziController
	KunjunganVitamin       *KunjunganVitaminController
	KunjunganImunisasi     *KunjunganImunisasiController
	PemeriksaanGigi        *PemeriksaanGigiController
	PemantauanPertumbuhan  *PemantauanPertumbuhanController
	PengukuranLilA         *PengukuranLilAController
	CatatanPelayanan	   *CatatanPelayananController
}

type controller struct {
	Options Options
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
	return m
}

func (m *Main) JWTSecret() string {
	return m.config.JWTSecret
}
