package controllers

import (
	"github.com/labstack/echo/v4"
	"monitoring-service/app/models"
	// "monitoring-service/app/constants"
	"monitoring-service/app/helpers"
	"net/http"
	"strings"
)

// func (m *Main) GetProfileIbu(c echo.Context) error {
//     rawClaims := c.Get("auth_claims")
//     claims, ok := rawClaims.(*models.AuthClaims)
//     if !ok || claims == nil {
//         return helpers.Response(c, http.StatusUnauthorized, []string{"sesi tidak valid atau token kadaluwarsa"})
//     }

//     result, err := m.usecases.GetProfilMedisIbu(*claims)
//     if err != nil {
//         errMsg := strings.ToLower(err.Error())

//         if strings.Contains(errMsg, "tidak ditemukan") {
//             return helpers.Response(c, http.StatusNotFound, []string{err.Error()})
//         }
        
//         if strings.Contains(errMsg, "belum terhubung") {
//             return helpers.Response(c, http.StatusBadRequest, []string{err.Error()})
//         }

//         return helpers.Response(c, http.StatusInternalServerError, []string{"terjadi kesalahan server saat mengambil profil ibu"})
//     }

//     return helpers.StandardResponse(c, http.StatusOK, []string{"profil ibu berhasil diambil"}, result, nil)
// }

func (m *Main) GetProfileIbu(c echo.Context) error {
    rawClaims := c.Get("auth_claims")
    claims, ok := rawClaims.(*models.AuthClaims)
    if !ok || claims == nil {
        return helpers.Response(c, http.StatusUnauthorized, []string{"sesi tidak valid atau token kadaluwarsa"})
    }

    result, err := m.usecases.GetProfileLengkapIbu(*claims) 
    if err != nil {
        errMsg := strings.ToLower(err.Error())

        if strings.Contains(errMsg, "tidak ditemukan") {
            return helpers.Response(c, http.StatusNotFound, []string{err.Error()})
        }
        
        if strings.Contains(errMsg, "belum terhubung") {
            return helpers.Response(c, http.StatusBadRequest, []string{err.Error()})
        }

        return helpers.Response(c, http.StatusInternalServerError, []string{"terjadi kesalahan server saat mengambil profil ibu"})
    }

    // Result sekarang berisi JSON gabungan { "profil_medis": ..., "kehamilan": ... }
    return helpers.StandardResponse(c, http.StatusOK, []string{"profil ibu berhasil diambil"}, result, nil)
}