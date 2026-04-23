package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Preload("Role").Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *UserRepository) FindByUsername(username string) (*models.User, error) {
	var user models.User
	err := r.db.Preload("Role").Where("nama = ?", username).First(&user).Error
	return &user, err
}

func (r *UserRepository) FindByPhoneNumber(phone string) (*models.User, error) {
	var user models.User
	err := r.db.Preload("Role").Where("nomor_telepon = ?", phone).First(&user).Error
	return &user, err
}

func (r *UserRepository) FindByID(id int32) (*models.User, error) {
	var user models.User
	err := r.db.Preload("Role").First(&user, id).Error
	return &user, err
}
