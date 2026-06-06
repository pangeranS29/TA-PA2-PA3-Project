package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"time"
)

type LogTTDMMSUsecase interface {
	GetMine(userID int32) ([]models.LogTTDMMS, error)
	SaveMine(userID int32, bulanKe int32, hariKe int32, sudahDiminum bool) (*models.LogTTDMMS, error)
}

type logTTDMMSUsecase struct {
	repo *repositories.LogTTDMMSRepository
}

func NewLogTTDMMSUsecase(repo *repositories.LogTTDMMSRepository) LogTTDMMSUsecase {
	return &logTTDMMSUsecase{repo: repo}
}

func (u *logTTDMMSUsecase) GetMine(userID int32) ([]models.LogTTDMMS, error) {
	if userID == 0 {
		return nil, errors.New("user_id tidak valid")
	}

	kehamilan, err := u.repo.FindActiveKehamilanByUserID(userID)
	if err != nil {
		return nil, errors.New("kehamilan aktif tidak ditemukan")
	}

	return u.repo.FindByKehamilanID(kehamilan.ID)
}

// func (u *logTTDMMSUsecase) SaveMine(
// 	userID int32,
// 	bulanKe int32,
// 	hariKe int32,
// 	sudahDiminum bool,
// ) (*models.LogTTDMMS, error) {
// 	if userID == 0 {
// 		return nil, errors.New("user_id tidak valid")
// 	}
// 	if bulanKe < 1 || bulanKe > 10 {
// 		return nil, errors.New("bulan_ke harus antara 1 sampai 10")
// 	}
// 	if hariKe < 1 || hariKe > 31 {
// 		return nil, errors.New("hari_ke harus antara 1 sampai 31")
// 	}

// 	kehamilan, err := u.repo.FindActiveKehamilanByUserID(userID)
// 	if err != nil {
// 		return nil, errors.New("kehamilan aktif tidak ditemukan")
// 	}

// 	log := &models.LogTTDMMS{
// 		KehamilanID:   kehamilan.ID,
// 		BulanKe:       bulanKe,
// 		HariKe:        hariKe,
// 		SudahDiminum:  sudahDiminum,
// 	}

// 	if err := u.repo.Upsert(log); err != nil {
// 		return nil, err
// 	}

// 	return log, nil
// }

func (u *logTTDMMSUsecase) SaveMine(
	userID int32,
	bulanKe int32,
	hariKe int32,
	sudahDiminum bool,
) (*models.LogTTDMMS, error) {
	if userID == 0 {
		return nil, errors.New("user_id tidak valid")
	}
	if bulanKe < 1 || bulanKe > 10 {
		return nil, errors.New("bulan_ke harus antara 1 sampai 10")
	}
	if hariKe < 1 || hariKe > 31 {
		return nil, errors.New("hari_ke harus antara 1 sampai 31")
	}
 
	kehamilan, err := u.repo.FindActiveKehamilanByUserID(userID)
	if err != nil {
		return nil, errors.New("kehamilan aktif tidak ditemukan")
	}
 
	// Hitung tanggal kalender dari bulan_ke dan hari_ke berdasarkan HPHT
	// Rumus: tanggal = HPHT + ((bulan_ke - 1) * 30) + (hari_ke - 1) hari
	hpht := kehamilan.HPHT
	offsetHari := int((bulanKe-1)*30 + (hariKe - 1))
	tanggalLog := hpht.AddDate(0, 0, offsetHari)
	tanggalLog = time.Date(tanggalLog.Year(), tanggalLog.Month(), tanggalLog.Day(), 0, 0, 0, 0, time.Local)
 
	// Ambil tanggal hari ini dan kemarin (tanpa jam)
	now := time.Now()
	hariIni := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.Local)
	kemarin := hariIni.AddDate(0, 0, -1)
 
	// Validasi: hanya hari ini dan kemarin yang boleh diisi
	if tanggalLog.After(hariIni) {
		return nil, errors.New("tidak dapat mengisi log untuk hari yang akan datang")
	}
	if tanggalLog.Before(kemarin) {
		return nil, errors.New("tidak dapat mengisi log untuk lebih dari 1 hari yang lalu, hanya hari ini dan kemarin yang diperbolehkan")
	}
 
	log := &models.LogTTDMMS{
		KehamilanID:  kehamilan.ID,
		BulanKe:      bulanKe,
		HariKe:       hariKe,
		SudahDiminum: sudahDiminum,
	}
 
	if err := u.repo.Upsert(log); err != nil {
		return nil, err
	}
 
	return log, nil
}
 


