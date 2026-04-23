package models

import "time"

type KartuKeluarga struct {
	ID        int64      `gorm:"column:id;primaryKey" json:"id"`
	NoKK      *int64     `gorm:"column:no_kk" json:"no_kk,omitempty"`
	CreatedAt *time.Time `gorm:"column:created_at" json:"created_at,omitempty"`
	UpdatedAt *time.Time `gorm:"column:updated_at" json:"updated_at,omitempty"`
	DeletedAt *time.Time `gorm:"column:deleted_at" json:"deleted_at,omitempty"`
}

func (KartuKeluarga) TableName() string {
	return "kartu_keluarga"
}

type Penduduk struct {
	ID                 int64      `gorm:"column:id;primaryKey" json:"id"`
	KartuKeluargaID    *int64     `gorm:"column:kartu_keluarga_id" json:"kartu_keluarga_id,omitempty"`
	NIK                string     `gorm:"column:nik" json:"nik"`
	NamaLengkap        string     `gorm:"column:nama_lengkap" json:"nama_lengkap"`
	JenisKelamin       string     `gorm:"column:jenis_kelamin" json:"jenis_kelamin"`
	TanggalLahir       *time.Time `gorm:"column:tanggal_lahir" json:"tanggal_lahir,omitempty"`
	TempatLahir        string     `gorm:"column:tempat_lahir" json:"tempat_lahir"`
	GolonganDarah      string     `gorm:"column:golongan_darah" json:"golongan_darah"`
	Agama              string     `gorm:"column:agama" json:"agama"`
	StatusPerkawinan   string     `gorm:"column:status_perkawinan" json:"status_perkawinan"`
	PendidikanTerakhir string     `gorm:"column:pendidikan_terakhir" json:"pendidikan_terakhir"`
	Pekerjaan          string     `gorm:"column:pekerjaan" json:"pekerjaan"`
	BacaHuruf          string     `gorm:"column:baca_huruf" json:"baca_huruf"`
	KedudukanKeluarga  string     `gorm:"column:kedudukan_keluarga" json:"kedudukan_keluarga"`
	Dusun              string     `gorm:"column:dusun" json:"dusun"`
	TanggalPenambahan  *time.Time `gorm:"column:tanggal_penambahan" json:"tanggal_penambahan,omitempty"`
	AsalPenduduk       string     `gorm:"column:asal_penduduk" json:"asal_penduduk"`
	TanggalPengurangan *time.Time `gorm:"column:tanggal_pengurangan" json:"tanggal_pengurangan,omitempty"`
	TujuanPindah       string     `gorm:"column:tujuan_pindah" json:"tujuan_pindah"`
	TempatMeninggal    string     `gorm:"column:tempat_meninggal" json:"tempat_meninggal"`
	Keterangan         string     `gorm:"column:keterangan" json:"keterangan"`
	NomorTelepon       string     `gorm:"column:nomor_telepon" json:"nomor_telepon"`
	CreatedAt          *time.Time `gorm:"column:created_at" json:"created_at,omitempty"`
	UpdatedAt          *time.Time `gorm:"column:updated_at" json:"updated_at,omitempty"`
	DeletedAt          *time.Time `gorm:"column:deleted_at" json:"deleted_at,omitempty"`
}

func (Penduduk) TableName() string {
	return "penduduk"
}

// type Ibu struct {
// 	ID         int64      `gorm:"column:id;primaryKey" json:"id"`
// 	PendudukID int64      `gorm:"column:penduduk_id" json:"penduduk_id"`
// 	Gravida    *int       `gorm:"column:gravida" json:"gravida,omitempty"`
// 	CreatedAt  *time.Time `gorm:"column:created_at" json:"created_at,omitempty"`
// 	UpdatedAt  *time.Time `gorm:"column:updated_at" json:"updated_at,omitempty"`
// 	IsDeleted  *time.Time `gorm:"column:is_deleted" json:"is_deleted,omitempty"`
// }

