package models

type RiwayatKehamilanLalu struct {
	IDRiwayat  int32 `gorm:"primaryKey" json:"id_riwayat"`
	IDEvaluasi int32 `gorm:"not null;index" json:"id_evaluasi"`
	// Evaluasi                 *EvaluasiKesehatanIbu `gorm:"foreignKey:IDEvaluasi;references:IDEvaluasi" json:"evaluasi,omitempty"`
	NoUrut                   int    `json:"no_urut"`
	Tahun                    int    `json:"tahun"`
	BGGram                   int    `json:"bb_gram"`
	ProsesMelahirkan         string `json:"proses_melahirkan"`
	PenolongProsesMelahirkan string `json:"penolong_proses_melahirkan"`
	Masalah                  string `json:"masalah"`
}

func (RiwayatKehamilanLalu) TableName() string {
	return "riwayat_kehamilan_lalu"
}
