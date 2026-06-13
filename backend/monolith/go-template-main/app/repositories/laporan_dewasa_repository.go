package repositories

import (
	"time"

	"monitoring-service/app/middlewares"
	"monitoring-service/app/models"

	"gorm.io/gorm"
)

type LaporanDewasaRepository interface {
	GetLaporanDewasa(startDate, endDate string, desaID *int32, role string) ([]models.LaporanDewasa, error)
}

type laporanDewasaRepository struct {
	db *gorm.DB
}

func NewLaporanDewasaRepository(db *gorm.DB) LaporanDewasaRepository {
	return &laporanDewasaRepository{db}
}

// GetLaporanDewasa mengambil data dewasa untuk export laporan.
func (r *laporanDewasaRepository) GetLaporanDewasa(startDate, endDate string, desaID *int32, role string) ([]models.LaporanDewasa, error) {
	var result []models.LaporanDewasa

	query := r.db.Table("pemeriksaan_dewasa pd").
		Select(`
			COALESCE(p.nik, '') AS nik,
			COALESCE(p.nama_lengkap, '') AS nama_lengkap,
			p.tanggal_lahir,
			pd.umur,
			COALESCE(p.jenis_kelamin, '') AS jenis_kelamin,
			pd.tanggal_pemeriksaan,
			pd.berat_badan,
			pd.tinggi_badan,
			pd.imt,
			COALESCE(pd.tekanan_darah, '') AS tekanan_darah,
			pd.gula_darah,
			pd.kolesterol,
			COALESCE(pd.kategori_risiko, '') AS kategori_risiko,
			COALESCE(pd.status_pemantauan, '') AS status_pemantauan,
			COALESCE(pd.riwayat_penyakit, '') AS riwayat_penyakit,
			COALESCE(pd.penyakit_kronis, '') AS penyakit_kronis,
			COALESCE(pd.catatan_khusus, '') AS catatan_khusus,
			COALESCE(p.kecamatan, '') AS kecamatan,
			COALESCE(d.nama_desa, '') AS desa
		`).
		Joins("JOIN penduduk p ON p.id = pd.penduduk_id AND p.deleted_at IS NULL").
		Joins("LEFT JOIN desa d ON d.id = p.desa_id").
		Where("pd.deleted_at IS NULL")

	// Filter tanggal pemeriksaan
	if startDate != "" && endDate != "" {
		tStart, errStart := time.Parse("2006-01-02", startDate)
		tEnd, errEnd := time.Parse("2006-01-02", endDate)
		if errStart == nil && errEnd == nil {
			tEnd = tEnd.Add(24*time.Hour - time.Second) // 23:59:59
			query = query.Where("pd.tanggal_pemeriksaan >= ? AND pd.tanggal_pemeriksaan <= ?", tStart, tEnd)
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
