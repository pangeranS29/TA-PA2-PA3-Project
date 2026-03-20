package models

import "github.com/golang-jwt/jwt/v5"

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	RoleName string `json:"role_name"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	AccessToken   string `json:"access_token"`
	TokenType     string `json:"token_type"`
	ExpiresIn     int64  `json:"expires_in"`
	UserID        uint   `json:"user_id"`
	Name          string `json:"name"`
	Email         string `json:"email"`
	Role          string `json:"role"`
	TargetApp     string `json:"target_app"`
	RedirectRoute string `json:"redirect_route"`
}

type MeResponse struct {
	UserID        uint   `json:"user_id"`
	Email         string `json:"email"`
	Role          string `json:"role"`
	TargetApp     string `json:"target_app"`
	RedirectRoute string `json:"redirect_route"`
}

type AuthClaims struct {
	UserID        uint   `json:"user_id"`
	Email         string `json:"email"`
	Role          string `json:"role"`
	TargetApp     string `json:"target_app"`
	RedirectRoute string `json:"redirect_route"`
	jwt.RegisteredClaims
}
