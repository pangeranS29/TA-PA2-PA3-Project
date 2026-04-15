package seeders

import (
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

func SeedJanin (db *gorm.DB) error {
	janinData := []struct {
		//
		NIK string
		KehamilanKe uint8
		LabelJanin string
	} {
		//
		{
            NIK:         "1212014405900001",
            KehamilanKe: 2,
            LabelJanin:  "A",
        },
        {
            NIK:         "1212015208950002",
            KehamilanKe: 1,
            LabelJanin:  "A",
        },
        {
            NIK:         "1212014101980003",
            KehamilanKe: 3,
            LabelJanin:  "A",
        },
        {
            NIK:         "1212016512920005",
            KehamilanKe: 2,
            LabelJanin:  "A",
        },
        {
            NIK:         "1212014203940004",
            KehamilanKe: 1,
            LabelJanin:  "A",
        },
        {
            NIK:         "1212015006970006",
            KehamilanKe: 2,
            LabelJanin:  "A",
        },
        {
            NIK:         "1212014811930007",
            KehamilanKe: 1,
            LabelJanin:  "A",
        },
        {
            NIK:         "1212015509910008",
            KehamilanKe: 4,
            LabelJanin:  "A",
        },
        {
            NIK:         "1212015509910008",
            KehamilanKe: 4,
            LabelJanin:  "B",
        },
        {
            NIK:         "1212016004960009",
            KehamilanKe: 2,
            LabelJanin:  "A",
        },
        {
            NIK:         "1212014402990010",
            KehamilanKe: 1,
            LabelJanin:  "A",
        },
	}

	now := time.Now()
	for _, d:= range janinData {
		var kependudukan models.Kependudukan
		if err := db.Where("nik = ?", d.NIK).First(&kependudukan).Error; err != nil {
			continue;
		}

		var ibu models.Ibu
		if err := db.Where("id_kependudukan = ?", kependudukan.IdKependudukan).First(&ibu).Error; err != nil {
			continue
		}

		var kehamilan models.Kehamilan
		if err := db.Where("id_ibu = ? AND kehamilan_ke = ?", ibu.IdIbu, d.KehamilanKe).First(&kehamilan).Error; err != nil {
			continue
		}

		janin := models.Janin{
			FKIdKehamilan: kehamilan.IdKehamilan,
			LabelJanin:    d.LabelJanin,
			CreatedAt:     now,
			UpdatedAt:     now,
		}

		if err := db.Where("id_kehamilan = ? AND label_janin = ?", janin.FKIdKehamilan, janin.LabelJanin).
			FirstOrCreate(&janin).Error; err != nil {
			return err
		}
	}
	return nil;
}