# 🔄 Migration Instructions - Trimester Improvements

**Status:** ⚠️ **PENDING EXECUTION**  
**Database:** PostgreSQL  
**Date:** 2026-05-06  
**Migration File:** `sql/migration_trimester_improvements_postgresql.sql`  

---

## 🚨 PENTING - BACA DULU!

**Jika Anda mendapat error:**
```
ERROR: column "gambar_usg" of relation "pemeriksaan_dokter_trimester_1" does not exist
```

**Berarti:** Database belum memiliki kolom `gambar_usg`. Kolom ini HARUS ditambahkan sebelum Go code bisa menyimpan data.

**Solusi:** Jalankan migration di bawah ini.

---

## 📋 MIGRATION CHECKLIST

- [ ] Backup database sebelum migration
- [ ] Siapkan environment variables
- [ ] Run migration script
- [ ] Verify hasil migration
- [ ] Restart Go application
- [ ] Test API dengan data baru

---

## 🔧 CARA MENJALANKAN MIGRATION

### Opsi 1: Menggunakan PowerShell Script (Recommended untuk Windows)

```powershell
# Set environment variables terlebih dahulu
$env:DB_POSTGRES_USER = "your_db_user"
$env:DB_POSTGRES_PASSWORD = "your_db_password"
$env:DB_POSTGRES_HOST = "localhost"
$env:DB_POSTGRES_PORT = "5432"
$env:DB_POSTGRES_NAME = "your_database_name"
$env:DB_POSTGRES_SCHEMA = "public"

# Jalankan script
cd backend/monolith/go-template-main
.\sql\run_migration.ps1
```

### Opsi 2: Menggunakan Bash Script (Linux/Mac)

```bash
# Set environment variables
export DB_POSTGRES_USER="your_db_user"
export DB_POSTGRES_PASSWORD="your_db_password"
export DB_POSTGRES_HOST="localhost"
export DB_POSTGRES_PORT="5432"
export DB_POSTGRES_NAME="your_database_name"
export DB_POSTGRES_SCHEMA="public"

# Jalankan script
cd backend/monolith/go-template-main
chmod +x sql/run_migration.sh
./sql/run_migration.sh
```

### Opsi 3: Manual - Jalankan Query Langsung dengan psql

```bash
# Siapkan connection parameters
DB_USER="your_db_user"
DB_PASSWORD="your_db_password"
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="your_database_name"

# Run migration
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f backend/monolith/go-template-main/sql/migration_trimester_improvements_postgresql.sql
```

### Opsi 4: Jalankan Query Satu Per Satu via pgAdmin atau SQL Client

Jika Anda menggunakan pgAdmin atau client SQL lainnya, copy & paste query berikut:

```sql
-- 1. Add GambarUSG column to pemeriksaan_dokter_trimester_1
ALTER TABLE pemeriksaan_dokter_trimester_1
ADD COLUMN IF NOT EXISTS gambar_usg TEXT NULL;

-- 2. Update foreign key untuk catatan_pelayanan_trimester_1 dengan CASCADE DELETE
ALTER TABLE catatan_pelayanan_trimester_1
DROP CONSTRAINT IF EXISTS catatan_pelayanan_trimester_1_kehamilan_id_fkey;

ALTER TABLE catatan_pelayanan_trimester_1
ADD CONSTRAINT catatan_pelayanan_trimester_1_kehamilan_id_fkey
FOREIGN KEY (kehamilan_id) REFERENCES kehamilan(id) ON DELETE CASCADE;

-- 3. Add GambarUSG column to pemeriksaan_dokter_trimester_3
ALTER TABLE pemeriksaan_dokter_trimester_3
ADD COLUMN IF NOT EXISTS gambar_usg TEXT NULL;

-- 4. Update foreign key untuk catatan_pelayanan_trimester_3 dengan CASCADE DELETE
ALTER TABLE catatan_pelayanan_trimester_3
DROP CONSTRAINT IF EXISTS catatan_pelayanan_trimester_3_kehamilan_id_fkey;

ALTER TABLE catatan_pelayanan_trimester_3
ADD CONSTRAINT catatan_pelayanan_trimester_3_kehamilan_id_fkey
FOREIGN KEY (kehamilan_id) REFERENCES kehamilan(id) ON DELETE CASCADE;
```

---

## ✅ VERIFIKASI MIGRATION

Setelah migration selesai, jalankan queries berikut untuk memverifikasi:

### 1. Check Kolom gambar_usg Sudah Ada

```sql
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('pemeriksaan_dokter_trimester_1', 'pemeriksaan_dokter_trimester_3')
  AND column_name = 'gambar_usg';
```

**Expected Result:**
```
           table_name           | column_name | data_type
─────────────────────────────────────────────────────────
 pemeriksaan_dokter_trimester_1 | gambar_usg  | text
 pemeriksaan_dokter_trimester_3 | gambar_usg  | text
(2 rows)
```

### 2. Check Foreign Key Constraints (CASCADE)

```sql
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name
FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('catatan_pelayanan_trimester_1', 'catatan_pelayanan_trimester_3')
  AND kcu.column_name = 'kehamilan_id'
ORDER BY tc.table_name;
```

**Expected Result:**
```
                 constraint_name                 |          table_name          | column_name
────────────────────────────────────────────────────────────────────────────────
 catatan_pelayanan_trimester_1_kehamilan_id_fkey | catatan_pelayanan_trimester_1 | kehamilan_id
 catatan_pelayanan_trimester_3_kehamilan_id_fkey | catatan_pelayanan_trimester_3 | kehamilan_id
(2 rows)
```

---

