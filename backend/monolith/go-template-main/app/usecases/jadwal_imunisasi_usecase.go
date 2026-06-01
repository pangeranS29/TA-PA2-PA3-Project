package usecases

import (
	"fmt"
	"monitoring-service/app/models"
	"time"
	// "time"
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
			anakMap[int32(row.AnakID)]; !exists {

			anakMap[int32(row.AnakID)] =
				&models.JadwalImunisasiResponse{
					AnakID:         int32(row.AnakID),
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
				anakMap[int32(row.AnakID)].JumlahTerlewat++

			// Terlambat & Krisis ikut dihitung
			case 4, 5:
				anakMap[int32(row.AnakID)].JumlahTerlewat++
			}

			anakMap[int32(row.AnakID)].Jadwal =
				append(
					anakMap[int32(row.AnakID)].Jadwal,
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

		if _, exists := anakMap[int32(row.AnakID)]; !exists {
			anakMap[int32(row.AnakID)] = &models.JadwalImunisasiResponse{
				AnakID:         int32(row.AnakID),
				NamaAnak:       row.NamaAnak,
				TanggalLahir:   row.TanggalLahir,
				JumlahTerlewat: 0,
				JumlahSelesai:  0,
				Jadwal:         []models.JadwalImunisasiItem{},
			}
		}

		if row.JadwalID != 0 {

			switch row.StatusID {
			case 3, 4, 5:
				anakMap[int32(row.AnakID)].JumlahTerlewat++

			case 6:
				anakMap[int32(row.AnakID)].JumlahSelesai++ // 👈 TAMBAHAN INI
			}

			anakMap[int32(row.AnakID)].Jadwal = append(
				anakMap[int32(row.AnakID)].Jadwal,
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

func (m *Main) RequestPerubahanJadwal(
	userID int32,
	jadwalID uint,
	newDate string,
	alasan string,
) error {

	// cek jadwal milik user
	data, err := m.repository.GetJadwalImunisasiByJadwalID(userID, jadwalID)
	if err != nil {
		return err
	}

	if data == nil || data.JadwalID == 0 {
		return fmt.Errorf("jadwal tidak ditemukan")
	}

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
		AnakID:         int32(row.AnakID),
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
