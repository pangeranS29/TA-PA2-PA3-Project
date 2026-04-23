// controllers/kartu_keluarga_controller.go
package controllers

import (
	"net/http"
	"time"

	"monitoring-service/app/models"
	"monitoring-service/app/usecases"

	"github.com/labstack/echo/v4"
)

type KartuKeluargaController struct {
	usecase usecases.KartuKeluargaUsecase
}

func NewKartuKeluargaController(u usecases.KartuKeluargaUsecase) *KartuKeluargaController {
	return &KartuKeluargaController{usecase: u}
}

type createKKRequest struct {
	NoKK          string `json:"no_kk"`
	IDUser        int32  `json:"id_user"`
	TanggalTerbit string `json:"tanggal_terbit"`
}

func (c *KartuKeluargaController) Create(ctx echo.Context) error {
	var req createKKRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, models.Response{StatusCode: http.StatusBadRequest, Message: "Invalid request"})
	}

	var tanggalTerbit *time.Time
	if req.TanggalTerbit != "" {
		t, err := time.Parse("2006-01-02", req.TanggalTerbit)
		if err == nil {
			tanggalTerbit = &t
		}
	}

	kk := &models.KartuKeluarga{
		NoKK:          req.NoKK,
		IDUser:        &req.IDUser,
		TanggalTerbit: tanggalTerbit,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if err := c.usecase.Create(kk); err != nil {
		return ctx.JSON(http.StatusInternalServerError, models.Response{StatusCode: http.StatusInternalServerError, Message: err.Error()})
	}
	return ctx.JSON(http.StatusCreated, models.Response{StatusCode: http.StatusCreated, Data: kk})
}
