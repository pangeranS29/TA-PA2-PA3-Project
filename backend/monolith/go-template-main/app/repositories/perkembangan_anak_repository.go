package repositories

import (
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type PerkembanganAnakRepository interface {
	GetRentangUsia() ([]models.RentangUsiaPerkembangan, error)
	GetKategoriByRentang(rentangID int32) ([]models.KategoriPerkembangan, error)
	SaveLembar(lembar *models.LembarPerkembanganAnak) error
	GetHistory(anakID, rentangID int32) ([]models.LembarPerkembanganAnak, error)
	
	// Admin Manage
	CreateKategori(kategori *models.KategoriPerkembangan) error
	UpdateKategori(kategori *models.KategoriPerkembangan) error
	DeleteKategori(id int32) error
	DeleteLembar(id int32) error
}

type perkembanganAnakRepository struct {
	db *gorm.DB
}

func NewPerkembanganAnakRepository(db *gorm.DB) PerkembanganAnakRepository {
	return &perkembanganAnakRepository{db}
}

func (r *perkembanganAnakRepository) GetRentangUsia() ([]models.RentangUsiaPerkembangan, error) {
	var data []models.RentangUsiaPerkembangan
	err := r.db.Order("id asc").Find(&data).Error
	return data, err
}

func (r *perkembanganAnakRepository) GetKategoriByRentang(rentangID int32) ([]models.KategoriPerkembangan, error) {
	var data []models.KategoriPerkembangan
	err := r.db.Where("rentang_usia_perkembangan_id = ?", rentangID).Find(&data).Error
	return data, err
}

func (r *perkembanganAnakRepository) SaveLembar(lembar *models.LembarPerkembanganAnak) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Hapus isian lama untuk rentang yang sama (UPSERT logic per rentang)
		// Pada perkembangan, biasanya isian per rentang usia hanya sekali, beda dengan pemantauan yang mingguan.
		// Namun untuk fleksibilitas kita biarkan sistem menyimpan riwayat per tanggal.
		
		if err := tx.Create(lembar).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *perkembanganAnakRepository) GetHistory(anakID, rentangID int32) ([]models.LembarPerkembanganAnak, error) {
	var data []models.LembarPerkembanganAnak
	query := r.db.Preload("DetailPerkembangan.KategoriPerkembangan").
		Where("anak_id = ?", anakID)
	
	if rentangID > 0 {
		query = query.Where("rentang_usia_perkembangan_id = ?", rentangID)
	}
	
	err := query.Order("tanggal_periksa desc").Find(&data).Error
	return data, err
}

func (r *perkembanganAnakRepository) CreateKategori(kategori *models.KategoriPerkembangan) error {
	return r.db.Create(kategori).Error
}

func (r *perkembanganAnakRepository) UpdateKategori(kategori *models.KategoriPerkembangan) error {
	return r.db.Save(kategori).Error
}

func (r *perkembanganAnakRepository) DeleteKategori(id int32) error {
	return r.db.Delete(&models.KategoriPerkembangan{}, id).Error
}

func (r *perkembanganAnakRepository) DeleteLembar(id int32) error {
	return r.db.Delete(&models.LembarPerkembanganAnak{}, id).Error
}
