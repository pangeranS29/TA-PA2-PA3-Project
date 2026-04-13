package models

type SkriningDMGestasional struct {
	IDSkriningDM uint      `gorm:"primaryKey" json:"id_skrining_dm"`
	IDIbu        uint      `gorm:"not null;index" json:"id_ibu"`
	Ibu          *IbuHamil `gorm:"foreignKey:IDIbu;references:ID" json:"ibu,omitempty"`

	GulaDarahPuasaHasil              *float64 `gorm:"type:decimal(5,2)" json:"gula_darah_puasa_hasil"`
	GulaDarahPuasaRencana            string   `json:"gula_darah_puasa_rencana_tindak_lanjut"`
	GulaDarah2JamPostPrandialHasil   *float64 `gorm:"type:decimal(5,2)" json:"gula_darah_2_jam_post_prandial_hasil"`
	GulaDarah2JamPostPrandialRencana string   `json:"gula_darah_2_jam_post_prandial_rencana_tindak_lanjut"`
}

func (SkriningDMGestasional) TableName() string {
	return "skrining_dm_gestasional"
}
