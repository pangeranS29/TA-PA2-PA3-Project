package controllers

import (
	"monitoring-service/app/usecases"
    "monitoring-service/app/middlewares"
	"monitoring-service/app/utils"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
)

type PencatatanController struct {
    usecase usecases.PencatatanUsecase
}

func NewPencatatanController(usecase usecases.PencatatanUsecase) *PencatatanController {
    return &PencatatanController{usecase: usecase}
}

// GET /api/pencatatan/:kategori
func (ctrl *PencatatanController) GetDaftarPenduduk(c echo.Context) error {
    kategori := c.Param("kategori")
    if kategori == "" {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "kategori tidak boleh kosong"})
    }
    desaID := middlewares.GetDesaID(c)
    role := middlewares.GetRole(c)

    data, err := ctrl.usecase.GetPendudukByKategori(kategori, desaID, role)
    if err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
    }
    return c.JSON(http.StatusOK, map[string]interface{}{
        "kategori": kategori,
        "data":     data,
    })
}

// ---------- Request DTOs untuk binding ----------
type createAnakReq struct {
    PendudukID         int32     `json:"penduduk_id"`
    TanggalPemeriksaan time.Time `json:"tanggal_pemeriksaan"`
    BeratBadan         *float64  `json:"berat_badan"`
    TinggiBadan        *float64  `json:"tinggi_badan"`
    IMT                *float64  `json:"imt"`
    StatusGizi         string    `json:"status_gizi"`
    KategoriRisiko     string    `json:"kategori_risiko"`
    StatusPemantauan   string    `json:"status_pemantauan"`
    RiwayatPenyakit    string    `json:"riwayat_penyakit"`
    CatatanKhusus      string    `json:"catatan_khusus"`
    PemeriksaID        *int32    `json:"pemeriksa_id"`
}

type createRemajaReq struct {
    PendudukID         int32     `json:"penduduk_id"`
    TanggalPemeriksaan time.Time `json:"tanggal_pemeriksaan"`
    BeratBadan         *float64  `json:"berat_badan"`
    TinggiBadan        *float64  `json:"tinggi_badan"`
    IMT                *float64  `json:"imt"`
    TekananDarah       string    `json:"tekanan_darah"`
    KategoriRisiko     string    `json:"kategori_risiko"`
    StatusPemantauan   string    `json:"status_pemantauan"`
    RiwayatPenyakit    string    `json:"riwayat_penyakit"`
    CatatanKhusus      string    `json:"catatan_khusus"`
    PemeriksaID        *int32    `json:"pemeriksa_id"`
}

type createDewasaReq struct {
    PendudukID         int32     `json:"penduduk_id"`
    TanggalPemeriksaan time.Time `json:"tanggal_pemeriksaan"`
    BeratBadan         *float64  `json:"berat_badan"`
    TinggiBadan        *float64  `json:"tinggi_badan"`
    IMT                *float64  `json:"imt"`
    TekananDarah       string    `json:"tekanan_darah"`
    GulaDarah          *float64  `json:"gula_darah"`
    Kolesterol         *float64  `json:"kolesterol"`
    KategoriRisiko     string    `json:"kategori_risiko"`
    StatusPemantauan   string    `json:"status_pemantauan"`
    RiwayatPenyakit    string    `json:"riwayat_penyakit"`
    PenyakitKronis     string    `json:"penyakit_kronis"`
    CatatanKhusus      string    `json:"catatan_khusus"`
    PemeriksaID        *int32    `json:"pemeriksa_id"`
}

type createLansiaReq struct {
    PendudukID         int32     `json:"penduduk_id"`
    TanggalPemeriksaan time.Time `json:"tanggal_pemeriksaan"`
    BeratBadan         *float64  `json:"berat_badan"`
    TinggiBadan        *float64  `json:"tinggi_badan"`
    IMT                *float64  `json:"imt"`
    TekananDarah       string    `json:"tekanan_darah"`
    GulaDarah          *float64  `json:"gula_darah"`
    KategoriRisiko     string    `json:"kategori_risiko"`
    StatusPemantauan   string    `json:"status_pemantauan"`
    PenyakitKronis     string    `json:"penyakit_kronis"`
    StatusKemandirian  string    `json:"status_kemandirian"`
    RiwayatJatuh       bool      `json:"riwayat_jatuh"`
    CatatanKhusus      string    `json:"catatan_khusus"`
    PemeriksaID        *int32    `json:"pemeriksa_id"`
}

// POST /api/pencatatan/anak
func (ctrl *PencatatanController) CreatePemeriksaanAnak(c echo.Context) error {
    var req createAnakReq
    if err := c.Bind(&req); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "format request tidak valid"})
    }
    if err := utils.ValidateTimeNotFuture(req.TanggalPemeriksaan); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }
    if req.PendudukID == 0 {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "penduduk_id wajib diisi"})
    }
     desaID := middlewares.GetDesaID(c)
    role := middlewares.GetRole(c)

    pemeriksaan, err := ctrl.usecase.TambahPemeriksaanAnak(&usecases.PemeriksaanAnakRequest{
        PendudukID:         req.PendudukID,
        TanggalPemeriksaan: req.TanggalPemeriksaan,
        BeratBadan:         req.BeratBadan,
        TinggiBadan:        req.TinggiBadan,
        IMT:                req.IMT,
        StatusGizi:         req.StatusGizi,
        KategoriRisiko:     req.KategoriRisiko,
        StatusPemantauan:   req.StatusPemantauan,
        RiwayatPenyakit:    req.RiwayatPenyakit,
        CatatanKhusus:      req.CatatanKhusus,
        PemeriksaID:        req.PemeriksaID,
    },desaID, role)
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }
    return c.JSON(http.StatusCreated, map[string]interface{}{
        "message": "Pemeriksaan anak berhasil disimpan",
        "data":    pemeriksaan,
    })
}

