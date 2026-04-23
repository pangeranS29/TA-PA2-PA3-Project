package controllers

import (
	"net/http"
	"strconv"
	"time"

	"monitoring-service/app/models"
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type KependudukanController struct {
	usecase usecases.KependudukanUsecase
}

func NewKependudukanController(u usecases.KependudukanUsecase) *KependudukanController {
	return &KependudukanController{usecase: u}
}

type createKependudukanRequest struct {
	NoKK               string `json:"no_kk"`
	NIK                string `json:"nik"`
	Dusun              string `json:"dusun"`
	NamaLengkap        string `json:"nama_lengkap"`
	GolonganDarah      string `json:"golongan_darah"`
	JenisKelamin       string `json:"jenis_kelamin"`
	TempatLahir        string `json:"tempat_lahir"`
	TanggalLahir       string `json:"tanggal_lahir"`
	Pekerjaan          string `json:"pekerjaan"`
	PendidikanTerakhir string `json:"pendidikan_terakhir"`
	Alamat             string `json:"alamat"`
	Telepon            string `json:"telepon"`
}

func (c *KependudukanController) Create(ctx echo.Context) error {
	claims, _ := ctx.Get("auth_claims").(*models.AuthClaims)
	if claims == nil {
		return ctx.JSON(http.StatusUnauthorized, models.Response{StatusCode: http.StatusUnauthorized, Message: "Unauthorized"})
	}
	var req createKependudukanRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}

	// Validasi field wajib
	if req.NamaLengkap == "" || req.NIK == "" || req.TanggalLahir == "" {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "nama_lengkap, nik, dan tanggal_lahir wajib diisi"})
	}

	// Parse tanggal lahir
	tanggalLahir, err := time.Parse("2006-01-02", req.TanggalLahir)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "format tanggal_lahir harus YYYY-MM-DD"})
	}

	k := &models.pendudukan{
		NoKK:               req.NoKK,
		NIK:                req.NIK,
		Dusun:              req.Dusun,
		NamaLengkap:        req.NamaLengkap,
		GolonganDarah:      req.GolonganDarah,
		JenisKelamin:       req.JenisKelamin,
		TempatLahir:        req.TempatLahir,
		TanggalLahir:       tanggalLahir,
		Pekerjaan:          req.Pekerjaan,
		PendidikanTerakhir: req.PendidikanTerakhir,
		Alamat:             req.Alamat,
		Telepon:            req.Telepon,
	}

	data, err := c.usecase.Create(k)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusCreated, models.Response{StatusCode: http.StatusCreated, Data: data})
}

func (c *KependudukanController) GetAll(ctx echo.Context) error {
	list, err := c.usecase.GetAll()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: list})
}

func (c *KependudukanController) GetByID(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "invalid id"})
	}
	data, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: data})
}

func (c *KependudukanController) Update(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "invalid id"})
	}
	var req createKependudukanRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: err.Error()})
	}
	existing, err := c.usecase.GetByID(int32(id))
	if err != nil {
		return ctx.JSON(http.StatusNotFound, models.Response{StatusCode: http.StatusNotFound, Message: "Data tidak ditemukan"})
	}
	// Update field yang diisi
	if req.NoKK != "" {
		existing.NoKK = req.NoKK
	}
	if req.NIK != "" {
		existing.NIK = req.NIK
	}
	if req.Dusun != "" {
		existing.Dusun = req.Dusun
	}
	if req.NamaLengkap != "" {
		existing.NamaLengkap = req.NamaLengkap
	}
	if req.GolonganDarah != "" {
		existing.GolonganDarah = req.GolonganDarah
	}
	if req.JenisKelamin != "" {
		existing.JenisKelamin = req.JenisKelamin
	}
	if req.TempatLahir != "" {
		existing.TempatLahir = req.TempatLahir
	}
	if req.TanggalLahir != "" {
		if t, err := time.Parse("2006-01-02", req.TanggalLahir); err == nil {
			existing.TanggalLahir = t
		}
	}
	if req.Pekerjaan != "" {
		existing.Pekerjaan = req.Pekerjaan
	}
	if req.PendidikanTerakhir != "" {
		existing.PendidikanTerakhir = req.PendidikanTerakhir
	}
	if req.Alamat != "" {
		existing.Alamat = req.Alamat
	}
	if req.Telepon != "" {
		existing.Telepon = req.Telepon
	}
	if err := c.usecase.Update(existing); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Data: existing})
}

func (c *KependudukanController) Delete(ctx echo.Context) error {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 32)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "invalid id"})
	}
	if err := c.usecase.Delete(int32(id)); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusOK, models.Response{StatusCode: http.StatusOK, Message: "deleted"})
}
