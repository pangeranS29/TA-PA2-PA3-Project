package usecases

import (
	"monitoring-service/app/models"
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
			anakMap[row.AnakID]; !exists {

			anakMap[row.AnakID] =
				&models.JadwalImunisasiResponse{
					AnakID:       row.AnakID,
					NamaAnak:     row.NamaAnak,
					TanggalLahir: row.TanggalLahir,
					Jadwal:       []models.JadwalImunisasiItem{},
				}
		}

		if row.JadwalID != 0 {

			anakMap[row.AnakID].
				Jadwal =
				append(
					anakMap[row.AnakID].Jadwal,
					models.JadwalImunisasiItem{
						JadwalID:        row.JadwalID,
						NamaDosis:       row.NamaDosis,
						TanggalEstimasi: row.TanggalEstimasi,
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