// POST /api/pencatatan/remaja
func (ctrl *PencatatanController) CreatePemeriksaanRemaja(c echo.Context) error {
    var req createRemajaReq
    if err := c.Bind(&req); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "format request tidak valid"})
    }
    if err := utils.ValidateTimeNotFuture(req.TanggalPemeriksaan); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }
    if req.PendudukID == 0 {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "penduduk_id wajib diisi"})
    }

     desaID := middlewares.GetDesaID(c)
    role := middlewares.GetRole(c)
    pemeriksaan, err := ctrl.usecase.TambahPemeriksaanRemaja(&usecases.PemeriksaanRemajaRequest{
        PendudukID:         req.PendudukID,
        TanggalPemeriksaan: req.TanggalPemeriksaan,
        BeratBadan:         req.BeratBadan,
        TinggiBadan:        req.TinggiBadan,
        IMT:                req.IMT,
        TekananDarah:       req.TekananDarah,
        KategoriRisiko:     req.KategoriRisiko,
        StatusPemantauan:   req.StatusPemantauan,
        RiwayatPenyakit:    req.RiwayatPenyakit,
        CatatanKhusus:      req.CatatanKhusus,
        PemeriksaID:        req.PemeriksaID,
    },desaID, role)
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }
    return c.JSON(http.StatusCreated, map[string]interface{}{
        "message": "Pemeriksaan remaja berhasil disimpan",
        "data":    pemeriksaan,
    })
}

// POST /api/pencatatan/dewasa
func (ctrl *PencatatanController) CreatePemeriksaanDewasa(c echo.Context) error {
    var req createDewasaReq
    if err := c.Bind(&req); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "format request tidak valid"})
    }
    if err := utils.ValidateTimeNotFuture(req.TanggalPemeriksaan); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }
    if req.PendudukID == 0 {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "penduduk_id wajib diisi"})
    }

     desaID := middlewares.GetDesaID(c)
    role := middlewares.GetRole(c)
    pemeriksaan, err := ctrl.usecase.TambahPemeriksaanDewasa(&usecases.PemeriksaanDewasaRequest{
        PendudukID:         req.PendudukID,
        TanggalPemeriksaan: req.TanggalPemeriksaan,
        BeratBadan:         req.BeratBadan,
        TinggiBadan:        req.TinggiBadan,
        IMT:                req.IMT,
        TekananDarah:       req.TekananDarah,
        GulaDarah:          req.GulaDarah,
        Kolesterol:         req.Kolesterol,
        KategoriRisiko:     req.KategoriRisiko,
        StatusPemantauan:   req.StatusPemantauan,
        RiwayatPenyakit:    req.RiwayatPenyakit,
        PenyakitKronis:     req.PenyakitKronis,
        CatatanKhusus:      req.CatatanKhusus,
        PemeriksaID:        req.PemeriksaID,
    },desaID, role)
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }
    return c.JSON(http.StatusCreated, map[string]interface{}{
        "message": "Pemeriksaan dewasa berhasil disimpan",
        "data":    pemeriksaan,
    })
}

// POST /api/pencatatan/lansia
func (ctrl *PencatatanController) CreatePemeriksaanLansia(c echo.Context) error {
    var req createLansiaReq
    if err := c.Bind(&req); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "format request tidak valid"})
    }
    if err := utils.ValidateTimeNotFuture(req.TanggalPemeriksaan); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }
    if req.PendudukID == 0 {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "penduduk_id wajib diisi"})
    }
     desaID := middlewares.GetDesaID(c)
    role := middlewares.GetRole(c)

    pemeriksaan, err := ctrl.usecase.TambahPemeriksaanLansia(&usecases.PemeriksaanLansiaRequest{
        PendudukID:         req.PendudukID,
        TanggalPemeriksaan: req.TanggalPemeriksaan,
        BeratBadan:         req.BeratBadan,
        TinggiBadan:        req.TinggiBadan,
        IMT:                req.IMT,
        TekananDarah:       req.TekananDarah,
        GulaDarah:          req.GulaDarah,
        KategoriRisiko:     req.KategoriRisiko,
        StatusPemantauan:   req.StatusPemantauan,
        PenyakitKronis:     req.PenyakitKronis,
        StatusKemandirian:  req.StatusKemandirian,
        RiwayatJatuh:       req.RiwayatJatuh,
        CatatanKhusus:      req.CatatanKhusus,
        PemeriksaID:        req.PemeriksaID,
    },desaID, role)
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }
    return c.JSON(http.StatusCreated, map[string]interface{}{
        "message": "Pemeriksaan lansia berhasil disimpan",
        "data":    pemeriksaan,
    })
}

// GET /tenaga-kesehatan/pemeriksaan-riwayat?kategori=anak&penduduk_id=1
func (ctrl *PencatatanController) GetRiwayatPemeriksaan(c echo.Context) error {
    kategori := c.QueryParam("kategori")
    pendudukIDStr := c.QueryParam("penduduk_id")
    
    if kategori == "" || pendudukIDStr == "" {
        return c.JSON(http.StatusBadRequest, map[string]string{
            "error": "parameter kategori dan penduduk_id wajib diisi",
        })
    }
    
    pendudukID, err := strconv.ParseInt(pendudukIDStr, 10, 32)
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "penduduk_id tidak valid"})
    }
     desaID := middlewares.GetDesaID(c)
    role := middlewares.GetRole(c)
    data, err := ctrl.usecase.GetRiwayatPemeriksaanByPendudukID(int32(pendudukID), kategori,desaID, role)
    if err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
    }
    
    return c.JSON(http.StatusOK, map[string]interface{}{
        "data": data,
    })
}