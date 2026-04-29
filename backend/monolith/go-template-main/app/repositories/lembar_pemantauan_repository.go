package repositories

import (
	"monitoring-service/app/models"
	"monitoring-service/pkg/customerror"
	"time"

	"gorm.io/gorm"
)

// Interface untuk LembarPemantauan Repository
type LembarPemantauanRepository interface {
	Create(lembarPemantauan *models.LembarPemantauan) error
	FindByID(id int32) (*models.LembarPemantauan, error)
	FindByAnakID(anakID int32) ([]models.LembarPemantauan, error)
	FindAll() ([]models.LembarPemantauan, error)
	IsAnakMilikIbu(userID, anakID int32) (bool, error)
	Update(lembarPemantauan *models.LembarPemantauan) error
	Delete(id int32) error
}

type lembarPemantauanRepository struct {
	db *gorm.DB
}

// Constructor
func NewLembarPemantauanRepository(db *gorm.DB) LembarPemantauanRepository {
	return &lembarPemantauanRepository{db: db}
}

// Create - Membuat lembar pemantauan baru beserta detail gejala
func (r *lembarPemantauanRepository) Create(lembarPemantauan *models.LembarPemantauan) error {
	// Menggunakan transaction untuk membuat lembar pemantauan dan detail secara bersamaan
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Buat lembar pemantauan
		if err := tx.Create(lembarPemantauan).Error; err != nil {
			return customerror.NewInternalServiceError("gagal membuat lembar pemantauan")
		}
		return nil
	})
}

// FindByID - Mencari lembar pemantauan berdasarkan ID dengan detail gejala
func (r *lembarPemantauanRepository) FindByID(id int32) (*models.LembarPemantauan, error) {
	var lembar models.LembarPemantauan
	err := r.db.
		Where("id = ? AND deleted_at IS NULL", id).
		Preload("Anak").
		Preload("RentangUsia").
		Preload("DetailGejala", func(db *gorm.DB) *gorm.DB {
			return db.Where("deleted_at IS NULL")
		}).
		Preload("DetailGejala.KategoriTandaSakit").
		First(&lembar).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, customerror.NewNotFoundError("lembar pemantauan tidak ditemukan")
		}
		return nil, customerror.NewInternalServiceError("gagal mengambil data lembar pemantauan")
	}

	return &lembar, nil
}

// FindByAnakID - Mencari semua lembar pemantauan untuk anak tertentu
func (r *lembarPemantauanRepository) FindByAnakID(anakID int32) ([]models.LembarPemantauan, error) {
	var lembars []models.LembarPemantauan
	err := r.db.
		Where("anak_id = ? AND deleted_at IS NULL", anakID).
		Preload("Anak").
		Preload("RentangUsia").
		Preload("DetailGejala", func(db *gorm.DB) *gorm.DB {
			return db.Where("deleted_at IS NULL")
		}).
		Preload("DetailGejala.KategoriTandaSakit").
		Order("tanggal_periksa DESC").
		Find(&lembars).Error

	if err != nil {
		return nil, customerror.NewInternalServiceError("gagal mengambil data lembar pemantauan anak")
	}

	return lembars, nil
}

// IsAnakMilikIbu - Memastikan anak dimiliki oleh ibu yang sedang login
func (r *lembarPemantauanRepository) IsAnakMilikIbu(userID, anakID int32) (bool, error) {
	var count int64
	err := r.db.Table("anak a").
		Joins("JOIN kehamilan k ON k.id = a.kehamilan_id").
		Joins("JOIN ibu i ON i.id = k.ibu_id").
		Joins("JOIN kependudukan ki ON ki.id = i.penduduk_id").
		Joins("JOIN pengguna p ON p.penduduk_id = ki.id").
		Where("a.id = ?", anakID).
		Where("p.id = ?", userID).
		Count(&count).Error
	if err != nil {
		return false, customerror.NewInternalServiceError("gagal memverifikasi kepemilikan data anak")
	}

	return count > 0, nil
}

// FindAll - Mencari semua lembar pemantauan
func (r *lembarPemantauanRepository) FindAll() ([]models.LembarPemantauan, error) {
	var lembars []models.LembarPemantauan
	err := r.db.
		Where("deleted_at IS NULL").
		Preload("Anak").
		Preload("RentangUsia").
		Preload("DetailGejala", func(db *gorm.DB) *gorm.DB {
			return db.Where("deleted_at IS NULL")
		}).
		Preload("DetailGejala.KategoriTandaSakit").
		Order("tanggal_periksa DESC").
		Find(&lembars).Error

	if err != nil {
		return nil, customerror.NewInternalServiceError("gagal mengambil data lembar pemantauan")
	}

	return lembars, nil
}

// Update - Mengupdate lembar pemantauan dan detail gejala
func (r *lembarPemantauanRepository) Update(lembarPemantauan *models.LembarPemantauan) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Update lembar pemantauan
		if err := tx.
			Model(&models.LembarPemantauan{}).
			Where("id = ?", lembarPemantauan.ID).
			Updates(lembarPemantauan).Error; err != nil {
			return customerror.NewInternalServiceError("gagal update lembar pemantauan")
		}

		// Hapus detail gejala lama (soft delete)
		if err := tx.
			Model(&models.DetailPemantauan{}).
			Where("lembar_pemantauan_id = ?", lembarPemantauan.ID).
			Update("deleted_at", time.Now()).Error; err != nil {
			return customerror.NewInternalServiceError("gagal menghapus detail gejala lama")
		}

		// Buat detail gejala baru
		if len(lembarPemantauan.DetailGejala) > 0 {
			for _, detail := range lembarPemantauan.DetailGejala {
				detail.LembarPemantauanID = lembarPemantauan.ID
				detail.DeletedAt = gorm.DeletedAt{}
				if err := tx.Create(&detail).Error; err != nil {
					return customerror.NewInternalServiceError("gagal membuat detail gejala baru")
				}
			}
		}

		return nil
	})
}

// Delete - Soft delete lembar pemantauan dan detail gejala
func (r *lembarPemantauanRepository) Delete(id int32) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Soft delete lembar pemantauan
		if err := tx.Model(&models.LembarPemantauan{}).
			Where("id = ?", id).
			Update("deleted_at", time.Now()).Error; err != nil {
			return customerror.NewInternalServiceError("gagal menghapus lembar pemantauan")
		}

		// Soft delete detail gejala terkait
		if err := tx.Model(&models.DetailPemantauan{}).
			Where("lembar_pemantauan_id = ?", id).
			Update("deleted_at", time.Now()).Error; err != nil {
			return customerror.NewInternalServiceError("gagal menghapus detail gejala")
		}

		return nil
	})
}
