package main

import (
	"fmt"
	"log"
	"monitoring-service/app/models"
	"monitoring-service/pkg/config"
	"monitoring-service/pkg/database"

	"github.com/spf13/viper"
)

func main() {
	viper.SetConfigFile(".env")
	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("failed read config: %v", err)
	}

	cfg := config.NewConfig()

	db, err := database.GetConnection(cfg.Postgres().Read.ToArgs(database.Postgres, database.ReadConn, nil))
	if err != nil {
		log.Fatalf("failed connect db: %v", err)
	}

	var rentangs []models.RentangUsia
	if err := db.Find(&rentangs).Error; err != nil {
		log.Fatalf("query failed: %v", err)
	}

	fmt.Printf("Total Rentang Usia: %d\n", len(rentangs))
	for _, r := range rentangs {
		fmt.Printf("- ID: %d, Nama: %s, Max: %d %s\n", r.ID, r.NamaRentang, r.MaxPeriode, r.SatuanWaktu)
	}

	var count int64
	db.Model(&models.KategoriCapaian{}).Count(&count)
	fmt.Printf("Total Kategori Capaian: %d\n", count)
}
