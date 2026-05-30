package main

import (
    "log"
    "net/http"

    "backend-pertumbuhan/app/controllers"
    "backend-pertumbuhan/app/routes"

    "github.com/labstack/echo/v4"
)

func main() {
    e := echo.New()

    // init usecases/repositories/controllers inside controllers package
    ctrl := controllers.NewControllers()

    routes.ConfigureRouter(e, ctrl)

    log.Println("backend-pertumbuhan listening on :8081")
    if err := e.Start(":8081"); err != nil && err != http.ErrServerClosed {
        log.Fatalf("server error: %v", err)
    }
}
