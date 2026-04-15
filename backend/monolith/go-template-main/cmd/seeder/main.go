package main

import (
	"fmt"
	"log"
	"monitoring-service/app/models"
	"monitoring-service/app/seeders"
	"monitoring-service/pkg/config"

	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Inisialisasi Viper
	viper.SetConfigFile(".env")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		log.Printf("Masalah .env : %v", err)
	}

	cfg := config.NewConfig()

	pg := cfg.Postgres().Write
	
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=disable TimeZone=Asia/Jakarta",
		pg.URL, pg.Username, pg.Password, pg.Name, pg.Port)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Gagal koneksi database : ", err)
	}

	err = db.AutoMigrate(
		&models.Role{},
		&models.User{},
		&models.Kependudukan{},
		&models.Ibu{},
		&models.Kehamilan{},
		&models.RiwayatKehamilan{},
		&models.PemeriksaanANC{},
		&models.SkriningPreeklampsiaDanDiabetes{},
		&models.Janin{},
		&models.USGTrimester1{},
		&models.USGTrimester2{},
		&models.USGTrimester3{},
	)
	if err != nil {
		log.Fatal("Migrasi Gagal : ", err)
	}
	if err := seeders.RunAllSeeders(db); err != nil {
		log.Fatal("Seeding Gagal : ", err)
	}

	log.Println("Berhasil seed ...")
}