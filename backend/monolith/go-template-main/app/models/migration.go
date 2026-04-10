package models

import (
	"gorm.io/gorm"
)

// var defaultRoles = []string{
// 	"Tenaga-kesehatan",
// 	"Dokter",
// 	"Kader",
// 	"Bidan",
// 	"Orangtua",
// }

func AutoMigrate(db *gorm.DB) error {
	if err := db.AutoMigrate(&Role{},
		&User{},
		&Anak{},
		&KategoriUmur{},
		&PeriodeKunjungan{},
		&JenisPelayanan{},
		&JenisPelayananKategori{},
		&KunjunganAnak{},
		&Neonatus{},
		&DetailPelayanan{},
		&DetailPelayananNeonatus{},
		&KunjunganGizi{},
		&ASI{},
		&MPASI{},
		&VitaminAObatCacing{},
		&CatatanPelayanan{},
		&KehadiranImunisasi{},
		&JenisPelayananImunisasi{},
		&PeriksaGigi{},
		&DeteksiDiniPenyimpangan{},
		&PengukuranLila{},
		&Pertumbuhan{},
	); err != nil {
		return err
	}

	// for _, roleName := range defaultRoles {
	// 	role := Role{Name: roleName}
	// 	if err := db.Where(Role{Name: roleName}).FirstOrCreate(&role).Error; err != nil {
	// 		return err
	// 	}
	// }

	return nil
}
