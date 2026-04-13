package repositories

import (
	"monitoring-service/pkg/config"

	"gorm.io/gorm"
)

type Main struct {
	postgres *gorm.DB
	config   *config.Config

	Anak *	AnakRepository
	PelayananKesehatanAnak PelayananKesehatanAnakRepository
	Neonatus PelayananNeonatusRepository
	KunjunganGizi KunjunganGiziRepository
	KunjunganVitamin KunjunganVitaminRepository
	KunjunganImunisasi KunjunganImunisasiRepository
	PemeriksaanGigi PemeriksaanGigiRepository
	PemantauanPertumbuhan PemantauanPertumbuhanRepository
	PengukuranLilA PengukuranLilaRepository
	CatatanPelayanan CatatanPelayananRepository
}

type repository struct {
	Options Options
}

type Options struct {
	Postgres *gorm.DB
	Config   *config.Config
}

func Init(opts Options) *Main {
	m := &Main{
		postgres: opts.Postgres,
		config:   opts.Config,
	}
	m.Anak = NewAnakRepository(opts.Postgres)
	m.PelayananKesehatanAnak = NewPelayananKesehatanAnakRepository(opts.Postgres)
	m.Neonatus = NewPelayananNeonatusRepository(opts.Postgres)
	m.KunjunganGizi = NewKunjunganGiziRepository(opts.Postgres)
	m.KunjunganVitamin = NewKunjunganVitaminRepository(opts.Postgres)
	m.KunjunganImunisasi = NewKunjunganImunisasiRepository(opts.Postgres)
	m.PemeriksaanGigi = NewPemeriksaanGigiRepository(opts.Postgres)
	m.PemantauanPertumbuhan = NewPemantauanPertumbuhanRepository(opts.Postgres)
	m.PengukuranLilA = NewPengukuranLilaRepository(opts.Postgres)
	m.CatatanPelayanan = NewCatatanPelayananRepository(opts.Postgres)
	return m
}
