package usecases

import (
	"monitoring-service/app/models"
)

func (m *Main) GetSkriningPreeklampsia(kehamilanId uint) (*models.SkriningPreeklampsiaDanDiabetes, error) {
	return m.repository.GetSkriningByKehamilanId(kehamilanId)
}

func (m *Main) CreateSkriningPreeklampsia(req *models.SkriningPreeklampsiaDanDiabetes) error {
	// 1. Hitung Jumlah Risiko
	countHigh := 0
	countMedium := 0

	// Cek Risiko Tinggi
	if req.Jawaban.RiwayatPreeklampsia { countHigh++ }
	if req.Jawaban.KehamilanMultipel { countHigh++ }
	if req.Jawaban.Diabetes { countHigh++ }
	if req.Jawaban.HipertensiKronik { countHigh++ }
	if req.Jawaban.PenyakitGinjal { countHigh++ }
	if req.Jawaban.PenyakitAutoimun { countHigh++ }
	if req.Jawaban.AntiPhospholipid { countHigh++ }

	// Cek Risiko Sedang
	if req.Jawaban.PasanganBaru { countMedium++ }
	if req.Jawaban.TeknologiReproduksi { countMedium++ }
	if req.Jawaban.UsiaDiatas35 { countMedium++ }
	if req.Jawaban.Nullipara { countMedium++ }
	if req.Jawaban.JarakKehamilan10Thn { countMedium++ }
	if req.Jawaban.RiwayatKeluarga { countMedium++ }
	if req.Jawaban.Obesitas { countMedium++ }
	if req.Jawaban.MAPDiatas90 { countMedium++ }
	if req.Jawaban.Proteinuria { countMedium++ }

	if countHigh >= 1 || countMedium >= 2 {
		req.Kesimpulan = "Risiko Tinggi Preeklampsia"
		req.Rekomendasi = "Ibu hamil perrlu melakukan rujukan ke RS/Dokter Sp.OG untuk penanganan lebih lanjut."
	} else {
		req.Kesimpulan = "Risiko Rendah / Normal"
		req.Rekomendasi = "Tetap lanjutkan pemantauan rutin"
	}

	return m.repository.CreateSkrining(req)
}

func CalculateMAP(sistolik, diastolik int) int {
	return ((2 * diastolik) + sistolik) / 3
}