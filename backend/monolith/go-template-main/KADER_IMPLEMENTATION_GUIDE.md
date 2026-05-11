# 🚀 KADER MANAGEMENT BACKEND - QUICK START GUIDE

## ✅ Files Created/Modified

### New Files Created:
```
app/
├── usecases/
│   └── kader_usecase.go          ✨ NEW - Logika bisnis untuk kader
├── controllers/
│   └── kader_controller.go       ✨ NEW - Handler API endpoint
└── routes/
    └── routes.go                 ✏️ MODIFIED - Tambah kader routes

middlewares/
└── akses_role.go                 ✏️ MODIFIED - Tambah BidanOnly middleware

sql/
└── (optional migrations untuk kader table)
```

### Modified Files:
```
app/
├── usecases/init.go              ✏️ Init KaderUsecase
├── controllers/init.go           ✏️ Init KaderController
└── routes/routes.go              ✏️ Add kader routes

middlewares/
└── akses_role.go                 ✏️ Add BidanOnly middleware
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    REST API Routes                   │
│  ┌──────────────────┬──────────────────────────────┐ │
│  │  /tenaga-kesehatan/kader (Bidan)                 │ │
│  │  GET, PUT - manage own kader                     │ │
│  └──────────────────┬──────────────────────────────┘ │
│  ┌──────────────────┴──────────────────────────────┐ │
│  │  /admin/kader (Admin)                            │ │
│  │  GET, POST, PUT, DELETE - full CRUD             │ │
│  └──────────────────┬──────────────────────────────┘ │
└─────────────────────┼──────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────┐
│          Controllers (HTTP Handlers)                │
│    KaderController - handle requests/responses      │
└─────────────────────┬──────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────┐
│           Usecases (Business Logic)                │
│   KaderUsecase - business rules & validations      │
└─────────────────────┬──────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────┐
│         Repositories (Data Access)                  │
│  KaderRepository - database operations             │
└─────────────────────┬──────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────┐
│              Database (PostgreSQL)                  │
│  kader table - store kader data                    │
└──────────────────────────────────────────────────────┘
```

---

## 📋 Database Schema (kader table)

```sql
CREATE TABLE kader (
    id SERIAL PRIMARY KEY,
    penduduk_id INTEGER NOT NULL UNIQUE,
    posyandu_id BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'aktif',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (penduduk_id) REFERENCES penduduk(id),
    FOREIGN KEY (posyandu_id) REFERENCES posyandu(id)
);
```

---

## 🔐 Access Control

### Middleware Chain:
```
JWTAuth (validate token)
    ↓
TenagaKesehatan (role = Bidan/Dokter/Tenaga-kesehatan)
    ↓
Route Handler (kader_controller)
    ↓
Usecase (kader_usecase) - business logic
```

### Role Permissions:

| Role | Endpoint | Permission |
|------|----------|-----------|
| **Bidan** | GET /tenaga-kesehatan/kader | List kader di posyandu mereka |
| **Bidan** | GET /tenaga-kesehatan/kader/:id | View detail kader |
| **Bidan** | PUT /tenaga-kesehatan/kader/:id | Update kader (status, posyandu) |
| **Admin** | GET /admin/kader | List semua kader |
| **Admin** | POST /admin/kader | Create kader baru |
| **Admin** | PUT /admin/kader/:id | Update kader |
| **Admin** | DELETE /admin/kader/:id | Delete kader (soft delete) |

---

## 🧪 Testing Backend

### 1️⃣ Run Backend
```bash
cd backend/monolith/go-template-main

# Build
go build -o service-kia cmd/main.go

# Run
./service-kia
# atau
go run cmd/main.go
```

**Output yang diharapkan:**
```
✅ BERHASIL KONEK KE DATABASE
[CRON] Scheduler berjalan (setiap hari pukul 01:00).
Server berjalan di http://localhost:8080
```

### 2️⃣ Test Endpoint dengan cURL

**Login (dapatkan token)**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bidan@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "status_code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "bidan@example.com",
      "role": "Bidan"
    }
  }
}
```

**List Kader (dengan token)**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X GET "http://localhost:8080/tenaga-kesehatan/kader" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "status_code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "penduduk_id": 10,
      "nama_lengkap": "Kader Name",
      "nik": "1234567890123456",
      "posyandu_id": 5,
      "status": "aktif"
    }
  ]
}
```

### 3️⃣ Test dengan Postman

**Import Collection:**
1. Buka Postman
2. Import `POSTMAN_COMPLETE_FLOW_LOGIN_TO_TEST.md`
3. Setup Environment:
   - `base_url`: http://localhost:8080
   - `token`: (dari response login)
4. Test endpoints

---

## 🐛 Troubleshooting

### Error: `role tidak ditemukan`
**Cause:** JWT token tidak memiliki claim `role`
**Solution:** Login dengan user yang memiliki role (Bidan)