type Ibu struct {
	ID         int64      `gorm:"column:id;primaryKey" json:"id"`
	PendudukID int64      `gorm:"column:penduduk_id" json:"penduduk_id"`
	Gravida    *int       `gorm:"column:gravida" json:"gravida,omitempty"`
	Paritas    *int       `gorm:"column:paritas" json:"paritas,omitempty"`
	Abortus    *int       `gorm:"column:abortus" json:"abortus,omitempty"`
	CreatedAt  *time.Time `gorm:"column:created_at" json:"created_at,omitempty"`
	UpdatedAt  *time.Time `gorm:"column:updated_at" json:"updated_at,omitempty"`
	DeletedAt  *time.Time `gorm:"column:deleted_at" json:"deleted_at,omitempty"`
}

func (Ibu) TableName() string {
	return "ibu"
}

// type Kehamilan struct {
// 	ID        int64      `gorm:"column:id;primaryKey" json:"id"`
// 	IbuID     int64      `gorm:"column:ibu_id" json:"ibu_id"`
// 	CreatedAt *time.Time `gorm:"column:created_at" json:"created_at,omitempty"`
// 	UpdatedAt *time.Time `gorm:"column:updated_at" json:"updated_at,omitempty"`
// 	DeletedAt *time.Time `gorm:"column:deleted_at" json:"deleted_at,omitempty"`
// }

// type Kehamilan struct {
// 	ID                       int64      `gorm:"column:id;primaryKey" json:"id"`
// 	IbuID                    int64      `gorm:"column:ibu_id" json:"ibu_id"`
// 	Hpht                     *time.Time `gorm:"column:hpht" json:"hpht"`
// 	TaksiranPersalinan       *time.Time `gorm:"column:taksiran_persalinan" json:"taksiran_persalinan"`
// 	UkKehamilanSaatIni       *int       `gorm:"column:uk_kehamilan_saat_ini" json:"uk_kehamilan_saat_ini"`
// 	JarakKehamilanSebelumnya *int       `gorm:"column:jarak_kehamilan_sebelumnya" json:"jarak_kehamilan_sebelumnya"`
// 	StatusKehamilan          *string    `gorm:"column:status_kehamilan" json:"status_kehamilan"`
// 	CreatedAt                *time.Time `gorm:"column:created_at" json:"created_at,omitempty"`
// 	UpdatedAt                *time.Time `gorm:"column:updated_at" json:"updated_at,omitempty"`
// 	DeletedAt                *time.Time `gorm:"column:deleted_at" json:"deleted_at,omitempty"`
// }

type Kehamilan struct {
    ID                       int64      `gorm:"column:id;primaryKey" json:"id"`
    IbuID                    int64      `gorm:"column:ibu_id" json:"ibu_id"`
    Hpht                     *time.Time `gorm:"column:hpht" json:"hpht"`
    TaksiranPersalinan       *time.Time `gorm:"column:taksiran_persalinan" json:"taksiran_persalinan"`
    UkKehamilanSaatIni       *int       `gorm:"column:uk_kehamilan_saat_ini" json:"uk_kehamilan_saat_ini"`
    JarakKehamilanSebelumnya *int       `gorm:"column:jarak_kehamilan_sebelumnya" json:"jarak_kehamilan_sebelumnya"`
    StatusKehamilanID        int64      `gorm:"column:status_kehamilan_id" json:"status_kehamilan_id"` 
    CreatedAt                *time.Time `gorm:"column:created_at" json:"created_at,omitempty"`
    UpdatedAt                *time.Time `gorm:"column:updated_at" json:"updated_at,omitempty"`
    DeletedAt                *time.Time `gorm:"column:deleted_at" json:"deleted_at,omitempty"`
}

func (Kehamilan) TableName() string {
	return "kehamilan"
}

type Anak struct {
	ID          int64      `gorm:"column:id;primaryKey" json:"id"`
	KehamilanID int64      `gorm:"column:kehamilan_id" json:"kehamilan_id"`
	PendudukID  *int64     `gorm:"column:penduduk_id" json:"penduduk_id,omitempty"`
	CreatedAt   *time.Time `gorm:"column:created_at" json:"created_at,omitempty"`
	UpdatedAt   *time.Time `gorm:"column:updated_at" json:"updated_at,omitempty"`
	DeletedAt   *time.Time `gorm:"column:deleted_at" json:"deleted_at,omitempty"`
}

func (Anak) TableName() string {
	return "anak"
}
