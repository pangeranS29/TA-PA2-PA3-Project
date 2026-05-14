# ✅ DEPLOYMENT CHECKLIST - Trimester 1 & 3 Improvements

**Status:** Ready for Production  
**Date:** 2026-05-06  
**Version:** 2.0

---

## 🔄 PRE-DEPLOYMENT

### Code Review
- [x] Models updated dengan cascade delete & gambar_usg
- [x] Usecase updated dengan auto-set tanggal & hapus redundan
- [x] No breaking changes untuk existing endpoints
- [x] Database migration prepared

### Testing Locally
- [ ] Compile code (go build)
- [ ] Run unit tests
- [ ] Test API endpoints dengan Postman/cURL
- [ ] Verify database constraints

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Backup Database
```bash
# Backup sebelum migration
mysqldump -u [user] -p [database] > backup_$(date +%Y%m%d_%H%M%S).sql
```
**Checklist:**
- [ ] Backup file created
- [ ] Backup file size reasonable
- [ ] Backup verified (restore test)

---

### Step 2: Run Migration
```bash
# Option A: Direct MySQL
mysql -u [user] -p [database] < sql/migration_trimester_improvements.sql

# Option B: Using migration tool
./migrate up

# Option C: Manual execution
# Copy-paste setiap query dari migration file
```

**Verify Migration:**
```sql
-- Cek field gambar_usg exists
SHOW COLUMNS FROM pemeriksaan_dokter_trimester_1 LIKE 'gambar_usg';
SHOW COLUMNS FROM pemeriksaan_dokter_trimester_3 LIKE 'gambar_usg';

-- Cek foreign key with CASCADE
SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, DELETE_RULE
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc 
ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('catatan_pelayanan_trimester_1', 'catatan_pelayanan_trimester_3');
```

**Checklist:**
- [ ] Migration executed without error
- [ ] gambar_usg column exists
- [ ] Foreign key constraints verified
- [ ] No data loss

---

### Step 3: Deploy Code
```bash
# Build aplikasi
go build -o monitoring-service ./cmd/main.go

# Stop current service
systemctl stop monitoring-service  # atau sesuai setup

# Copy binary
cp monitoring-service /app/monitoring-service

# Start service
systemctl start monitoring-service
```

**Checklist:**
- [ ] Code compiled successfully
- [ ] No Go compilation errors
- [ ] Service started successfully
- [ ] No startup errors in logs

---

### Step 4: Verify Services
```bash
# Check service status
systemctl status monitoring-service

# Check logs
tail -f /var/log/monitoring-service.log

# Test health endpoint
curl http://localhost:8080/health
```

**Checklist:**
- [ ] Service running
- [ ] Logs clean (no errors)
- [ ] Health endpoint returning OK

---

### Step 5: Test API Endpoints
```bash
# Test POST Trimester 1
curl -X POST http://localhost:8080/api/pemeriksaan-trimester-1 \
  -H "Content-Type: application/json" \
  -d '{
    "kehamilan_id": 1,
    "nama_dokter": "Dr. Test",
    "gambar_usg": "data:image/jpeg;base64,iVBORw0KG...",
    "konsep_anamnesa_pemeriksaan": "Test",
    "fisik_konjungtiva": "normal",
    "fisik_sklera": "normal",
    "fisik_kulit": "normal",
    "fisik_leher": "normal",
    "fisik_gigi_mulut": "normal",
    "fisik_tht": "normal",
    "fisik_dada_jantung": "normal",
    "fisik_dada_paru": "normal",
    "fisik_perut": "normal",
    "fisik_tungkai": "normal",
    "hpht": "2025-10-06",
    "keteraturan_haid": "teratur"
  }'

# Expected: 201 Created dengan tanggal_periksa auto-filled

# Test GET
curl http://localhost:8080/api/pemeriksaan-trimester-1/1

# Expected: 200 OK dengan gambar_usg tersimpan

# Test DELETE (cascade)
curl -X DELETE http://localhost:8080/api/pemeriksaan-trimester-1/1

# Expected: 200 OK, catatan otomatis terhapus
```

**Checklist:**
- [ ] POST returns 201, tanggal auto-filled
- [ ] GET returns 200, gambar tersimpan
- [ ] DELETE returns 200, cascade working
- [ ] Error handling proper (4xx, 5xx)

---

## 📝 POST-DEPLOYMENT

### Monitoring
```bash
# Monitor error rate
# Check untuk pattern: "ERROR", "FATAL"
tail -f /var/log/monitoring-service.log | grep -i error

# Monitor performance
# Jika ada slow query, optimize indexes

# Check database size
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size in MB'
FROM information_schema.tables
WHERE table_schema = 'monitoring_db'
ORDER BY (data_length + index_length) DESC;
```

