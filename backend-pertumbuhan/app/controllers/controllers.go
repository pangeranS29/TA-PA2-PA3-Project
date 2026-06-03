package controllers

import (
    "net/http"

    "backend-pertumbuhan/app/repositories"
    "backend-pertumbuhan/app/usecases"

    "github.com/labstack/echo/v4"
)

type Controllers struct {
    Usecase *usecases.PertumbuhanUsecase
}

func NewControllers() *Controllers {
    repo := repositories.NewInMemoryRepo()
    uc := usecases.NewPertumbuhanUsecase(repo)
    return &Controllers{Usecase: uc}
}

// helper wrappers to satisfy routes package - actual handlers are methods below
func (c *Controllers) AddCatatanPertumbuhan(ctx echo.Context) error {
    return addCatatanHandler(c, ctx)
}

func (c *Controllers) GetRiwayatPertumbuhan(ctx echo.Context) error {
    return getRiwayatHandler(c, ctx)
}

func (c *Controllers) UpdateCatatanPertumbuhan(ctx echo.Context) error {
    return updateCatatanHandler(c, ctx)
}

func (c *Controllers) DeleteCatatanPertumbuhan(ctx echo.Context) error {
    return deleteCatatanHandler(c, ctx)
}

// Simple health check
func (c *Controllers) Health(ctx echo.Context) error {
    return ctx.JSON(http.StatusOK, map[string]string{"status": "ok"})
}
