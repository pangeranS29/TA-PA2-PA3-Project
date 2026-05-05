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

type pemeriksaanDokterTrimester1Usecase struct {
	repo    *repositories.PemeriksaanDokterTrimester1Repository
	labRepo *repositories.PemeriksaanLaboratoriumJiwaRepository
}

func NewPemeriksaanDokterTrimester1Usecase(
	repo *repositories.PemeriksaanDokterTrimester1Repository,
	labRepo *repositories.PemeriksaanLaboratoriumJiwaRepository,
) PemeriksaanDokterTrimester1Usecase {
	return &pemeriksaanDokterTrimester1Usecase{
		repo:    repo,
		labRepo: labRepo,
	}
}

type PemeriksaanDokterTrimester1Request struct {
	KehamilanID    int32  `json:"kehamilan_id"`
	NamaDokter     string `json:"nama_dokter"`
	TanggalPeriksa string `json:"tanggal_periksa"`
	HPHT           string `json:"hpht"`

	// Lab Fields (tambahkan jika diperlukan)
}

type PemeriksaanDokterTrimester1Response struct {
	Dokter *models.PemeriksaanDokterTrimester1 `json:"dokter"`
	Lab    *models.PemeriksaanLaboratoriumJiwa `json:"lab_jiwa,omitempty"`
}

func (u *pemeriksaanDokterTrimester1Usecase) mapRequestToLab(req *PemeriksaanDokterTrimester1Request, trimester int32) *models.PemeriksaanLaboratoriumJiwa {
	return nil // sementara
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
	dokter.KehamilanID = existing.KehamilanID

	lab := u.mapRequestToLab(req, 1)

	return u.repo.UpdateWithLab(id, dokter, lab)
}

func (u *pemeriksaanDokterTrimester1Usecase) mapRequestToDokter(req *PemeriksaanDokterTrimester1Request) *models.PemeriksaanDokterTrimester1 {
	dokter := &models.PemeriksaanDokterTrimester1{
		KehamilanID: req.KehamilanID,
		NamaDokter:  req.NamaDokter,
	}

	if req.TanggalPeriksa != "" {
		t, _ := time.Parse("2006-01-02", req.TanggalPeriksa)
		dokter.TanggalPeriksa = &t
	}

	if req.HPHT != "" {
		t, _ := time.Parse("2006-01-02", req.HPHT)
		dokter.HPHT = &t
	}

	return dokter
}

func (u *pemeriksaanDokterTrimester1Usecase) GetByID(id int32) (*PemeriksaanDokterTrimester1Response, error) {
	dokter, err := u.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	lab, _ := u.labRepo.FindByKehamilanIDAndTrimester(dokter.KehamilanID, 1)

	return &PemeriksaanDokterTrimester1Response{
		Dokter: dokter,
		Lab:    lab,
	}, nil
}

func (u *pemeriksaanDokterTrimester1Usecase) GetByKehamilanID(kehamilanID int32) ([]PemeriksaanDokterTrimester1Response, error) {
	list, err := u.repo.FindByKehamilanID(kehamilanID)
	if err != nil {
		return nil, err
	}

	var result []PemeriksaanDokterTrimester1Response

	for _, d := range list {
		lab, _ := u.labRepo.FindByKehamilanIDAndTrimester(d.KehamilanID, 1)

		result = append(result, PemeriksaanDokterTrimester1Response{
			Dokter: &d,
			Lab:    lab,
		})
	}

	return result, nil
}

func (u *pemeriksaanDokterTrimester1Usecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
