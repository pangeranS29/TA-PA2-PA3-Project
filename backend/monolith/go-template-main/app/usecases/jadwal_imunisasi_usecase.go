package usecases

import (
	"fmt"
	"monitoring-service/app/models"
	"time"
<<<<<<< HEAD
=======
	// "time"
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
)

func (m *Main) GetJadwalImunisasi(
	userID int32,
) ([]models.JadwalImunisasiResponse, error) {

	rows, err :=
		m.repository.
			GetJadwalImunisasiByUserID(
				userID,
			)

	if err != nil {
		return nil, err
	}

	anakMap :=
		make(
			map[int32]*models.JadwalImunisasiResponse,
		)

	for _, row := range rows {

		if _, exists :=
<<<<<<< HEAD
			anakMap[row.AnakID]; !exists {

			anakMap[row.AnakID] =
				&models.JadwalImunisasiResponse{
					AnakID:         row.AnakID,
=======
			anakMap[int32(row.AnakID)]; !exists {

			anakMap[int32(row.AnakID)] =
				&models.JadwalImunisasiResponse{
					AnakID:         int32(row.AnakID),
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
					NamaAnak:       row.NamaAnak,
					TanggalLahir:   row.TanggalLahir,
					JumlahTerlewat: 0,
					Jadwal:         []models.JadwalImunisasiItem{},
				}
		}

		if row.JadwalID != 0 {

			// Count imunisasi terlewat
			switch row.StatusID {

			// Terlewat
			case 3:
<<<<<<< HEAD
				anakMap[row.AnakID].
					JumlahTerlewat++

			// Terlambat & Krisis ikut dihitung
			case 4, 5:
				anakMap[row.AnakID].
					JumlahTerlewat++
			}

			anakMap[row.AnakID].
				Jadwal =
				append(
					anakMap[row.AnakID].Jadwal,
=======
				anakMap[int32(row.AnakID)].JumlahTerlewat++

			// Terlambat & Krisis ikut dihitung
			case 4, 5:
				anakMap[int32(row.AnakID)].JumlahTerlewat++
			}

			anakMap[int32(row.AnakID)].Jadwal =
				append(
					anakMap[int32(row.AnakID)].Jadwal,
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
					models.JadwalImunisasiItem{
						JadwalID:        row.JadwalID,
						NamaDosis:       row.NamaDosis,
						TanggalEstimasi: row.TanggalEstimasi,
						Deskripsi:       row.Deskripsi,
						EfekSamping:     row.EfekSamping,
						StatusID:        row.StatusID,
						Status:          row.Status,
					},
				)
		}
	}

	response :=
		[]models.JadwalImunisasiResponse{}

	for _, anak := range anakMap {
		response =
			append(
				response,
				*anak,
			)
	}

	return response, nil
}

func (m *Main) GetJadwalImunisasiByAnakID(
	userID int32,
	anakID int32,
) ([]models.JadwalImunisasiResponse, error) {

	rows, err :=
		m.repository.GetJadwalImunisasiByAnakID(userID, anakID)

	if err != nil {
		return nil, err
	}

	anakMap :=
		make(map[int32]*models.JadwalImunisasiResponse)

	for _, row := range rows {

<<<<<<< HEAD
		if _, exists := anakMap[row.AnakID]; !exists {
			anakMap[row.AnakID] = &models.JadwalImunisasiResponse{
				AnakID:         row.AnakID,
				NamaAnak:       row.NamaAnak,
				TanggalLahir:   row.TanggalLahir,
				JumlahTerlewat: 0,
=======
		if _, exists := anakMap[int32(row.AnakID)]; !exists {
			anakMap[int32(row.AnakID)] = &models.JadwalImunisasiResponse{
				AnakID:         int32(row.AnakID),
				NamaAnak:       row.NamaAnak,
				TanggalLahir:   row.TanggalLahir,
				JumlahTerlewat: 0,
				JumlahSelesai:  0,
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
				Jadwal:         []models.JadwalImunisasiItem{},
			}
		}

		if row.JadwalID != 0 {

			switch row.StatusID {
			case 3, 4, 5:
<<<<<<< HEAD
				anakMap[row.AnakID].JumlahTerlewat++
			}

			anakMap[row.AnakID].Jadwal = append(
				anakMap[row.AnakID].Jadwal,
=======
				anakMap[int32(row.AnakID)].JumlahTerlewat++

			case 6:
				anakMap[int32(row.AnakID)].JumlahSelesai++ // 👈 TAMBAHAN INI
			}

			anakMap[int32(row.AnakID)].Jadwal = append(
				anakMap[int32(row.AnakID)].Jadwal,
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
				models.JadwalImunisasiItem{
					JadwalID:        row.JadwalID,
					NamaDosis:       row.NamaDosis,
					TanggalEstimasi: row.TanggalEstimasi,
					Deskripsi:       row.Deskripsi,
					EfekSamping:     row.EfekSamping,
					StatusID:        row.StatusID,
					Status:          row.Status,
				},
			)
		}
	}

	response := []models.JadwalImunisasiResponse{}
	for _, anak := range anakMap {
		response = append(response, *anak)
	}

	return response, nil
}

<<<<<<< HEAD
func (m *Main) UpdateTanggalEstimasi(
	userID int32,
	jadwalID uint,
	newDate time.Time,
) error {

	// cek data exist (harus pakai userID juga)
=======
func (m *Main) RequestPerubahanJadwal(
	userID int32,
	jadwalID uint,
	newDate string,
	alasan string,
) error {

	// cek jadwal milik user
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
	data, err := m.repository.GetJadwalImunisasiByJadwalID(userID, jadwalID)
	if err != nil {
		return err
	}

<<<<<<< HEAD
	// kalau tidak ditemukan
=======
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
	if data == nil || data.JadwalID == 0 {
		return fmt.Errorf("jadwal tidak ditemukan")
	}

<<<<<<< HEAD
	// update langsung
	return m.repository.UpdateTanggalEstimasi(jadwalID, newDate)
=======
	// ambil tanggal lama
	oldDate := data.TanggalEstimasi.Format("2006-01-02")

	parsedDate, err := time.Parse("2006-01-02", newDate)
	if err != nil {
		return fmt.Errorf("format tanggal tidak valid")
	}
	// create request
	request := models.RequestPerubahanImunisasi{
		IDJadwalImunisasi: int32(jadwalID),
		IDStatusRequest:   2,
		TanggalSebelum:    oldDate,
		TanggalBaru:       parsedDate.Format("2006-01-02"),
		Alasan:            alasan,
	}

	return m.repository.CreateRequestPerubahanJadwal(&request)
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
}

func (m *Main) GetJadwalImunisasiByJadwalID(
	userID int32,
	jadwalID uint,
) (*models.JadwalImunisasiResponse, error) {

	row, err := m.repository.GetJadwalImunisasiByJadwalID(userID, jadwalID)
	if err != nil {
		return nil, err
	}

	if row == nil || row.JadwalID == 0 {
		return nil, nil
	}

	result := &models.JadwalImunisasiResponse{
<<<<<<< HEAD
		AnakID:         row.AnakID,
=======
		AnakID:         int32(row.AnakID),
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
		NamaAnak:       row.NamaAnak,
		TanggalLahir:   row.TanggalLahir,
		JumlahTerlewat: 0,
		Jadwal: []models.JadwalImunisasiItem{
			{
				JadwalID:        row.JadwalID,
				NamaDosis:       row.NamaDosis,
				TanggalEstimasi: row.TanggalEstimasi,
				Deskripsi:       row.Deskripsi,
				EfekSamping:     row.EfekSamping,
				StatusID:        row.StatusID,
				Status:          row.Status,
			},
		},
	}

	// hitung terlewat
	switch row.StatusID {
	case 3, 4, 5:
		result.JumlahTerlewat = 1
	}

	return result, nil
}
<<<<<<< HEAD
=======

func (m *Main) SetJadwalSelesai(userID int32, jadwalID uint) error {
	// optional: cek apakah data ada
	data, err := m.repository.GetJadwalImunisasiByJadwalID(userID, jadwalID)
	if err != nil {
		return err
	}

	if data == nil || data.JadwalID == 0 {
		return fmt.Errorf("jadwal tidak ditemukan")
	}

	// update status jadi 6 (SELESAI)
	return m.repository.UpdateStatusJadwalImunisasi(jadwalID, 6)
}
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
