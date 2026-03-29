package models

import "github.com/golang-jwt/jwt/v5"

type RegisterRequest struct {
	Name        string `json:"name"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
	Password    string `json:"password"`
	RoleName    string `json:"role_name"`
	// fields untuk role spesifik(ibu)
	Nik          int64  `json:"nik,omitempty"`
	TanggalLahir string `json:"tanggal_lahir,omitempty"`
	Alamat       string `json:"alamat,omitempty"`
	Pekerjaan    string `json:"pekerjaan,omitempty"`
	Pendidikan   string `json:"pendidikan,omitempty"`
}

type LoginRequest struct {
	Identifier string `json:"identifier"`
	Email      string `json:"email,omitempty"`
	Password   string `json:"password"`
}

type LoginResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int64  `json:"expires_in"`
	UserID      uint   `json:"user_id"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
	// Role          string `json:"role"`
	UserRole      string `json:"user_role"`
	TargetApp     string `json:"target_app"`
	RedirectRoute string `json:"redirect_route"`
}

type MeResponse struct {
	UserID        uint   `json:"user_id"`
	Email         string `json:"email"`
	PhoneNumber   string `json:"phone_number"`
	UserRole      string `json:"user_role"`
	TargetApp     string `json:"target_app"`
	RedirectRoute string `json:"redirect_route"`
}

type AuthClaims struct {
	UserID        uint   `json:"user_id"`
	Email         string `json:"email"`
	PhoneNumber   string `json:"phone_number"`
	UserRole      string `json:"user_role"`
	TargetApp     string `json:"target_app"`
	RedirectRoute string `json:"redirect_route"`
	jwt.RegisteredClaims
}