## 🐛 TROUBLESHOOTING

### Error: "column already exists"

```
ERROR: column "gambar_usg" of relation "pemeriksaan_dokter_trimester_1" already exists
```

**Solusi:** Kolom sudah ada. Ini adalah idempotent migration (aman dijalankan berkali-kali). Lanjut ke langkah verifikasi.

---

### Error: "does not exist" (foreign key)

```
ERROR: constraint "catatan_pelayanan_trimester_1_kehamilan_id_fkey" does not exist
```

**Solusi:** Constraint nama berbeda. Cari nama constraint yang benar:

```sql
-- Cari nama constraint yang ada
SELECT constraint_name 
FROM information_schema.table_constraints
WHERE table_name = 'catatan_pelayanan_trimester_1' 
  AND constraint_type = 'FOREIGN KEY';
```

Kemudian drop dengan nama yang benar.

---

### Error: "password authentication failed"

```
ERROR: role "your_user" does not exist
```

**Solusi:** Cek credentials:
- Pastikan username/password benar
- Pastikan user memiliki permission untuk alter tables
- Hubungi DBA jika perlu akses

---

### Error: "relation does not exist"

```
ERROR: relation "pemeriksaan_dokter_trimester_1" does not exist
```

**Solusi:** 
- Pastikan database yang benar terpilih
- Pastikan schema adalah `public` (atau schema yang benar)
- Check apakah table sudah ada: `SELECT * FROM information_schema.tables WHERE table_name LIKE '%trimester%';`

---

## 🔄 ROLLBACK PROCEDURE

Jika migration gagal dan Anda perlu rollback:

```sql
-- Rollback: Drop gambar_usg columns
ALTER TABLE pemeriksaan_dokter_trimester_1
DROP COLUMN IF EXISTS gambar_usg;

ALTER TABLE pemeriksaan_dokter_trimester_3
DROP COLUMN IF EXISTS gambar_usg;

-- Rollback: Restore old foreign key constraints (tanpa CASCADE)
-- Note: Anda perlu tahu constraint name lama. Biasanya:
ALTER TABLE catatan_pelayanan_trimester_1
DROP CONSTRAINT IF EXISTS catatan_pelayanan_trimester_1_kehamilan_id_fkey;

ALTER TABLE catatan_pelayanan_trimester_1
ADD CONSTRAINT catatan_pelayanan_trimester_1_kehamilan_id_fkey
FOREIGN KEY (kehamilan_id) REFERENCES kehamilan(id);

-- Similar untuk trimester_3...
```

---

## 📝 MIGRATION QUERIES DETAIL

### Query 1: Add gambar_usg to Trimester 1
```sql
ALTER TABLE pemeriksaan_dokter_trimester_1
ADD COLUMN IF NOT EXISTS gambar_usg TEXT NULL;
```

**What it does:** 
- Tambah kolom baru `gambar_usg` untuk menyimpan Base64 image
- Tipe: `TEXT` (PostgreSQL, unlimited size)
- `IF NOT EXISTS`: Aman dijalankan berkali-kali
- `NULL`: Kolom opsional (existing rows tetap kosong)

---

### Query 2: Add gambar_usg to Trimester 3
```sql
ALTER TABLE pemeriksaan_dokter_trimester_3
ADD COLUMN IF NOT EXISTS gambar_usg TEXT NULL;
```

Same as Query 1, untuk Trimester 3.

---

### Query 3: Update Catatan Trimester 1 Constraint
```sql
ALTER TABLE catatan_pelayanan_trimester_1
DROP CONSTRAINT IF EXISTS catatan_pelayanan_trimester_1_kehamilan_id_fkey;

ALTER TABLE catatan_pelayanan_trimester_1
ADD CONSTRAINT catatan_pelayanan_trimester_1_kehamilan_id_fkey
FOREIGN KEY (kehamilan_id) REFERENCES kehamilan(id) ON DELETE CASCADE;
```

**What it does:**
- Drop existing constraint (jika ada)
- Create new constraint dengan `ON DELETE CASCADE`
- Sekarang saat Kehamilan dihapus → Catatan otomatis terhapus

---

### Query 4: Update Catatan Trimester 3 Constraint
Same as Query 3, untuk Trimester 3.

---

## ✨ NEXT STEPS (Setelah Migration Selesai)

1. ✅ **Verifikasi migration** - jalankan query di atas
2. 🔄 **Restart Go application** - agar membaca schema terbaru
3. 🧪 **Test API** - coba save data dengan gambar
4. 📝 **Update frontend** - pastikan mengirim gambar_usg field
5. 🚀 **Production deployment** - deploy ke prod setelah testing

---

## 🆘 BUTUH BANTUAN?

**Jika migration gagal:**
1. Catat error message lengkap
2. Cek di Troubleshooting section di atas
3. Verifikasi database credentials
4. Hubungi database administrator

**Jika masih error:**
1. Cek file: `sql/migration_trimester_improvements_postgresql.sql`
2. Run query satu per satu untuk isolate mana yang error
3. Cek permission user database
4. Cek schema name yang benar

---

## 📊 SUMMARY

| Step | Action | Status |
|------|--------|--------|
| 1 | Backup database | ⏳ Pending |
| 2 | Run migration | ⏳ Pending |
| 3 | Verify columns | ⏳ Pending |
| 4 | Verify constraints | ⏳ Pending |
| 5 | Restart app | ⏳ Pending |
| 6 | Test API | ⏳ Pending |

---

**Status:** Ready to execute  
**Risk Level:** Low (idempotent, safe to rerun)  
**Backup Required:** Yes  
**Downtime Required:** None (online schema changes)

