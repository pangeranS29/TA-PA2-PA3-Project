package repositories

import (
	"monitoring-service/app/models"
	"gorm.io/gorm"
)

type PemantauanAnakRepository interface {
	Create(record *models.LembarPemantauanAnak) error
	Update(record *models.LembarPemantauanAnak) error
	Delete(id int32) error
	FindByID(id int32) (*models.LembarPemantauanAnak, error)
	FindByChildAndRange(anakID int32, rentangID int32) ([]models.LembarPemantauanAnak, error)
	GetByPeriode(anakID int32, rentangID int32, periode int) (*models.LembarPemantauanAnak, error)
	GetRentangUsia() ([]models.RentangUsia, error)
	GetKategoriByRentang(rentangID int32) ([]models.KategoriTandaSakit, error)
	CreateKategori(data *models.KategoriTandaSakit) error
	UpdateKategori(data *models.KategoriTandaSakit) error
	DeleteKategori(id int32) error
}

type pemantauanAnakRepository struct {
	db *gorm.DB
}

func NewPemantauanAnakRepository(db *gorm.DB) PemantauanAnakRepository {
	return &pemantauanAnakRepository{db}
}

func (r *pemantauanAnakRepository) Create(record *models.LembarPemantauanAnak) error {
	return r.db.Create(record).Error
}

func (r *pemantauanAnakRepository) Update(record *models.LembarPemantauanAnak) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("lembar_pemantauan_anak_id = ?", record.ID).Delete(&models.DetailPemantauanAnak{}).Error; err != nil {
			return err
		}
		return tx.Save(record).Error
	})
}

func (r *pemantauanAnakRepository) Delete(id int32) error {
	return r.db.Delete(&models.LembarPemantauanAnak{}, id).Error
}

func (r *pemantauanAnakRepository) FindByID(id int32) (*models.LembarPemantauanAnak, error) {
	var record models.LembarPemantauanAnak
	err := r.db.Preload("DetailGejala.KategoriTandaSakit").First(&record, id).Error
	return &record, err
}

func (r *pemantauanAnakRepository) FindByChildAndRange(anakID int32, rentangID int32) ([]models.LembarPemantauanAnak, error) {
	var records []models.LembarPemantauanAnak
	err := r.db.Preload("DetailGejala.KategoriTandaSakit").
		Where("anak_id = ? AND rentang_usia_id = ?", anakID, rentangID).
		Order("periode_waktu asc").Find(&records).Error
	return records, err
}

func (r *pemantauanAnakRepository) GetByPeriode(anakID int32, rentangID int32, periode int) (*models.LembarPemantauanAnak, error) {
	var record models.LembarPemantauanAnak
	err := r.db.Where("anak_id = ? AND rentang_usia_id = ? AND periode_waktu = ?", anakID, rentangID, periode).First(&record).Error
	if err != nil {
		return nil, err
	}
	return &record, nil
}

func (r *pemantauanAnakRepository) GetRentangUsia() ([]models.RentangUsia, error) {
	var data []models.RentangUsia
	err := r.db.Find(&data).Error
	return data, err
}

func (r *pemantauanAnakRepository) GetKategoriByRentang(rentangID int32) ([]models.KategoriTandaSakit, error) {
	var data []models.KategoriTandaSakit
	err := r.db.Where("rentang_usia_id = ?", rentangID).Find(&data).Error
	return data, err
}

func (r *pemantauanAnakRepository) CreateKategori(data *models.KategoriTandaSakit) error {
	return r.db.Create(data).Error
}

func (r *pemantauanAnakRepository) UpdateKategori(data *models.KategoriTandaSakit) error {
	return r.db.Save(data).Error
}

func (r *pemantauanAnakRepository) DeleteKategori(id int32) error {
	return r.db.Delete(&models.KategoriTandaSakit{}, id).Error
}
