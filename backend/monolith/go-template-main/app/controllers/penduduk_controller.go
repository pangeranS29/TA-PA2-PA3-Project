package controllers

import (
	"net/http"
	"strconv"
	"time"

	"monitoring-service/app/models"
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type PendudukController struct {
	usecase usecases.PendudukUsecase
}

func NewPendudukController(u usecases.PendudukUsecase) *PendudukController {
	return &PendudukController{usecase: u}
}

type createPendudukRequest struct {
	KartuKeluargaID    *int64  `json:"kartu_keluarga_id,omitempty"`
	NIK                *string `json:"nik,omitempty"`
	NamaLengkap        *string `json:"nama_lengkap,omitempty"`
	JenisKelamin       *string `json:"jenis_kelamin,omitempty"`
	TanggalLahir       *string `json:"tanggal_lahir,omitempty"` // format YYYY-MM-DD
	TempatLahir        *string `json:"tempat_lahir,omitempty"`
	GolonganDarah      *string `json:"golongan_darah,omitempty"`
	Agama              *string `json:"agama,omitempty"`
	StatusPerkawinan   *string `json:"status_perkawinan,omitempty"`
	PendidikanTerakhir *string `json:"pendidikan_terakhir,omitempty"`
	Pekerjaan          *string `json:"pekerjaan,omitempty"`
	BacaHuruf          *string `json:"baca_huruf,omitempty"`
	KedudukanKeluarga  *string `json:"kedudukan_keluarga,omitempty"`
	Dusun              *string `json:"dusun,omitempty"`
	NomorTelepon       *string `json:"nomor_telepon,omitempty"`
}

func (c *PendudukController) Create(ctx echo.Context) error {
	claims, _ := ctx.Get("auth_claims").(*models.AuthClaims)
	if claims == nil {
		return ctx.JSON(http.StatusUnauthorized, models.Response{StatusCode: http.StatusUnauthorized, Message: "Unauthorized"})
	}
	var req createPendudukRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}

	// Validasi field wajib
	if req.NamaLengkap == nil || *req.NamaLengkap == "" {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "nama_lengkap wajib diisi"})
	}
	if req.NIK == nil || *req.NIK == "" {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "nik wajib diisi"})
	}
	if req.TanggalLahir == nil || *req.TanggalLahir == "" {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "tanggal_lahir wajib diisi"})
	}

	// Parse tanggal lahir
	tanggalLahir, err := time.Parse("2006-01-02", *req.TanggalLahir)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "format tanggal_lahir harus YYYY-MM-DD"})
	}

	p := &models.Penduduk{
		KartuKeluargaID:    req.KartuKeluargaID,
		NIK:                req.NIK,
		NamaLengkap:        req.NamaLengkap,
		JenisKelamin:       req.JenisKelamin,
		TanggalLahir:       &tanggalLahir,
		TempatLahir:        req.TempatLahir,
		GolonganDarah:      req.GolonganDarah,
		Agama:              req.Agama,
		StatusPerkawinan:   req.StatusPerkawinan,
		PendidikanTerakhir: req.PendidikanTerakhir,
		Pekerjaan:          req.Pekerjaan,
		BacaHuruf:          req.BacaHuruf,
		KedudukanKeluarga:  req.KedudukanKeluarga,
		Dusun:              req.Dusun,
		NomorTelepon:       req.NomorTelepon,
	}

	data, err := c.usecase.Create(p)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusCreated, models.Response{StatusCode: http.StatusCreated, Data: data})
}

func (c *PendudukController) GetAll(ctx echo.Context) error {
	list, err := c.usecase.GetAll()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: list})
}

func (c *PendudukController) GetByID(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "invalid id"})
	}
	data, err := c.usecase.GetByID(id)
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *PendudukController) Update(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "invalid id"})
	}
	var req createPendudukRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}
	existing, err := c.usecase.GetByID(id)
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: "Data tidak ditemukan"})
	}

	// Update field yang diisi (tidak nil)
	if req.KartuKeluargaID != nil {
		existing.KartuKeluargaID = req.KartuKeluargaID
	}
	if req.NIK != nil {
		existing.NIK = req.NIK
	}
	if req.NamaLengkap != nil {
		existing.NamaLengkap = req.NamaLengkap
	}
	if req.JenisKelamin != nil {
		existing.JenisKelamin = req.JenisKelamin
	}
	if req.TanggalLahir != nil {
		t, err := time.Parse("2006-01-02", *req.TanggalLahir)
		if err == nil {
			existing.TanggalLahir = &t
		}
	}
	if req.TempatLahir != nil {
		existing.TempatLahir = req.TempatLahir
	}
	if req.GolonganDarah != nil {
		existing.GolonganDarah = req.GolonganDarah
	}
	if req.Agama != nil {
		existing.Agama = req.Agama
	}
	if req.StatusPerkawinan != nil {
		existing.StatusPerkawinan = req.StatusPerkawinan
	}
	if req.PendidikanTerakhir != nil {
		existing.PendidikanTerakhir = req.PendidikanTerakhir
	}
	if req.Pekerjaan != nil {
		existing.Pekerjaan = req.Pekerjaan
	}
	if req.BacaHuruf != nil {
		existing.BacaHuruf = req.BacaHuruf
	}
	if req.KedudukanKeluarga != nil {
		existing.KedudukanKeluarga = req.KedudukanKeluarga
	}
	if req.Dusun != nil {
		existing.Dusun = req.Dusun
	}
	if req.NomorTelepon != nil {
		existing.NomorTelepon = req.NomorTelepon
	}

	if err := c.usecase.Update(existing); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: existing})
}

func (c *PendudukController) Delete(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "invalid id"})
	}
	if err := c.usecase.Delete(id); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Message: "deleted"})
}
