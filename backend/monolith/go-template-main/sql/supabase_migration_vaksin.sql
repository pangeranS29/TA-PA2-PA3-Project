-- Supabase SQL Editor migration
-- Modul: Master Vaksin
-- Safe to run multiple times (idempotent)

BEGIN;

CREATE TABLE IF NOT EXISTS vaksin (
  id BIGSERIAL PRIMARY KEY,
  jenis_vaksin VARCHAR(50),
  kepanjangan VARCHAR(100),
  ditujukan_kepada VARCHAR(50),
  waktu_pemberian VARCHAR(50),
  deskripsi TEXT NOT NULL,
  efek_samping TEXT NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'aktif',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE IF EXISTS vaksin
  DROP COLUMN IF EXISTS nama,
  ADD COLUMN IF NOT EXISTS jenis_vaksin VARCHAR(50),
  ADD COLUMN IF NOT EXISTS kepanjangan VARCHAR(100),
  ADD COLUMN IF NOT EXISTS ditujukan_kepada VARCHAR(50),
  ADD COLUMN IF NOT EXISTS waktu_pemberian VARCHAR(50),
  ADD COLUMN IF NOT EXISTS status VARCHAR(10) DEFAULT 'aktif';

UPDATE vaksin SET status = 'aktif' WHERE status IS NULL;

CREATE INDEX IF NOT EXISTS vaksin_deleted_at_idx ON vaksin (deleted_at);

COMMIT;
