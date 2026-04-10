package controllers

import "monitoring-service/app/usecases"

type NeonatusController struct {
	usecase usecases.NeonatusUsecase
}

func NewPelayananNeonatusController(uc usecases.NeonatusUsecase) *NeonatusController{
	return &NeonatusController{usecase: uc}
}

