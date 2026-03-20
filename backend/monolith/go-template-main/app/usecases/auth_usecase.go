package usecases

import (
	"fmt"
	"net/mail"
	"strings"
	"time"

	"monitoring-service/app/models"
	"monitoring-service/pkg/customerror"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type roleDestination struct {
	TargetApp     string
	RedirectRoute string
}

var roleDestinations = map[string]roleDestination{
	"Dokter":           {TargetApp: "website", RedirectRoute: "/dashboard/dokter"},
	"Tenaga-kesehatan": {TargetApp: "website", RedirectRoute: "/dashboard/tenaga-kesehatan"},
	"Kader":            {TargetApp: "mobile", RedirectRoute: "/mobile/home-kader"},
	"Bidan":            {TargetApp: "mobile", RedirectRoute: "/mobile/home-bidan"},
	"Orangtua":         {TargetApp: "mobile", RedirectRoute: "/mobile/home-orangtua"},
}

var roleAliases = map[string]string{
	"dokter":           "Dokter",
	"tenagakesehatan":  "Tenaga-kesehatan",
	"tenaga-kesehatan": "Tenaga-kesehatan",
	"tenaga kesehatan": "Tenaga-kesehatan",
	"kader":            "Kader",
	"bidan":            "Bidan",
	"orangtua":         "Orangtua",
	"orang tua":        "Orangtua",
	"orang-tua":        "Orangtua",
}

func normalizeKey(raw string) string {
	raw = strings.TrimSpace(strings.ToLower(raw))
	raw = strings.ReplaceAll(raw, "-", "")
	raw = strings.ReplaceAll(raw, "_", "")
	raw = strings.ReplaceAll(raw, " ", "")
	return raw
}

func normalizeRoleName(roleName string) string {
	roleName = strings.TrimSpace(roleName)
	if roleName == "" {
		return ""
	}

	if canonical, ok := roleAliases[normalizeKey(roleName)]; ok {
		return canonical
	}

	return roleName
}

func roleRedirect(roleName string) (roleDestination, bool) {
	destination, ok := roleDestinations[roleName]
	return destination, ok
}

func validateRegisterInput(req *models.RegisterRequest) error {
	if req.Name == "" || req.Email == "" || req.Password == "" || req.RoleName == "" {
		return customerror.NewBadRequestError("name, email, password, dan role_name wajib diisi")
	}

	if len(req.Name) < 3 {
		return customerror.NewBadRequestError("name minimal 3 karakter")
	}

	if _, err := mail.ParseAddress(req.Email); err != nil {
		return customerror.NewBadRequestError("format email tidak valid")
	}

	if len(req.Password) < 8 {
		return customerror.NewBadRequestError("password minimal 8 karakter")
	}

	return nil
}

func (m *Main) buildAccessToken(user *models.User, destination roleDestination) (tokenString string, expiresIn int64, err error) {
	now := time.Now()
	expiry := now.Add(time.Duration(m.config.JWTAccessTokenMins) * time.Minute)

	claims := models.AuthClaims{
		UserID:        user.ID,
		Email:         user.Email,
		Role:          user.Role.Name,
		TargetApp:     destination.TargetApp,
		RedirectRoute: destination.RedirectRoute,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   fmt.Sprintf("%d", user.ID),
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(expiry),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err = token.SignedString([]byte(m.config.JWTSecret))
	if err != nil {
		return "", 0, err
	}

	return tokenString, int64(time.Until(expiry).Seconds()), nil
}

func (m *Main) Register(req *models.RegisterRequest) error {
	if req == nil {
		return customerror.NewBadRequestError("request tidak valid")
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	req.RoleName = normalizeRoleName(req.RoleName)

	if err := validateRegisterInput(req); err != nil {
		return err
	}

	if _, err := m.repository.GetUserByEmail(req.Email); err == nil {
		return customerror.NewBadRequestError("email sudah terdaftar")
	} else {
		if _, ok := err.(customerror.NotFoundError); !ok {
			return err
		}
	}

	role, err := m.repository.GetRoleByName(req.RoleName)
	if err != nil {
		return err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return customerror.NewInternalServiceError("gagal memproses password")
	}

	user := &models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashedPassword),
		RoleID:   role.ID,
	}

	if err := m.repository.CreateUser(user); err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "duplicate") || strings.Contains(strings.ToLower(err.Error()), "unique") {
			return customerror.NewBadRequestError("email sudah terdaftar")
		}
		return err
	}

	return nil
}

func (m *Main) Login(req *models.LoginRequest) (*models.LoginResponse, error) {
	if req == nil {
		return nil, customerror.NewBadRequestError("request tidak valid")
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" || req.Password == "" {
		return nil, customerror.NewBadRequestError("email dan password wajib diisi")
	}

	user, err := m.repository.GetUserByEmail(req.Email)
	if err != nil {
		if _, ok := err.(customerror.NotFoundError); ok {
			return nil, customerror.NewBadRequestError("email atau password salah")
		}
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, customerror.NewBadRequestError("email atau password salah")
	}

	destination, ok := roleRedirect(user.Role.Name)
	if !ok {
		return nil, customerror.NewInternalServiceError("role belum memiliki mapping target aplikasi")
	}

	accessToken, expiresIn, err := m.buildAccessToken(user, destination)
	if err != nil {
		return nil, customerror.NewInternalServiceError("gagal membuat access token")
	}

	res := &models.LoginResponse{
		AccessToken:   accessToken,
		TokenType:     "Bearer",
		ExpiresIn:     expiresIn,
		UserID:        user.ID,
		Name:          user.Name,
		Email:         user.Email,
		Role:          user.Role.Name,
		TargetApp:     destination.TargetApp,
		RedirectRoute: destination.RedirectRoute,
	}

	return res, nil
}
