package models

type GrafikPeningkatanBB struct {
	ID          int32      `gorm:"primaryKey" json:"id"`
	KehamilanID int32      `gorm:"not null;index" json:"kehamilan_id"`
	Kehamilan   *Kehamilan `gorm:"foreignKey:KehamilanID;references:ID" json:"kehamilan,omitempty"`

	BBPraKehamilanKg            *float64 `gorm:"type:decimal(5,2)" json:"bb_pra_kehamilan_kg"`
	IMTPraKehamilan             *float64 `gorm:"type:decimal(4,2)" json:"imt_pra_kehamilan"`
	KategoriIMTPraKehamilan     string   `gorm:"type:varchar(50)" json:"kategori_imt_pra_kehamilan"`
	RekomendasiPeningkatanBBMin *float64 `gorm:"type:decimal(4,1)" json:"rekomendasi_peningkatan_bb_min"`
	RekomendasiPeningkatanBBMax *float64 `gorm:"type:decimal(4,1)" json:"rekomendasi_peningkatan_bb_max"`

	MingguKehamilan       *int     `json:"minggu_kehamilan"`
	PeningkatanBBKg       *float64 `gorm:"type:decimal(4,2)" json:"peningkatan_bb_kg"`
	PenjelasanHasilGrafik string   `json:"penjelasan_hasil_grafik"`
}

func (GrafikPeningkatanBB) TableName() string {
	return "grafik_peningkatan_bb"
}
