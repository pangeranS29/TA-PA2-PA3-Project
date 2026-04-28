package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"time"
)

type PemeriksaanDokterTrimester1Usecase interface {
	Create(req *PemeriksaanDokterTrimester1Request) error
	Update(id int32, req *PemeriksaanDokterTrimester1Request) error
	GetByID(id int32) (*PemeriksaanDokterTrimester1Response, error)
	GetByKehamilanID(kehamilanID int32) ([]PemeriksaanDokterTrimester1Response, error)
	Delete(id int32) error
}

type PemeriksaanDokterTrimester1Request struct {
	KehamilanID                 int32    `json:"kehamilan_id"`
	NamaDokter                  string   `json:"nama_dokter"`
	TanggalPeriksa              string   `json:"tanggal_periksa"`
	KonsepAnamnesaPemeriksaan   string   `json:"konsep_anamnesa_pemeriksaan"`
	FisikKonjungtiva            string   `json:"fisik_konjungtiva"`
	FisikSklera                 string   `json:"fisik_sklera"`
	FisikKulit                  string   `json:"fisik_kulit"`
	FisikLeher                  string   `json:"fisik_leher"`
	FisikGigiMulut              string   `json:"fisik_gigi_mulut"`
	FisikTHT                    string   `json:"fisik_tht"`
	FisikDadaJantung            string   `json:"fisik_dada_jantung"`
	FisikDadaParu               string   `json:"fisik_dada_paru"`
	FisikPerut                  string   `json:"fisik_perut"`
	FisikTungkai                string   `json:"fisik_tungkai"`
	HPHT                        string   `json:"hpht"`
	KeteraturanHaid             string   `json:"keteraturan_haid"`
	UmurHamilHPHTMinggu         *int     `json:"umur_hamil_hpht_minggu"`
	HPLBerdasarkanHPHT          string   `json:"hpl_berdasarkan_hpht"`
	UmurHamilUSGMinggu          *int     `json:"umur_hamil_usg_minggu"`
	HPLBerdasarkanUSG           string   `json:"hpl_berdasarkan_usg"`
	USGJumlahGS                 string   `json:"usg_jumlah_gs"`
	USGDiameterGS_cm            *float64 `json:"usg_diameter_gs_cm"`
	USGDiameterGSMinggu         *int     `json:"usg_diameter_gs_minggu"`
	USGDiameterGSHari           *int     `json:"usg_diameter_gs_hari"`
	USGJumlahBayi               string   `json:"usg_jumlah_bayi"`
	USGCRL_cm                   *float64 `json:"usg_crl_cm"`
	USGCRLMinggu                *int     `json:"usg_crl_minggu"`
	USGCRLHari                  *int     `json:"usg_crl_hari"`
	USGLetakProdukKehamilan     string   `json:"usg_letak_produk_kehamilan"`
	USGPulsasiJantung           string   `json:"usg_pulsasi_jantung"`
	USGKecurigaanTemuanAbnormal string   `json:"usg_kecurigaan_temuan_abnormal"`
	USGKeteranganTemuanAbnormal string   `json:"usg_keterangan_temuan_abnormal"`

	// Laboratorium & Skrining Jiwa (Trimester 1)
	TanggalLabJiwa                string   `json:"tanggal_lab_jiwa"`
	LabHemoglobinHasilJiwa        *float64 `json:"lab_hemoglobin_hasil_jiwa"`
	LabHemoglobinRencanaJiwa      string   `json:"lab_hemoglobin_rencana_tindak_lanjut_jiwa"`
	LabGolonganDarahRhesusHasil   string   `json:"lab_golongan_darah_rhesus_hasil"`
	LabGolonganDarahRhesusRencana string   `json:"lab_golongan_darah_rhesus_rencana_tindak_lanjut"`
	LabGulaDarahSewaktuHasil      *int     `json:"lab_gula_darah_sewaktu_hasil"`
	LabGulaDarahSewaktuRencana    string   `json:"lab_gula_darah_sewaktu_rencana_tindak_lanjut"`
	LabHIVHasil                   string   `json:"lab_hiv_hasil"`
	LabHIVRencana                 string   `json:"lab_hiv_rencana_tindak_lanjut"`
	LabSifilisHasil               string   `json:"lab_sifilis_hasil"`
	LabSifilisRencana             string   `json:"lab_sifilis_rencana_tindak_lanjut"`
	LabHepatitisBHasil            string   `json:"lab_hepatitis_b_hasil"`
	LabHepatitisBRencana          string   `json:"lab_hepatitis_b_rencana_tindak_lanjut"`
	TanggalSkriningJiwa           string   `json:"tanggal_skrining_jiwa"`
	SkriningJiwaHasil             string   `json:"skrining_jiwa_hasil"`
	SkriningJiwaTindakLanjut      string   `json:"skrining_jiwa_tindak_lanjut"`
	SkriningJiwaPerluRujukan      string   `json:"skrining_jiwa_perlu_rujukan"`
	KesimpulanJiwa                string   `json:"kesimpulan"`
	RekomendasiJiwa               string   `json:"rekomendasi"`
}

