package main

// import (
// 	"fmt"
// 	"monitoring-service/pkg/database"
// 	"monitoring-service/pkg/config"
// 	"monitoring-service/app/models"
// 	"github.com/spf13/viper"
// )

// func main() {
// 	viper.SetConfigFile(".env")
// 	viper.ReadInConfig()
// 	cfg := config.NewConfig()
	
// 	db, err := database.GetConnection(cfg.Database.Postgres)
// 	if err != nil {
// 		fmt.Println("DB Error:", err)
// 		return
// 	}
	
// 	var anak models.Anak
// 	err = db.Preload("Penduduk").Preload("Kehamilan.Ibu.Kependudukan").Where("id = ?", 31).First(&anak).Error
// 	if err != nil {
// 		fmt.Println("Anak Error:", err)
// 		return
// 	}
	
// 	fmt.Printf("Found anak: ID=%d, Nama=%s\n", anak.ID, anak.Penduduk.NamaLengkap)
// }
