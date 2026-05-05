package usecases

import (
	"errors"
	"monitoring-service/app/models"
	"monitoring-service/app/repositories"
	"time"
)

type PemeriksaanDokterTrimester3Usecase interface {
	Create(req *PemeriksaanDokterTrimester3Request) error
	Update(id int32, req *PemeriksaanDokterTrimester3Request) error
	GetByID(id int32) (*PemeriksaanDokterTrimester3Response, error)
	GetByKehamilanID(kehamilanID int32) ([]PemeriksaanDokterTrimester3Response, error)
	Delete(id int32) error
}

type pemeriksaanDokterTrimester3Usecase struct {
	repo    *repositories.PemeriksaanDokterTrimester3Repository
	labRepo *repositories.PemeriksaanLaboratoriumJiwaRepository
}

func NewPemeriksaanDokterTrimester3Usecase(
	repo *repositories.PemeriksaanDokterTrimester3Repository,
	labRepo *repositories.PemeriksaanLaboratoriumJiwaRepository,
) PemeriksaanDokterTrimester3Usecase {
	return &pemeriksaanDokterTrimester3Usecase{
		repo:    repo,
		labRepo: labRepo,
	}
}

type PemeriksaanDokterTrimester3Request struct {
	KehamilanID    int32  `json:"kehamilan_id"`
	NamaDokter     string `json:"nama_dokter"`
	TanggalPeriksa string `json:"tanggal_periksa"`

	// (dipersingkat biar fokus error, sisanya tetap sama)
}

type PemeriksaanDokterTrimester3Response struct {
	Dokter *models.PemeriksaanDokterTrimester3 `json:"dokter"`
	Lab    *models.PemeriksaanLaboratoriumJiwa `json:"lab_jiwa,omitempty"`
}

func (u *pemeriksaanDokterTrimester3Usecase) mapRequestToDokter(req *PemeriksaanDokterTrimester3Request) *models.PemeriksaanDokterTrimester3 {
	dokter := &models.PemeriksaanDokterTrimester3{
		KehamilanID: req.KehamilanID,
		NamaDokter:  req.NamaDokter,
	}

	if req.TanggalPeriksa != "" {
		t, _ := time.Parse("2006-01-02", req.TanggalPeriksa)
		dokter.TanggalPeriksa = &t
	}

	return dokter
}

func (u *pemeriksaanDokterTrimester3Usecase) mapRequestToLab(req *PemeriksaanDokterTrimester3Request, trimester int32) *models.PemeriksaanLaboratoriumJiwa {
	return nil // sementara (isi sesuai kebutuhanmu)
}

func (u *pemeriksaanDokterTrimester3Usecase) Create(req *PemeriksaanDokterTrimester3Request) error {
	if req.KehamilanID == 0 {
		return errors.New("kehamilan_id wajib diisi")
	}

	dokter := u.mapRequestToDokter(req)
	lab := u.mapRequestToLab(req, 3)

	return u.repo.CreateWithLab(dokter, lab)
}

func (u *pemeriksaanDokterTrimester3Usecase) Update(id int32, req *PemeriksaanDokterTrimester3Request) error {
	existing, err := u.repo.FindByID(id)
	if err != nil {
		return errors.New("data tidak ditemukan")
	}

	dokter := u.mapRequestToDokter(req)
	dokter.KehamilanID = existing.KehamilanID

	lab := u.mapRequestToLab(req, 3)

	return u.repo.UpdateWithLab(id, dokter, lab)
}

func (u *pemeriksaanDokterTrimester3Usecase) GetByID(id int32) (*PemeriksaanDokterTrimester3Response, error) {
	dokter, err := u.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	lab, _ := u.labRepo.FindByKehamilanIDAndTrimester(dokter.KehamilanID, 3)

	return &PemeriksaanDokterTrimester3Response{
		Dokter: dokter,
		Lab:    lab,
	}, nil
}

func (u *pemeriksaanDokterTrimester3Usecase) GetByKehamilanID(kehamilanID int32) ([]PemeriksaanDokterTrimester3Response, error) {
	list, err := u.repo.FindByKehamilanID(kehamilanID)
	if err != nil {
		return nil, err
	}

	var result []PemeriksaanDokterTrimester3Response

	for _, d := range list {
		lab, _ := u.labRepo.FindByKehamilanIDAndTrimester(d.KehamilanID, 3)

		result = append(result, PemeriksaanDokterTrimester3Response{
			Dokter: &d,
			Lab:    lab,
		})
	}

	return result, nil
}

func (u *pemeriksaanDokterTrimester3Usecase) Delete(id int32) error {
	return u.repo.Delete(id)
}
