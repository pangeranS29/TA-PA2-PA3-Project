# ⚡ TLDR - Database Migration Quick Summary

**Problem:** `ERROR: column "gambar_usg" does not exist`  
**Cause:** Database migration not executed  
**Solution:** Run migration SQL  
**Time:** 5 minutes

---

## 🎯 DO THIS NOW (Choose 1)

### Option A: GUI (EASIEST) ⭐
1. Open pgAdmin or DBeaver
2. Connect to database
3. Copy this SQL:

```sql
ALTER TABLE pemeriksaan_dokter_trimester_1 ADD COLUMN IF NOT EXISTS gambar_usg TEXT NULL;
ALTER TABLE pemeriksaan_dokter_trimester_3 ADD COLUMN IF NOT EXISTS gambar_usg TEXT NULL;
ALTER TABLE catatan_pelayanan_trimester_1 DROP CONSTRAINT IF EXISTS catatan_pelayanan_trimester_1_kehamilan_id_fkey;
ALTER TABLE catatan_pelayanan_trimester_1 ADD CONSTRAINT catatan_pelayanan_trimester_1_kehamilan_id_fkey FOREIGN KEY (kehamilan_id) REFERENCES kehamilan(id) ON DELETE CASCADE;
ALTER TABLE catatan_pelayanan_trimester_3 DROP CONSTRAINT IF EXISTS catatan_pelayanan_trimester_3_kehamilan_id_fkey;
ALTER TABLE catatan_pelayanan_trimester_3 ADD CONSTRAINT catatan_pelayanan_trimester_3_kehamilan_id_fkey FOREIGN KEY (kehamilan_id) REFERENCES kehamilan(id) ON DELETE CASCADE;
```

4. Click Execute ▶️
5. Done! ✅

---

### Option B: PowerShell (Windows)
```powershell
cd c:\Users\samue\Documents\GitHub\TA-PA2-PA3-Project\backend\monolith\go-template-main
$env:DB_POSTGRES_USER = "user"
$env:DB_POSTGRES_PASSWORD = "password"
$env:DB_POSTGRES_HOST = "localhost"
$env:DB_POSTGRES_PORT = "5432"
$env:DB_POSTGRES_NAME = "database"
.\sql\run_migration.ps1
```

---

### Option C: Bash (Linux/Mac)
```bash
cd backend/monolith/go-template-main
export DB_POSTGRES_USER="user"
export DB_POSTGRES_PASSWORD="password"
export DB_POSTGRES_HOST="localhost"
export DB_POSTGRES_PORT="5432"
export DB_POSTGRES_NAME="database"
./sql/run_migration.sh
```

---

## ✅ VERIFY SUCCESS

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name='pemeriksaan_dokter_trimester_1' AND column_name='gambar_usg';
```

Should return: `gambar_usg` ✅

---

## 🚀 THEN RESTART APP

```
Restart your Go application
```

Done! Now you can save images. 🎉

---

## 📚 DETAILS

- Full guide: `MIGRATION_INSTRUCTIONS.md`
- Quick guide: `QUICK_FIX_GAMBAR_USG.md`
- Error analysis: `ERROR_ANALYSIS_AND_SOLUTION.md`

---

**Time to fix:** 5 minutes
