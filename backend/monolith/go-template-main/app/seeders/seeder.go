package seeders

import (
	"fmt"
	"log"
	"monitoring-service/app/models"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Seeder struct {
	db *gorm.DB
}

func NewSeeder(db *gorm.DB) *Seeder {
	return &Seeder{db: db}
}

func (s *Seeder) Run() error {
	log.Println("Memulai proses database seeding...")

	if err := s.seedRoles(); err != nil {
		return fmt.Errorf("gagal seed roles: %w", err)
	}
	if err := s.seedJenisPetugas(); err != nil {
		return fmt.Errorf("gagal seed jenis petugas: %w", err)
	}

	if err := s.seedUsersAndProfiles(); err != nil {
		return fmt.Errorf("gagal seed users & profiles: %w", err)
	}

	log.Println("Database seeding selesai dengan sukses!")
	return nil
}

// 1. MASTER DATA SEEDERS
func (s *Seeder) seedRoles() error {
	roles := []models.Role{
		{Name: "admin"},
		{Name: "ibu"},
		{Name: "petugas_kesehatan"},
	}

	for _, role := range roles {
		// Gunakan FirstOrCreate agar aman dijalankan berulang kali
		if err := s.db.Where("nama = ?", role.Name).FirstOrCreate(&role).Error; err != nil {
			return err
		}
	}
	return nil
}

func (s *Seeder) seedJenisPetugas() error {
	jenis := []models.JenisPetugasKesehatan{
		{Nama: "Bidan"},
		{Nama: "Dokter Spesialis Anak"},
		{Nama: "Dokter Umum"},
		{Nama: "Perawat"},
	}

	for _, j := range jenis {
		if err := s.db.Where("nama = ?", j.Nama).FirstOrCreate(&j).Error; err != nil {
			return err
		}
	}
	return nil
}

// 2. USERS, PROFILES, & ANAK SEEDERS
func (s *Seeder) seedUsersAndProfiles() error {
	// Ambil referensi Role dari database
	var roleAdmin, roleIbu, roleNakes models.Role
	s.db.Where("nama = ?", "admin").First(&roleAdmin)
	s.db.Where("nama = ?", "ibu").First(&roleIbu)
	s.db.Where("nama = ?", "petugas_kesehatan").First(&roleNakes)

	// Ambil referensi Jenis Petugas
	var bidan, dokterAnak models.JenisPetugasKesehatan
	s.db.Where("nama = ?", "Bidan").First(&bidan)
	s.db.Where("nama = ?", "Dokter Spesialis Anak").First(&dokterAnak)

	// Generate password standar
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	pass := string(hashedPassword)

	// Kita gunakan DB Transaction agar jika satu profil gagal, semua di-rollback (dibatalkan)
	return s.db.Transaction(func(tx *gorm.DB) error {

		// A. SEED ADMIN
		var admin models.User
		if err := tx.Where("email = ?", "admin@kia.id").First(&admin).Error; err == gorm.ErrRecordNotFound {
			admin = models.User{
				Name:        "Super Admin",
				Email:       "admin@kia.id",
				PhoneNumber: "0811111111",
				Password:    pass,
				Role:        []models.Role{roleAdmin}, // Langsung assign role
			}
			tx.Create(&admin)
			log.Println("Berhasil membuat user Admin")
		}

		// B. SEED IBU & ANAK
		var ibuSiti models.User
		if err := tx.Where("email = ?", "siti@ibu.id").First(&ibuSiti).Error; err == gorm.ErrRecordNotFound {
			tanggalLahirIbu, _ := time.Parse("2006-01-02", "1995-05-15")

			ibuSiti = models.User{
				Name:        "Siti Aminah",
				Email:       "siti@ibu.id",
				PhoneNumber: "0822222222",
				Password:    pass,
				Role:        []models.Role{roleIbu},
				// Nested creation: Langsung buat profil Ibu di dalam User
				Ibu: &models.Ibu{
					Nik:          1234567890123456,
					Nama:         "Siti Aminah",
					TanggalLahir: tanggalLahirIbu,
					Alamat:       "Jl. Mawar No. 10",
					Pekerjaan:    "Ibu Rumah Tangga",
				},
			}
			if err := tx.Create(&ibuSiti).Error; err != nil {
				return err
			}

			// Buat Data Anak untuk Ibu Siti
			tanggalLahirAnak, _ := time.Parse("2006-01-02", "2023-10-10")
			anak := models.Anak{
				ParentID:     int(ibuSiti.Ibu.ID), // Referensi ke ID Profil Ibu, bukan ID User
				Nama:         "Budi Santoso",
				JenisKelamin: "M",
				TanggalLahir: tanggalLahirAnak,
				BeratLahir:   3.2,
				TinggiLahir:  50.0,
			}
			tx.Create(&anak)
			log.Println("Berhasil membuat user Ibu dan Anaknya")
		}

		// C. SEED KADER POSYANDU (Role: petugas_kesehatan)
		var kader models.User
		if err := tx.Where("email = ?", "kader.wati@kia.id").First(&kader).Error; err == gorm.ErrRecordNotFound {
			kader = models.User{
				Name:        "Ibu Wati (Kader)",
				Email:       "kader.wati@kia.id",
				PhoneNumber: "0833333333",
				Password:    pass,
				Role:        []models.Role{roleNakes},
				KaderPosyandu: &models.KaderPosyandu{
					WilayahBinaan:  "RW 05 Desa Suka Maju",
					PosyanduNama:   "Posyandu Melati 1",
					TahunBergabung: 2020,
					StatusAktif:    true,
				},
			}
			tx.Create(&kader)
			log.Println("Berhasil membuat user Kader Posyandu")
		}

		// D. SEED PETUGAS MEDIS (Role: petugas_kesehatan)
		var bidanAyu models.User
		if err := tx.Where("email = ?", "bidan.ayu@kia.id").First(&bidanAyu).Error; err == gorm.ErrRecordNotFound {
			bidanAyu = models.User{
				Name:        "Bidan Ayu, Amd.Keb",
				Email:       "bidan.ayu@kia.id",
				PhoneNumber: "0844444444",
				Password:    pass,
				Role:        []models.Role{roleNakes},
				PetugasKesehatan: &models.PetugasKesehatan{
					JenisPetugasID: bidan.ID,
					Nip:            "198501012010122001",
					Institusi:      "Puskesmas Suka Maju",
					NoStr:          "12345STR67890",
					Jabatan:        "Bidan Desa",
				},
			}
			tx.Create(&bidanAyu)
			log.Println("Berhasil membuat user Bidan")
		}

		return nil
	})
}
