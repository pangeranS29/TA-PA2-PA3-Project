CREATE TABLE IF NOT EXISTS informasi_umum (
    id SERIAL PRIMARY KEY,
    tipe VARCHAR(20) NOT NULL,
    judul VARCHAR(255) NOT NULL,
    umur_target VARCHAR(50),
    durasi_baca VARCHAR(30),
    ringkasan TEXT,
    konten TEXT NOT NULL,
    thumbnail_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_informasi_umum_deleted_at ON informasi_umum (deleted_at);