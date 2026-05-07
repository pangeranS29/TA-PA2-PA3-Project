# ⚡ QUICK FIX - ERROR: gambar_usg column does not exist

**Status:** Perlu action dari Anda  
**Time to Fix:** 5-10 menit  

---

## 🚨 MASALAH

Anda mendapat error:
```
ERROR: column "gambar_usg" of relation "pemeriksaan_dokter_trimester_1" does not exist (SQLSTATE 42703)
```

**Penyebab:** Database belum punya kolom `gambar_usg`

---

## ✅ SOLUSI CEPAT (Pick One)

### Opsi A: Jalankan Query Manual di pgAdmin/DBeaver (PALING MUDAH)

**Langkah:**
1. Buka pgAdmin atau DBeaver
2. Connect ke database Anda
3. Copy & paste query ini:

```sql
-- Tambah kolom gambar_usg ke trimester 1 & 3
ALTER TABLE pemeriksaan_dokter_trimester_1 ADD COLUMN IF NOT EXISTS gambar_usg TEXT NULL;
ALTER TABLE pemeriksaan_dokter_trimester_3 ADD COLUMN IF NOT EXISTS gambar_usg TEXT NULL;

-- Update foreign key dengan CASCADE DELETE
ALTER TABLE catatan_pelayanan_trimester_1
DROP CONSTRAINT IF EXISTS catatan_pelayanan_trimester_1_kehamilan_id_fkey;
ALTER TABLE catatan_pelayanan_trimester_1
ADD CONSTRAINT catatan_pelayanan_trimester_1_kehamilan_id_fkey
FOREIGN KEY (kehamilan_id) REFERENCES kehamilan(id) ON DELETE CASCADE;

ALTER TABLE catatan_pelayanan_trimester_3
DROP CONSTRAINT IF EXISTS catatan_pelayanan_trimester_3_kehamilan_id_fkey;
ALTER TABLE catatan_pelayanan_trimester_3
ADD CONSTRAINT catatan_pelayanan_trimester_3_kehamilan_id_fkey
FOREIGN KEY (kehamilan_id) REFERENCES kehamilan(id) ON DELETE CASCADE;
```

4. Click **Execute** ▶️
5. Done! ✅

---

### Opsi B: Jalankan Script PowerShell (Windows)

**Langkah:**

1. Buka PowerShell sebagai Administrator
2. Goto project folder:
```powershell
cd c:\Users\samue\Documents\GitHub\TA-PA2-PA3-Project\backend\monolith\go-template-main
```

3. Set environment variables dengan database Anda:
```powershell
$env:DB_POSTGRES_USER = "username_anda"
$env:DB_POSTGRES_PASSWORD = "password_anda"
$env:DB_POSTGRES_HOST = "localhost"  # atau IP server
$env:DB_POSTGRES_PORT = "5432"
$env:DB_POSTGRES_NAME = "nama_database_anda"
```

4. Run script:
```powershell
.\sql\run_migration.ps1
```

5. Tunggu selesai ✅

---

### Opsi C: Jalankan via Terminal Linux/Mac

```bash
cd backend/monolith/go-template-main

export DB_POSTGRES_USER="username_anda"
export DB_POSTGRES_PASSWORD="password_anda"
export DB_POSTGRES_HOST="localhost"
export DB_POSTGRES_PORT="5432"
export DB_POSTGRES_NAME="nama_database_anda"

chmod +x sql/run_migration.sh
./sql/run_migration.sh
```

---

## ✨ VERIFIKASI BERHASIL

Setelah migration, jalankan query ini untuk check:

```sql
-- Verify kolom gambar_usg ada
SELECT table_name, column_name 
FROM information_schema.columns
WHERE column_name = 'gambar_usg'
  AND table_name IN ('pemeriksaan_dokter_trimester_1', 'pemeriksaan_dokter_trimester_3');
```

**Expected:**
```
           table_name           | column_name
─────────────────────────────────────────────
 pemeriksaan_dokter_trimester_1 | gambar_usg
 pemeriksaan_dokter_trimester_3 | gambar_usg
(2 rows)
```

Jika hasilnya begini, BERHASIL! ✅

---

## 🚀 SETELAH MIGRATION

1. **Restart Go application** ← PENTING!
2. **Test API** - coba save data dengan gambar
3. Selesai! 🎉

---

## 📁 FILES YANG SIAP

Untuk referensi lengkap, lihat:
- 📄 `MIGRATION_INSTRUCTIONS.md` - Instruksi detail
- 📁 `sql/migration_trimester_improvements_postgresql.sql` - SQL file
- 🔧 `sql/run_migration.ps1` - PowerShell script
- 🔧 `sql/run_migration.sh` - Bash script

---

## 🎯 DATABASE VARIABLES YANG ANDA BUTUH

Cari di:
- `.env` file
- Environment variables di system
- Docker Compose file
- Application configuration

Biasanya namanya:
- `DB_POSTGRES_USER`
- `DB_POSTGRES_PASSWORD`
- `DB_POSTGRES_HOST`
- `DB_POSTGRES_PORT`
- `DB_POSTGRES_NAME`

---

**NEXT:** Jalankan salah satu opsi di atas ⬆️

