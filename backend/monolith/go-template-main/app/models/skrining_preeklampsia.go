package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

type JawabanPreeklampsia struct {
	// RESIKO SEDANG
	PasanganBaru        bool `json:"multipara_kehamilan_pasangan_baru"`
	TeknologiReproduksi bool `json:"teknologi_reproduksi_berbantu"`
	UsiaDiatas35        bool `json:"usia_diatas_35_tahun"`
	Nullipara           bool `json:"nulipara"`
	JarakKehamilan10Thn bool `json:"multipara_jarak_kehamilan_diatas_10_tahun"`
	RiwayatKeluarga     bool `json:"riwayat_preeklampsia_keluarga"`
	Obesitas            bool `json:"obesitas_sebelum_hamil_imt_diatas_30"`
	MAPDiatas90         bool `json:"mean_arterial_pressure_diatas_90"`
	Proteinuria         bool `json:"proteinuria_urin_celup_plus_1"`

	// RESIKO TINGGI
	RiwayatPreeklampsia bool `json:"multipara_riwayat_preeklampsia_sebelumnya"`
	KehamilanMultipel   bool `json:"kehamilan_multipel"`
	Diabetes            bool `json:"diabetes_dalam_kehamilan"`
	HipertensiKronik    bool `json:"hipertensi_kronik"`
	PenyakitGinjal      bool `json:"penyakit_ginjal"`
	PenyakitAutoimun    bool `json:"penyakit_autoimun_sle"`
	AntiPhospholipid    bool `json:"anti_phospholipid_syndrome"`
}

type SkriningPreeklampsiaDanDiabetes struct {
	IdSkrining      uint                `gorm:"column:id_skrining;primaryKey;autoIncrement" json:"id_skrining"`
	FKIdKehamilan   uint                `gorm:"column:id_kehamilan;not null" json:"id_kehamilan"`
	KehamilanKe     uint8               `gorm:"column:kehamilan_ke;not null" json:"kehamilan_ke"`
	UsiaKehamilan   uint8               `gorm:"column:usia_kehamilan;not null" json:"usia_kehamilan"`
	Jawaban         JawabanPreeklampsia `gorm:"column:jawaban;type:jsonb" json:"jawaban"`
	SkorTotal       int                 `gorm:"column:skor_total" json:"skor_total"`
	GulaDarahPuasa  float32             `json:"gula_darah_puasa"`
	GulaDarah2JamPP float32             `json:"gula_darah_2_jam_post_prandial"`
	Kesimpulan      string              `gorm:"column:kesimpulan;type:text" json:"kesimpulan"`
	Rekomendasi     string              `gorm:"column:rekomendasi;type:text" json:"rekomendasi"`
	CreatedAt       time.Time           `gorm:"column:created_at;default:CURRENT_TIMESTAMP" json:"created_at"`

	// Relationship
	Kehamilan Kehamilan `gorm:"foreignKey:FKIdKehamilan;references:IdKehamilan" json:"kehamilan,omitempty"`
}

// Convert JSONB ke Struct
func (j *JawabanPreeklampsia) Scan(value interface{}) error {
	if value == nil {
		*j = JawabanPreeklampsia{}
		return nil
	}

	b, ok := value.([]byte)
	if !ok {
		str, ok := value.(string)
		if !ok {
			return errors.New("Gagal konversi data JSONB ... ")
		}
		b = []byte(str)
	}
	return json.Unmarshal(b, j)
}

func (j JawabanPreeklampsia) Value() (driver.Value, error) {
	b, err := json.Marshal(j)
	if err != nil {
		return nil, err
	}
	return b, nil
}

func (SkriningPreeklampsiaDanDiabetes) TableName() string {
	return "skrining_preeklampsia"
}
