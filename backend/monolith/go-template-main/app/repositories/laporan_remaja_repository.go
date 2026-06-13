package repositories

import (
	"time"

	"monitoring-service/app/middlewares"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type LaporanRemajaRepository interface {
	GetLaporanRemaja(startDate, endDate string, desaID *int32, role string) ([]models.LaporanRemaja, error)
}

type laporanRemajaRepository struct {
	db *gorm.DB
}

func NewLaporanRemajaRepository(db *gorm.DB) LaporanRemajaRepository {
	return &laporanRemajaRepository{db}
}

// GetLaporanRemaja mengambil data remaja untuk export laporan.
func (r *laporanRemajaRepository) GetLaporanRemaja(startDate, endDate string, desaID *int32, role string) ([]models.LaporanRemaja, error) {
	var result []models.LaporanRemaja

	query := r.db.Table("pemeriksaan_remaja pr").
		Select(`
			COALESCE(p.nik, '') AS nik,
			COALESCE(p.nama_lengkap, '') AS nama_lengkap,
			p.tanggal_lahir,
			pr.umur,
			COALESCE(p.jenis_kelamin, '') AS jenis_kelamin,
			pr.tanggal_pemeriksaan,
			pr.berat_badan,
			pr.tinggi_badan,
			pr.imt,
			COALESCE(pr.tekanan_darah, '') AS tekanan_darah,
			COALESCE(pr.kategori_risiko, '') AS kategori_risiko,
			COALESCE(pr.status_pemantauan, '') AS status_pemantauan,
			COALESCE(pr.riwayat_penyakit, '') AS riwayat_penyakit,
			COALESCE(pr.catatan_khusus, '') AS catatan_khusus,
			COALESCE(p.kecamatan, '') AS kecamatan,
			COALESCE(d.nama_desa, '') AS desa
		`).
		Joins("JOIN penduduk p ON p.id = pr.penduduk_id AND p.deleted_at IS NULL").
		Joins("LEFT JOIN desa d ON d.id = p.desa_id").
		Where("pr.deleted_at IS NULL")

	// Filter tanggal pemeriksaan
	if startDate != "" && endDate != "" {
		tStart, errStart := time.Parse("2006-01-02", startDate)
		tEnd, errEnd := time.Parse("2006-01-02", endDate)
		if errStart == nil && errEnd == nil {
			tEnd = tEnd.Add(24*time.Hour - time.Second) // 23:59:59
			query = query.Where("pr.tanggal_pemeriksaan >= ? AND pr.tanggal_pemeriksaan <= ?", tStart, tEnd)
		}
	}

	// Filter desa berdasarkan role
	if desaID != nil && *desaID > 0 && !middlewares.HasFullAccess(role) {
		query = query.Where("p.desa_id = ?", *desaID)
	}

	query = query.Order("p.nama_lengkap ASC")

	err := query.Scan(&result).Error
	return result, err
}