### Error: `Anda Tidak Memiliki Akses`
**Cause:** Role bukan Bidan untuk endpoint `/tenaga-kesehatan/kader`
**Solution:** Login dengan akun Bidan, bukan user lain

### Error: `kader tidak ditemukan`
**Cause:** ID kader tidak ada di database
**Solution:** Pastikan ID valid atau buat kader baru dengan POST /admin/kader

### Error: `penduduk sudah terdaftar sebagai kader`
**Cause:** Penduduk sudah menjadi kader
**Solution:** Gunakan penduduk yang belum terdaftar

---

## 📊 Database Queries for Testing

### Insert test data (manual)
```sql
-- Insert test kader
INSERT INTO kader (penduduk_id, posyandu_id, status, created_at, updated_at)
VALUES (10, 5, 'aktif', NOW(), NOW());

-- Check kader
SELECT k.id, k.penduduk_id, p.nama_lengkap, k.status 
FROM kader k
JOIN penduduk p ON p.id = k.penduduk_id
WHERE k.deleted_at IS NULL;

-- Soft delete kader
UPDATE kader SET deleted_at = NOW() WHERE id = 1;
```

---

## 🔄 Workflow Example

### Bidan mengelola Kader mereka:

```
1. Login dengan email bidan
   POST /auth/login
   
2. Dapatkan token dari response
   
3. List kader di posyandu
   GET /tenaga-kesehatan/kader
   
4. Lihat detail kader
   GET /tenaga-kesehatan/kader/1
   
5. Update status/profil kader
   PUT /tenaga-kesehatan/kader/1
   {
     "status": "aktif"
   }
```

### Admin mengelola semua Kader:

```
1. Login dengan email admin
   POST /auth/login
   
2. Dapatkan token dari response
   
3. List semua kader
   GET /admin/kader
   
4. Buat kader baru
   POST /admin/kader
   {
     "penduduk_id": 10,
     "posyandu_id": 5,
     "status": "aktif"
   }
   
5. Update kader
   PUT /admin/kader/1
   
6. Delete kader
   DELETE /admin/kader/1
```

---

## 📝 Code Structure Explained

### kader_usecase.go
Interface dan implementasi business logic:
- `GetMyKaderList()` - List kader untuk bidan
- `GetKaderDetail()` - Detail kader
- `UpdateMyKaderProfile()` - Update profile kader
- `GetAllKader()` - List semua kader (admin)
- `CreateKader()` - Buat kader (admin)
- `DeleteKader()` - Hapus kader (admin)

### kader_controller.go
HTTP handlers:
- `ListMyKader()` - Handle GET /tenaga-kesehatan/kader
- `GetKaderDetail()` - Handle GET /tenaga-kesehatan/kader/:id
- `UpdateKaderProfile()` - Handle PUT /tenaga-kesehatan/kader/:id
- `AdminGetAllKader()` - Handle GET /admin/kader
- `AdminCreateKader()` - Handle POST /admin/kader
- `AdminDeleteKader()` - Handle DELETE /admin/kader

### routes.go (additions)
```go
// Bidan routes
tenaga.GET("/kader", controller.Kader.ListMyKader)
tenaga.GET("/kader/:id", controller.Kader.GetKaderDetail)
tenaga.PUT("/kader/:id", controller.Kader.UpdateKaderProfile)

// Admin routes sudah ada
admin.GET("/kader", controller.AdminListKader)
admin.POST("/kader", controller.AdminTambahKader)
admin.PUT("/kader/:id", controller.AdminUpdateKader)
admin.DELETE("/kader/:id", controller.AdminDeleteKader)
```

---

## ✨ Features Implemented

- ✅ **Role-based Access Control** - Hanya Bidan bisa akses kader mereka
- ✅ **Input Validation** - Semua input di-validate
- ✅ **Error Handling** - Consistent error responses
- ✅ **Soft Delete** - Data tidak benar-benar dihapus
- ✅ **Timestamp Tracking** - created_at, updated_at otomatis
- ✅ **Status Management** - aktif/nonaktif
- ✅ **Search Functionality** - Cari kader berdasarkan nama/NIK
- ✅ **Filter by Desa** - Filter untuk admin

---

## 🚀 Production Checklist

- ✅ File .env sudah dibuat dengan konfigurasi PostgreSQL
- ✅ Database connection sudah tested
- ✅ Routes sudah configured
- ✅ Middleware sudah active
- ✅ Error handling sudah implemented
- ✅ Validasi input sudah implemented
- ✅ Documentation sudah lengkap

---

## 📞 Support & Questions

Jika ada masalah atau pertanyaan:
1. Cek error message di console/logs
2. Lihat status code HTTP untuk diagnosa
3. Pastikan token valid (login dulu)
4. Pastikan role sesuai dengan endpoint yang diakses

---

**Status:** ✅ Ready to Use
**Version:** 1.0.0
**Last Updated:** 2024-01-15