type PemeriksaanDokterTrimester1Response struct {
	Dokter *models.PemeriksaanDokterTrimester1 `json:"dokter"`
	Lab    *models.PemeriksaanLaboratoriumJiwa `json:"lab_jiwa,omitempty"`
}

type pemeriksaanDokterTrimester1Usecase struct {
	repo    *repositories.PemeriksaanDokterTrimester1Repository
	labRepo *repositories.PemeriksaanLaboratoriumJiwaRepository
}

func NewPemeriksaanDokterTrimester1Usecase(
	repo *repositories.PemeriksaanDokterTrimester1Repository,
	labRepo *repositories.PemeriksaanLaboratoriumJiwaRepository,
) PemeriksaanDokterTrimester1Usecase {
	return &pemeriksaanDokterTrimester1Usecase{repo: repo, labRepo: labRepo}
}

func (u *pemeriksaanDokterTrimester1Usecase) Create(req *PemeriksaanDokterTrimester1Request) error {
	if req.KehamilanID == 0 {
		return errors.New("kehamilan_id wajib diisi")
	}
	dokter := u.mapRequestToDokter(req)
	lab := u.mapRequestToLab(req, 1)
	return u.repo.CreateWithLab(dokter, lab)
}

func (u *pemeriksaanDokterTrimester1Usecase) Update(id int32, req *PemeriksaanDokterTrimester1Request) error {
	existing, err := u.repo.FindByID(id)
	if err != nil {
		return errors.New("data tidak ditemukan")
	}
	dokter := u.mapRequestToDokter(req)
	dokter.KehamilanID = existing.KehamilanID // biar konsisten
	lab := u.mapRequestToLab(req, 1)
	return u.repo.UpdateWithLab(id, dokter, lab)
}

func (u *pemeriksaanDokterTrimester1Usecase) mapRequestToDokter(req *PemeriksaanDokterTrimester1Request) *models.PemeriksaanDokterTrimester1 {
	dokter := &models.PemeriksaanDokterTrimester1{
		KehamilanID:                 req.KehamilanID,
		NamaDokter:                  req.NamaDokter,
		KonsepAnamnesaPemeriksaan:   req.KonsepAnamnesaPemeriksaan,
		FisikKonjungtiva:            req.FisikKonjungtiva,
		FisikSklera:                 req.FisikSklera,
		FisikKulit:                  req.FisikKulit,
		FisikLeher:                  req.FisikLeher,
		FisikGigiMulut:              req.FisikGigiMulut,
		FisikTHT:                    req.FisikTHT,
		FisikDadaJantung:            req.FisikDadaJantung,
		FisikDadaParu:               req.FisikDadaParu,
		FisikPerut:                  req.FisikPerut,
		FisikTungkai:                req.FisikTungkai,
		KeteraturanHaid:             req.KeteraturanHaid,
		UmurHamilHPHTMinggu:         req.UmurHamilHPHTMinggu,
		UmurHamilUSGMinggu:          req.UmurHamilUSGMinggu,
		USGJumlahGS:                 req.USGJumlahGS,
		USGDiameterGS_cm:            req.USGDiameterGS_cm,
		USGDiameterGSMinggu:         req.USGDiameterGSMinggu,
		USGDiameterGSHari:           req.USGDiameterGSHari,
		USGJumlahBayi:               req.USGJumlahBayi,
		USGCRL_cm:                   req.USGCRL_cm,
		USGCRLMinggu:                req.USGCRLMinggu,
		USGCRLHari:                  req.USGCRLHari,
		USGLetakProdukKehamilan:     req.USGLetakProdukKehamilan,
		USGPulsasiJantung:           req.USGPulsasiJantung,
		USGKecurigaanTemuanAbnormal: req.USGKecurigaanTemuanAbnormal,
		USGKeteranganTemuanAbnormal: req.USGKeteranganTemuanAbnormal,
	}
	if req.TanggalPeriksa != "" {
		t, _ := time.Parse("2006-01-02", req.TanggalPeriksa)
		dokter.TanggalPeriksa = &t
	}
	if req.HPHT != "" {
		t, _ := time.Parse("2006-01-02", req.HPHT)
		dokter.HPHT = &t
	}
	if req.HPLBerdasarkanHPHT != "" {
		t, _ := time.Parse("2006-01-02", req.HPLBerdasarkanHPHT)
		dokter.HPLBerdasarkanHPHT = &t
	}
	if req.HPLBerdasarkanUSG != "" {
		t, _ := time.Parse("2006-01-02", req.HPLBerdasarkanUSG)
		dokter.HPLBerdasarkanUSG = &t
	}
	return dokter
}

