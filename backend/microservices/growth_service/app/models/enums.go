package models

type GenderType string

const (
	GenderMale   GenderType = "M"
	GenderFemale GenderType = "F"
)

type StatusGizi string

const (
	StatusGiziBuruk    StatusGizi = "gizi_buruk"
	StatusGiziKurang   StatusGizi = "gizi_kurang"
	StatusGiziBaik     StatusGizi = "gizi_baik"
	StatusGiziLebih    StatusGizi = "gizi_lebih"
	StatusGiziObesitas StatusGizi = "obesitas"
)

// Parameter antropometri
type ParameterAntropometri string

const (
	ParameterBBU  ParameterAntropometri = "bb_u"  // Berat Badan per Umur
	ParameterTBU  ParameterAntropometri = "tb_u"  // Tinggi Badan per Umur
	ParameterIMTU ParameterAntropometri = "imt_u" // IMT per Umur
	ParameterBBTB ParameterAntropometri = "bb_tb" // Berat Badan per Tinggi Badan
)
