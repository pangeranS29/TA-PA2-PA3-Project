package controllers

import (
    "net/http"
    "strconv"
    "time"

    "backend-pertumbuhan/app/models"

    "github.com/labstack/echo/v4"
)

func addCatatanHandler(c *Controllers, ctx echo.Context) error {
    var req models.CreatePertumbuhanRequest
    if err := ctx.Bind(&req); err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
    }
    if err := c.Usecase.AddCatatanPertumbuhan(&req); err != nil {
        return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
    }
    return ctx.JSON(http.StatusCreated, map[string]string{"message": "created"})
}

func getRiwayatHandler(c *Controllers, ctx echo.Context) error {
    anakParam := ctx.Param("anak_id")
    id, err := strconv.ParseUint(anakParam, 10, 64)
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "invalid anak_id"})
    }
    data, err := c.Usecase.GetRiwayatPertumbuhan(uint(id))
    if err != nil {
        return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
    }
    // convert to response
    var resp []models.CatatanPertumbuhanResponse
    for _, v := range data {
        resp = append(resp, models.CatatanPertumbuhanResponse{
            ID: v.ID,
            AnakID: v.AnakID,
            TglUkur: v.TglUkur.Format("2006-01-02"),
            BeratBadan: v.BeratBadan,
            TinggiBadan: v.TinggiBadan,
            LingkarKepala: v.LingkarKepala,
            HasilLila: v.HasilLila,
            IMT: v.IMT,
            CatatanNakes: v.CatatanNakes,
        })
    }
    return ctx.JSON(http.StatusOK, resp)
}

func updateCatatanHandler(c *Controllers, ctx echo.Context) error {
    idParam := ctx.Param("id")
    id, err := strconv.ParseUint(idParam, 10, 64)
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "invalid id"})
    }
    var req models.UpdatePertumbuhanRequest
    if err := ctx.Bind(&req); err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
    }
    if err := c.Usecase.UpdateCatatanPertumbuhan(uint(id), &req); err != nil {
        return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
    }
    return ctx.JSON(http.StatusOK, map[string]string{"message": "updated"})
}

func deleteCatatanHandler(c *Controllers, ctx echo.Context) error {
    idParam := ctx.Param("id")
    id, err := strconv.ParseUint(idParam, 10, 64)
    if err != nil {
        return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "invalid id"})
    }
    if err := c.Usecase.DeleteCatatanPertumbuhan(uint(id)); err != nil {
        return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
    }
    return ctx.JSON(http.StatusOK, map[string]string{"message": "deleted"})
}