func (u *pemeriksaanDokterTrimester1Usecase) mapRequestToLab(req *PemeriksaanDokterTrimester1Request, trimester int32) *models.PemeriksaanLaboratoriumJiwa {
	if req.TanggalLabJiwa == "" && req.LabHemoglobinHasilJiwa == nil && req.LabGulaDarahSewaktuHasil == nil {
		return nil
	}
	lab := &models.PemeriksaanLaboratoriumJiwa{
		Trimester:                        trimester,
		LabHemoglobinHasil:               req.LabHemoglobinHasilJiwa,
		LabHemoglobinRencanaTindakLanjut: req.LabHemoglobinRencanaJiwa,
		LabGolonganDarahRhesusHasil:      req.LabGolonganDarahRhesusHasil,
		LabGolonganDarahRhesusRencana:    req.LabGolonganDarahRhesusRencana,
		LabGulaDarahSewaktuHasil:         req.LabGulaDarahSewaktuHasil,
		LabGulaDarahSewaktuRencana:       req.LabGulaDarahSewaktuRencana,
		LabHIVHasil:                      req.LabHIVHasil,
		LabHIVRencana:                    req.LabHIVRencana,
		LabSifilisHasil:                  req.LabSifilisHasil,
		LabSifilisRencana:                req.LabSifilisRencana,
		LabHepatitisBHasil:               req.LabHepatitisBHasil,
		LabHepatitisBRencana:             req.LabHepatitisBRencana,
		SkriningJiwaHasil:                req.SkriningJiwaHasil,
		SkriningJiwaTindakLanjut:         req.SkriningJiwaTindakLanjut,
		SkriningJiwaPerluRujukan:         req.SkriningJiwaPerluRujukan,
		Kesimpulan:                       req.KesimpulanJiwa,
		Rekomendasi:                      req.RekomendasiJiwa,
	}
	if req.TanggalLabJiwa != "" {
		t, _ := time.Parse("2006-01-02", req.TanggalLabJiwa)
		lab.TanggalLab = &t
	}
	if req.TanggalSkriningJiwa != "" {
		t, _ := time.Parse("2006-01-02", req.TanggalSkriningJiwa)
		lab.TanggalSkriningJiwa = &t
	}
	return lab
}

func (u *pemeriksaanDokterTrimester1Usecase) GetByID(id int32) (*PemeriksaanDokterTrimester1Response, error) {
	dokter, err := u.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	lab, _ := u.labRepo.FindByKehamilanIDAndTrimester(dokter.KehamilanID, 1)
	return &PemeriksaanDokterTrimester1Response{Dokter: dokter, Lab: lab}, nil
}

func (u *pemeriksaanDokterTrimester1Usecase) GetByKehamilanID(kehamilanID int32) ([]PemeriksaanDokterTrimester1Response, error) {
	list, err := u.repo.FindByKehamilanID(kehamilanID)
	if err != nil {
		return nil, err
	}
	var result []PemeriksaanDokterTrimester1Response
	for _, d := range list {
		lab, _ := u.labRepo.FindByKehamilanIDAndTrimester(d.KehamilanID, 1)
		result = append(result, PemeriksaanDokterTrimester1Response{Dokter: &d, Lab: lab})
	}
	return result, nil
}

func (u *pemeriksaanDokterTrimester1Usecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