**Checklist:**
- [ ] Error logs checked
- [ ] No spike in errors
- [ ] Database size reasonable
- [ ] Performance metrics normal

---

### Frontend Updates
**Notify Frontend team:**
- [ ] API spec updated (API_SPEC_TRIMESTER_UPDATED.md)
- [ ] Remove field inputs: `tanggal_periksa`, `tanggal_lab`, `hpl_*`
- [ ] Add field input: `gambar_usg` (file upload → Base64)
- [ ] Update detail view: show `gambar_usg` image
- [ ] Update forms to remove redundant date fields

**Checklist:**
- [ ] Frontend team notified
- [ ] API integration updated
- [ ] UI forms updated
- [ ] Image display implemented

---

### Documentation Updates
- [ ] Update API documentation
- [ ] Update database schema documentation
- [ ] Update deployment guide
- [ ] Add release notes

**Checklist:**
- [ ] All docs updated
- [ ] Release notes published
- [ ] Team trained

---

## 🆘 ROLLBACK PLAN

**Jika ada issue, rollback dengan:**

```bash
# 1. Stop service
systemctl stop monitoring-service

# 2. Restore database
mysql -u [user] -p [database] < backup_20260506_HHMMSS.sql

# 3. Restore old code
git checkout HEAD~1  # atau deploy old binary

# 4. Start service
systemctl start monitoring-service

# 5. Verify
curl http://localhost:8080/health
```

**Rollback Steps:**
- [ ] Stop service
- [ ] Restore database from backup
- [ ] Deploy previous code version
- [ ] Start service
- [ ] Verify health
- [ ] Test critical endpoints

---

## 📊 METRICS TO MONITOR

| Metric | Target | Alert |
|--------|--------|-------|
| API Response Time | < 200ms | > 500ms |
| Error Rate | < 0.1% | > 1% |
| Database Connections | < 50 | > 80 |
| Disk Space | > 20% free | < 10% free |
| CPU Usage | < 70% | > 90% |
| Memory Usage | < 80% | > 95% |

---

## ✅ FINAL VERIFICATION

Before mark as DONE:

```bash
# 1. Check all services running
ps aux | grep monitoring-service

# 2. Test all Trimester 1 endpoints
./test_trimester1_endpoints.sh

# 3. Test all Trimester 3 endpoints
./test_trimester3_endpoints.sh

# 4. Check database integrity
./check_database_integrity.sh

# 5. Load test
./load_test.sh --duration 5m --concurrency 100
```

**Final Checklist:**
- [ ] All services running
- [ ] All endpoints tested ✅
- [ ] Database integrity OK
- [ ] Load test passed
- [ ] No errors in logs
- [ ] Documentation complete
- [ ] Team trained
- [ ] Monitoring configured

---

## 📞 SUPPORT & ESCALATION

**If issues occur:**

1. **First 15 min:** Check logs, restart service
2. **15-30 min:** Check database, verify migration
3. **30+ min:** Prepare rollback, contact team lead
4. **Critical:** Execute rollback plan, investigate post-deployment

**Contact:**
- Backend Team Lead: [contact]
- Database Admin: [contact]
- DevOps: [contact]

---

## 📅 DEPLOYMENT TIMELINE

**Estimated Duration:** 30 minutes

| Task | Duration | Cumulative |
|------|----------|-----------|
| Backup | 2 min | 2 min |
| Migration | 2 min | 4 min |
| Deploy Code | 3 min | 7 min |
| Service Start | 2 min | 9 min |
| API Tests | 10 min | 19 min |
| Monitoring Setup | 3 min | 22 min |
| Documentation | 5 min | 27 min |
| **TOTAL** | | **~30 min** |

---

## 🎯 SUCCESS CRITERIA

✅ Deployment dianggap sukses jika:
1. Service berjalan tanpa error
2. Semua API endpoint berfungsi normal
3. Database migration completed successfully
4. Cascade delete working as expected
5. Gambar USG tersimpan dan retrievable
6. Tanggal auto-set berfungsi
7. Zero data loss
8. Frontend dapat integrasi dengan API baru

---

**Status: ✅ READY FOR PRODUCTION**

Deployment dapat dilakukan kapan saja. Tim sudah siap.

---

**Sign-off:**
- [ ] Backend Lead Approved
- [ ] DBA Approved
- [ ] DevOps Approved
- [ ] Product Owner Approved

**Deployment Date:** _____________  
**Deployed By:** ________________  
**Verified By:** _________________

