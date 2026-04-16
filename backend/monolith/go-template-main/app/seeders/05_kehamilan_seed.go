package seeders

import (
	"monitoring-service/app/models"
	"time"

	"gorm.io/gorm"
)

func SeedKehamilan(db *gorm.DB) error {
	kehamilanData := []struct {
		NIK               string
		KehamilanKe       uint8
		HPHT              time.Time
		HPLHPHT           time.Time
		HPLUSG            time.Time
		StatusKehamilan   models.StatusKehamilan
		TinggiBadan       float32
		UmurKehamilanHPHT uint8
		UmurKehamilanUSG  uint8
	}{
		{
			NIK:               "1212014405900001",
			KehamilanKe:       2,
			HPHT:              time.Date(2025, 7, 10, 0, 0, 0, 0, time.UTC),
			HPLHPHT:           time.Date(2026, 4, 17, 0, 0, 0, 0, time.UTC),
			HPLUSG:            time.Date(2026, 4, 15, 0, 0, 0, 0, time.UTC),
			StatusKehamilan:   models.StatusAktif,
			TinggiBadan:       158.5,
			UmurKehamilanHPHT: 39,
			UmurKehamilanUSG:  39,
		},
		{
			NIK:               "1212015208950002",
			KehamilanKe:       1,
			HPHT:              time.Date(2025, 11, 5, 0, 0, 0, 0, time.UTC),
			HPLHPHT:           time.Date(2026, 8, 12, 0, 0, 0, 0, time.UTC),
			HPLUSG:            time.Date(2026, 8, 14, 0, 0, 0, 0, time.UTC),
			StatusKehamilan:   models.StatusAktif,
			TinggiBadan:       155.0,
			UmurKehamilanHPHT: 22,
			UmurKehamilanUSG:  22,
		},
		{
			NIK:               "1212014101980003",
			KehamilanKe:       3,
			HPHT:              time.Date(2026, 2, 10, 0, 0, 0, 0, time.UTC),
			HPLHPHT:           time.Date(2026, 11, 17, 0, 0, 0, 0, time.UTC),
			HPLUSG:            time.Date(2026, 11, 17, 0, 0, 0, 0, time.UTC),
			StatusKehamilan:   models.StatusAktif,
			TinggiBadan:       160.2,
			UmurKehamilanHPHT: 8,
			UmurKehamilanUSG:  9,
		},
		{
			NIK:               "1212016512920005",
			KehamilanKe:       2,
			HPHT:              time.Date(2025, 9, 20, 0, 0, 0, 0, time.UTC),
			HPLHPHT:           time.Date(2026, 6, 27, 0, 0, 0, 0, time.UTC),
			HPLUSG:            time.Date(2026, 6, 25, 0, 0, 0, 0, time.UTC),
			StatusKehamilan:   models.StatusAktif,
			TinggiBadan:       152.0,
			UmurKehamilanHPHT: 29,
			UmurKehamilanUSG:  29,
		},
		{
			NIK:               "1212014203940004",
			KehamilanKe:       1,
			HPHT:              time.Date(2025, 8, 15, 0, 0, 0, 0, time.UTC),
			HPLHPHT:           time.Date(2026, 5, 22, 0, 0, 0, 0, time.UTC),
			HPLUSG:            time.Date(2026, 5, 20, 0, 0, 0, 0, time.UTC),
			StatusKehamilan:   models.StatusAktif,
			TinggiBadan:       157.8,
			UmurKehamilanHPHT: 34,
			UmurKehamilanUSG:  34,
		},
		{
			NIK:               "1212015006970006",
			KehamilanKe:       2,
			HPHT:              time.Date(2026, 1, 5, 0, 0, 0, 0, time.UTC),
			HPLHPHT:           time.Date(2026, 10, 12, 0, 0, 0, 0, time.UTC),
			HPLUSG:            time.Date(2026, 10, 15, 0, 0, 0, 0, time.UTC),
			StatusKehamilan:   models.StatusAktif,
			TinggiBadan:       154.5,
			UmurKehamilanHPHT: 13,
			UmurKehamilanUSG:  13,
		},
		{
			NIK:               "1212014811930007",
			KehamilanKe:       1,
			HPHT:              time.Date(2025, 10, 12, 0, 0, 0, 0, time.UTC),
			HPLHPHT:           time.Date(2026, 7, 19, 0, 0, 0, 0, time.UTC),
			HPLUSG:            time.Date(2026, 7, 20, 0, 0, 0, 0, time.UTC),
			StatusKehamilan:   models.StatusAktif,
			TinggiBadan:       150.0,
			UmurKehamilanHPHT: 25,
			UmurKehamilanUSG:  25,
		},
		{
			NIK:               "1212015509910008",
			KehamilanKe:       4,
			HPHT:              time.Date(2025, 12, 25, 0, 0, 0, 0, time.UTC),
			HPLHPHT:           time.Date(2026, 10, 1, 0, 0, 0, 0, time.UTC),
			HPLUSG:            time.Date(2026, 9, 30, 0, 0, 0, 0, time.UTC),
			StatusKehamilan:   models.StatusAktif,
			TinggiBadan:       162.0,
			UmurKehamilanHPHT: 15,
			UmurKehamilanUSG:  15,
		},
		{
			NIK:               "1212016004960009",
			KehamilanKe:       2,
			HPHT:              time.Date(2026, 3, 1, 0, 0, 0, 0, time.UTC),
			HPLHPHT:           time.Date(2026, 12, 8, 0, 0, 0, 0, time.UTC),
			HPLUSG:            time.Date(2026, 12, 8, 0, 0, 0, 0, time.UTC),
			StatusKehamilan:   models.StatusAktif,
			TinggiBadan:       156.3,
			UmurKehamilanHPHT: 5,
			UmurKehamilanUSG:  6,
		},
		{
			NIK:               "1212014402990010",
			KehamilanKe:       1,
			HPHT:              time.Date(2025, 6, 20, 0, 0, 0, 0, time.UTC),
			HPLHPHT:           time.Date(2026, 3, 27, 0, 0, 0, 0, time.UTC),
			HPLUSG:            time.Date(2026, 3, 29, 0, 0, 0, 0, time.UTC),
			StatusKehamilan:   models.StatusAktif,
			TinggiBadan:       159.0,
			UmurKehamilanHPHT: 42,
			UmurKehamilanUSG:  42,
		},
	}

	now := time.Now()
	for _, d := range kehamilanData {
		var kependudukanModel models.Kependudukan
		if err := db.Where("nik = ?", d.NIK).First(&kependudukanModel).Error; err != nil {
			continue
		}

		var ibuModel models.Ibu
		if err := db.Where("id_kependudukan = ?", kependudukanModel.IdKependudukan).First(&ibuModel).Error; err != nil {
			continue
		}

		kehamilan := models.Kehamilan{
			//
			FKIdIbu:           ibuModel.IdIbu,
			KehamilanKe:       d.KehamilanKe,
			HPHT:              &d.HPHT,
			HPLHPHT:           &d.HPLHPHT,
			HPLUSG:            &d.HPLUSG,
			StatusKehamilan:   d.StatusKehamilan,
			TinggiBadan:       d.TinggiBadan,
			UmurKehamilanHPHT: d.UmurKehamilanHPHT,
			UmurKehamilanUSG:  d.UmurKehamilanUSG,
			CreatedAt:         now,
			UpdatedAt:         now,
		}
		if err := db.Where("id_ibu = ? AND kehamilan_ke = ?", kehamilan.FKIdIbu, kehamilan.KehamilanKe).
            FirstOrCreate(&kehamilan).Error; err != nil {
            return err
        }
	}
	return nil
}
