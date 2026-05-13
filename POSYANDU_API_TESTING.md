# 📋 API Testing - Posyandu Management Endpoints

## Overview
Dokumentasi lengkap untuk testing semua endpoint Posyandu. Endpoint ini hanya bisa diakses oleh user dengan role **Bidan** yang sudah login.

---

## 🔐 Authentication
Semua endpoint memerlukan JWT token di header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📝 Endpoints

### 1. CREATE POSYANDU
**Endpoint:** `POST /bidan/posyandu`

**Description:** Bidan membuat posyandu baru

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "id_puskesmas": 1,
  "nama": "Posyandu Sejahtera",
  "alamat": "Jl. Kesehatan No. 1, Desa Sentosa, Kecamatan Maju"
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "status": "created"
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "id_puskesmas wajib diisi"
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "nama posyandu wajib diisi"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/bidan/posyandu \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "id_puskesmas": 1,
    "nama": "Posyandu Sejahtera",
    "alamat": "Jl. Kesehatan No. 1, Desa Sentosa"
  }'
```

---

### 2. LIST POSYANDU
**Endpoint:** `GET /bidan/posyandu?search=<keyword>`

**Description:** Bidan melihat list semua posyandu (optional filter by search)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Filter berdasarkan nama atau alamat posyandu |

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "id_puskesmas": 1,
      "nama": "Posyandu Sejahtera",
      "alamat": "Jl. Kesehatan No. 1, Desa Sentosa",
      "created_at": "2026-05-11T10:30:00Z"
    },
    {
      "id": 2,
      "id_puskesmas": 1,
      "nama": "Posyandu Maju",
      "alamat": "Jl. Raya No. 5, Desa Maju",
      "created_at": "2026-05-11T11:00:00Z"
    }
  ]
}
```

**cURL Example (Without Filter):**
```bash
curl -X GET http://localhost:8080/bidan/posyandu \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**cURL Example (With Filter):**
```bash
curl -X GET "http://localhost:8080/bidan/posyandu?search=Sejahtera" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. GET POSYANDU DETAIL
**Endpoint:** `GET /bidan/posyandu/:id`

**Description:** Bidan melihat detail posyandu berdasarkan ID

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | ID Posyandu |

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "id_puskesmas": 1,
    "nama": "Posyandu Sejahtera",
    "alamat": "Jl. Kesehatan No. 1, Desa Sentosa",
    "created_at": "2026-05-11T10:30:00Z",
    "updated_at": "2026-05-11T10:30:00Z",
    "deleted_at": null
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "id tidak valid"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "posyandu tidak ditemukan"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/bidan/posyandu/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 4. UPDATE POSYANDU
**Endpoint:** `PUT /bidan/posyandu/:id`

**Description:** Bidan update data posyandu

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | ID Posyandu |

**Request Body:**
```json
{
  "nama": "Posyandu Sejahtera Jaya",
  "alamat": "Jl. Kesehatan No. 1, Desa Sentosa, Kecamatan Maju Jaya"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "id_puskesmas": 1,
    "nama": "Posyandu Sejahtera Jaya",
    "alamat": "Jl. Kesehatan No. 1, Desa Sentosa, Kecamatan Maju Jaya",
    "created_at": "2026-05-11T10:30:00Z",
    "updated_at": "2026-05-11T14:45:00Z",
    "deleted_at": null
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "format request tidak valid"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "posyandu tidak ditemukan"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8080/bidan/posyandu/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "nama": "Posyandu Sejahtera Jaya",
    "alamat": "Jl. Kesehatan No. 1, Desa Sentosa, Kecamatan Maju Jaya"
  }'
```

---

## 🧪 Testing Flow

### Scenario 1: Create dan List Posyandu
```
1. Login terlebih dahulu → Dapatkan JWT Token
   POST /auth/login

2. Create Posyandu baru dengan id_puskesmas
   POST /bidan/posyandu
   
3. List semua posyandu
   GET /bidan/posyandu
   
4. Verify posyandu berhasil dibuat
```

### Scenario 2: Get Detail dan Update
```
1. Get detail posyandu by ID
   GET /bidan/posyandu/1
   
2. Update posyandu data
   PUT /bidan/posyandu/1
   
3. Get detail lagi untuk verify update
   GET /bidan/posyandu/1
```

### Scenario 3: Search Posyandu
```
1. Create beberapa posyandu dengan nama berbeda
   POST /bidan/posyandu (3x dengan nama berbeda)
   
2. List dengan search filter
   GET /bidan/posyandu?search=kata_kunci
   
3. Verify hasil filter sesuai keyword
```

---

## ✅ Testing Checklist

### Create Posyandu
- [ ] Test dengan `id_puskesmas` valid
- [ ] Test tanpa `id_puskesmas` (expect error 400)
- [ ] Test dengan `nama` kosong (expect error 400)
- [ ] Test dengan `alamat` kosong (should be allowed, optional)
- [ ] Verify response status 201

### List Posyandu
- [ ] Test list tanpa filter (return all)
- [ ] Test list dengan search filter valid
- [ ] Test list dengan search filter tidak cocok (empty result)
- [ ] Verify response includes id, nama, alamat, created_at
- [ ] Verify response status 200

### Get Detail
- [ ] Test dengan ID valid
- [ ] Test dengan ID tidak valid (expect error 404)
- [ ] Test dengan ID format invalid (expect error 400)
- [ ] Verify response includes semua field posyandu
- [ ] Verify response status 200

### Update Posyandu
- [ ] Test update nama saja
- [ ] Test update alamat saja
- [ ] Test update keduanya
- [ ] Test update dengan ID tidak valid (expect error 404)
- [ ] Test update dengan nama kosong (expect minimal requirement)
- [ ] Verify updated_at berubah
- [ ] Verify response status 200

---

## 📊 Database Requirement

**Pastikan tabel sudah di-create:**
```sql
CREATE TABLE IF NOT EXISTS posyandu (
  id BIGSERIAL PRIMARY KEY,
  id_puskesmas BIGINT NOT NULL,
  nama VARCHAR(255) NOT NULL,
  alamat TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE posyandu
  ADD CONSTRAINT fk_posyandu_id_puskesmas
  FOREIGN KEY (id_puskesmas)
  REFERENCES puskesmas(id)
  ON UPDATE CASCADE
  ON DELETE RESTRICT;
```

---

## 🔗 Related Endpoints

Setelah posyandu berhasil dibuat, Anda bisa:
- **Create Kader** yang terikat ke Posyandu: `POST /bidan/kader`
- **Create Bidan** tambahan: `POST /bidan`
- **List Kader** di Posyandu: `GET /bidan/kader?posyandu_id=1`

---

## 📞 Support

Jika ada pertanyaan atau issue, silakan check:
- [API Documentation](../API_SPEC_TRIMESTER_UPDATED.md)
- [Migration SQL](../sql/migration_puskesmas_posyandu.sql)
- [Model Definition](../app/models/posyandu.go)
- [Usecase](../app/usecases/admin_tenaga_kesehatan_usecase.go)
