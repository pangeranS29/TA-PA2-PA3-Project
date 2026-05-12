# 📋 API Testing - Bidan Module Complete Endpoints

## Overview
Dokumentasi lengkap untuk testing semua endpoint dalam Bidan Module. Endpoint ini hanya bisa diakses oleh user dengan role **Bidan** yang sudah login.

---

## 🔐 Authentication
Semua endpoint memerlukan JWT token di header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📑 Table of Contents
1. [Posyandu Management](#-posyandu-management)
2. [Bidan Management](#-bidan-management)
3. [Kader Management](#-kader-management)
4. [Testing Flow](#-testing-flow)
5. [Testing Checklist](#-testing-checklist)

---

# 🏥 POSYANDU MANAGEMENT

## 1.1 CREATE POSYANDU
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
  "alamat": "Jl. Kesehatan No. 1, Desa Sentosa"
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

**cURL:**
```bash
curl -X POST http://localhost:8080/bidan/posyandu \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "id_puskesmas": 1,
    "nama": "Posyandu Sejahtera",
    "alamat": "Jl. Kesehatan No. 1, Desa Sentosa"
  }'
```

---

## 1.2 LIST POSYANDU
**Endpoint:** `GET /bidan/posyandu?search=<keyword>`

**Description:** Bidan melihat list semua posyandu

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Filter berdasarkan nama atau alamat |

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
      "alamat": "Jl. Kesehatan No. 1",
      "created_at": "2026-05-11T10:30:00Z"
    }
  ]
}
```

**cURL:**
```bash
curl -X GET "http://localhost:8080/bidan/posyandu?search=Sejahtera" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 1.3 GET POSYANDU DETAIL
**Endpoint:** `GET /bidan/posyandu/:id`

**Description:** Bidan melihat detail posyandu berdasarkan ID

**Path Parameters:**
| Parameter | Type | Required |
|-----------|------|----------|
| id | integer | Yes |

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "id_puskesmas": 1,
    "nama": "Posyandu Sejahtera",
    "alamat": "Jl. Kesehatan No. 1",
    "created_at": "2026-05-11T10:30:00Z",
    "updated_at": "2026-05-11T10:30:00Z",
    "deleted_at": null
  }
}
```

**cURL:**
```bash
curl -X GET http://localhost:8080/bidan/posyandu/1 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 1.4 UPDATE POSYANDU
**Endpoint:** `PUT /bidan/posyandu/:id`

**Description:** Bidan update data posyandu

**Request Body:**
```json
{
  "nama": "Posyandu Sejahtera Jaya",
  "alamat": "Jl. Kesehatan No. 1, Desa Sentosa Jaya"
}
```

**Success Response (200):**l
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "id_puskesmas": 1,
    "nama": "Posyandu Sejahtera Jaya",
    "alamat": "Jl. Kesehatan No. 1, Desa Sentosa Jaya",
    "created_at": "2026-05-11T10:30:00Z",
    "updated_at": "2026-05-11T14:45:00Z",
    "deleted_at": null
  }
}
```

**cURL:**
```bash
curl -X PUT http://localhost:8080/bidan/posyandu/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "nama": "Posyandu Sejahtera Jaya",
    "alamat": "Jl. Kesehatan No. 1, Desa Sentosa Jaya"
  }'
```

---

# 👨‍⚕️ BIDAN MANAGEMENT

## 2.1 CREATE BIDAN
**Endpoint:** `POST /bidan`

**Description:** Bidan membuat bidan baru

**Request Body:**
```json
{
  "penduduk_id": 5,
  "no_str": "12345678",
  "no_sipb": "87654321",
  "status": "aktif",
  "email": "bidan@example.com"
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "id": 2,
    "penduduk_id": 5,
    "no_str": "12345678",
    "no_sipb": "87654321",
    "status": "aktif",
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
  "message": "penduduk_id wajib diisi"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8080/bidan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "penduduk_id": 5,
    "no_str": "12345678",
    "no_sipb": "87654321",
    "status": "aktif",
    "email": "bidan@example.com"
  }'
```

---

## 2.2 LIST BIDAN
**Endpoint:** `GET /bidan`

**Description:** Bidan melihat list semua bidan

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Filter berdasarkan nama/NIK |
| desa | string | No | Filter berdasarkan desa |

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "penduduk_id": 1,
      "no_str": "12345678",
      "no_sipb": "87654321",
      "status": "aktif",
      "created_at": "2026-05-11T10:30:00Z"
    },
    {
      "id": 2,
      "penduduk_id": 5,
      "no_str": "11111111",
      "no_sipb": "99999999",
      "status": "aktif",
      "created_at": "2026-05-11T11:00:00Z"
    }
  ]
}
```

**cURL:**
```bash
curl -X GET "http://localhost:8080/bidan?desa=Sentosa" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 2.3 GET BIDAN DETAIL
**Endpoint:** `GET /bidan/:id`

**Description:** Bidan melihat detail bidan berdasarkan ID

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "penduduk_id": 1,
    "no_str": "12345678",
    "no_sipb": "87654321",
    "status": "aktif",
    "created_at": "2026-05-11T10:30:00Z",
    "updated_at": "2026-05-11T10:30:00Z",
    "deleted_at": null
  }
}
```

**cURL:**
```bash
curl -X GET http://localhost:8080/bidan/1 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 2.4 UPDATE BIDAN
**Endpoint:** `PUT /bidan/:id`

**Description:** Bidan update data bidan

**Request Body:**
```json
{
  "no_str": "12345678",
  "no_sipb": "87654321",
  "status": "aktif"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "penduduk_id": 1,
    "no_str": "12345678",
    "no_sipb": "87654321",
    "status": "aktif",
    "created_at": "2026-05-11T10:30:00Z",
    "updated_at": "2026-05-11T14:45:00Z",
    "deleted_at": null
  }
}
```

**cURL:**
```bash
curl -X PUT http://localhost:8080/bidan/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "no_str": "12345678",
    "no_sipb": "87654321",
    "status": "aktif"
  }'
```

---

## 2.5 UPDATE BIDAN STATUS
**Endpoint:** `PATCH /bidan/:id/status`

**Description:** Bidan update status bidan (aktif/nonaktif)

**Request Body:**
```json
{
  "status": "nonaktif"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "Status berhasil diperbarui"
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "status harus aktif atau nonaktif"
}
```

**cURL:**
```bash
curl -X PATCH http://localhost:8080/bidan/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "status": "nonaktif"
  }'
```

---

# 👥 KADER MANAGEMENT

## 3.1 CREATE KADER
**Endpoint:** `POST /bidan/kader`

**Description:** Bidan membuat kader baru

**Request Body:**
```json
{
  "penduduk_id": 10,
  "posyandu_id": 1,
  "status": "aktif",
  "email": "kader@example.com"
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "id": 1,
    "penduduk_id": 10,
    "posyandu_id": 1,
    "status": "aktif",
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
  "message": "penduduk_id wajib diisi"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8080/bidan/kader \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "penduduk_id": 10,
    "posyandu_id": 1,
    "status": "aktif",
    "email": "kader@example.com"
  }'
```

---

## 3.2 LIST KADER
**Endpoint:** `GET /bidan/kader`

**Description:** Bidan melihat list semua kader

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Filter berdasarkan nama |
| desa | string | No | Filter berdasarkan desa |

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "penduduk_id": 10,
      "posyandu_id": 1,
      "status": "aktif",
      "created_at": "2026-05-11T10:30:00Z"
    },
    {
      "id": 2,
      "penduduk_id": 11,
      "posyandu_id": 1,
      "status": "aktif",
      "created_at": "2026-05-11T11:00:00Z"
    }
  ]
}
```

**cURL:**
```bash
curl -X GET "http://localhost:8080/bidan/kader?posyandu_id=1" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 3.3 GET KADER DETAIL
**Endpoint:** `GET /bidan/kader/:id`

**Description:** Bidan melihat detail kader berdasarkan ID

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "penduduk_id": 10,
    "posyandu_id": 1,
    "status": "aktif",
    "created_at": "2026-05-11T10:30:00Z",
    "updated_at": "2026-05-11T10:30:00Z",
    "deleted_at": null
  }
}
```

**cURL:**
```bash
curl -X GET http://localhost:8080/bidan/kader/1 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 3.4 UPDATE KADER
**Endpoint:** `PUT /bidan/kader/:id`

**Description:** Bidan update data kader

**Request Body:**
```json
{
  "posyandu_id": 2,
  "status": "aktif"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "penduduk_id": 10,
    "posyandu_id": 2,
    "status": "aktif",
    "created_at": "2026-05-11T10:30:00Z",
    "updated_at": "2026-05-11T14:45:00Z",
    "deleted_at": null
  }
}
```

**cURL:**
```bash
curl -X PUT http://localhost:8080/bidan/kader/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "posyandu_id": 2,
    "status": "aktif"
  }'
```

---

## 3.5 UPDATE KADER STATUS
**Endpoint:** `PATCH /bidan/kader/:id/status`

**Description:** Bidan update status kader (aktif/nonaktif)

**Request Body:**
```json
{
  "status": "nonaktif"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "message": "Status berhasil diperbarui"
  }
}
```

**cURL:**
```bash
curl -X PATCH http://localhost:8080/bidan/kader/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "status": "nonaktif"
  }'
```

---

# 🧪 TESTING FLOW

## Scenario 1: Complete Setup (Posyandu → Bidan → Kader)
```
1. Login sebagai Bidan
   POST /auth/login
   → Dapatkan JWT Token

2. Create Posyandu baru
   POST /bidan/posyandu
   → Dapatkan posyandu_id

3. Create Bidan baru
   POST /bidan
   → Dapatkan bidan_id

4. Create Kader untuk Posyandu
   POST /bidan/kader
   → Dapatkan kader_id

5. Verify dengan List endpoints
   GET /bidan/posyandu
   GET /bidan
   GET /bidan/kader
```

## Scenario 2: Update & Status Change
```
1. Get detail Posyandu/Bidan/Kader
   GET /bidan/posyandu/:id
   GET /bidan/:id
   GET /bidan/kader/:id

2. Update data
   PUT /bidan/posyandu/:id
   PUT /bidan/:id
   PUT /bidan/kader/:id

3. Change status
   PATCH /bidan/:id/status
   PATCH /bidan/kader/:id/status

4. Verify updated_at berubah
```

## Scenario 3: Search & Filter
```
1. Create multiple posyandu/bidan/kader

2. List dengan berbagai filter
   GET /bidan/posyandu?search=Sejahtera
   GET /bidan?desa=Sentosa
   GET /bidan/kader?search=Ani

3. Verify filter works correctly
```

---

# ✅ TESTING CHECKLIST

## Posyandu Tests
- [ ] Create dengan id_puskesmas valid
- [ ] Create tanpa id_puskesmas (expect 400)
- [ ] Create dengan nama kosong (expect 400)
- [ ] List all posyandu
- [ ] List dengan search filter
- [ ] Get detail by valid ID
- [ ] Get detail by invalid ID (expect 404)
- [ ] Update nama saja
- [ ] Update alamat saja
- [ ] Update keduanya
- [ ] Verify updated_at berubah

## Bidan Tests
- [ ] Create dengan penduduk_id valid
- [ ] Create tanpa penduduk_id (expect 400)
- [ ] Create dengan no_sipb kosong (expect 400)
- [ ] Create dengan status invalid (expect 400)
- [ ] List all bidan
- [ ] List dengan filter desa
- [ ] List dengan filter search
- [ ] Get detail by valid ID
- [ ] Get detail by invalid ID (expect 404)
- [ ] Update no_str, no_sipb, status
- [ ] Change status aktif → nonaktif
- [ ] Change status nonaktif → aktif
- [ ] Verify status constraint (hanya aktif/nonaktif)

## Kader Tests
- [ ] Create dengan penduduk_id valid
- [ ] Create tanpa penduduk_id (expect 400)
- [ ] Create dengan posyandu_id valid
- [ ] Create tanpa posyandu_id (optional, should work)
- [ ] List all kader
- [ ] List dengan filter search
- [ ] Get detail by valid ID
- [ ] Get detail by invalid ID (expect 404)
- [ ] Update posyandu_id
- [ ] Update status
- [ ] Change status aktif → nonaktif
- [ ] Change status nonaktif → aktif
- [ ] Verify status constraint

## Integration Tests
- [ ] Create Posyandu → Create Kader in Posyandu
- [ ] Create Posyandu → Create Bidan → Create Kader
- [ ] Verify relationship constraints
- [ ] Verify soft delete works (deleted_at)
- [ ] Test concurrent creation
- [ ] Test uniqueness constraints (1 penduduk = 1 bidan/kader)

---

# 📊 Database Requirements

**Pastikan tabel sudah ada:**
```sql
-- Puskesmas (harus sudah ada)
CREATE TABLE IF NOT EXISTS puskesmas (
  id BIGSERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  alamat TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Posyandu
CREATE TABLE IF NOT EXISTS posyandu (
  id BIGSERIAL PRIMARY KEY,
  id_puskesmas BIGINT NOT NULL,
  nama VARCHAR(255) NOT NULL,
  alamat TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT fk_posyandu_id_puskesmas 
    FOREIGN KEY (id_puskesmas) 
    REFERENCES puskesmas(id) 
    ON UPDATE CASCADE 
    ON DELETE RESTRICT
);

-- Bidan (update jika belum ada desa, kader relation)
ALTER TABLE bidan
  ADD COLUMN IF NOT EXISTS desa TEXT;

-- Kader (update jika belum ada posyandu_id)
ALTER TABLE kader
  ADD COLUMN IF NOT EXISTS posyandu_id BIGINT;

ALTER TABLE kader
  ADD CONSTRAINT fk_kader_posyandu_id
  FOREIGN KEY (posyandu_id)
  REFERENCES posyandu(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL;

-- Create Indexes
CREATE INDEX IF NOT EXISTS ix_posyandu_id_puskesmas ON posyandu(id_puskesmas);
CREATE INDEX IF NOT EXISTS ix_posyandu_deleted_at ON posyandu(deleted_at);
CREATE INDEX IF NOT EXISTS ix_bidan_deleted_at ON bidan(deleted_at);
CREATE INDEX IF NOT EXISTS ix_kader_posyandu_id ON kader(posyandu_id);
CREATE INDEX IF NOT EXISTS ix_kader_deleted_at ON kader(deleted_at);
```

---

# 🔗 Related Documentation
- [Posyandu API Testing](./POSYANDU_API_TESTING.md)
- [Database Migration](./sql/migration_puskesmas_posyandu.sql)
- [API Specification](./API_SPEC_TRIMESTER_UPDATED.md)

---

# 📞 Troubleshooting

### Error: "penduduk tidak ditemukan"
- Pastikan penduduk_id ada di tabel penduduk
- Verify NIK di penduduk table

### Error: "penduduk sudah terdaftar sebagai bidan/kader"
- Satu penduduk hanya bisa menjadi 1 bidan dan 1 kader
- Gunakan penduduk_id yang berbeda

### Error: "null value in column id_puskesmas violates not-null constraint"
- **Penyebab:** Field `id_puskesmas` tidak ter-bind dari request JSON
- **Solusi:**
  - Pastikan request JSON menggunakan key `"id_puskesmas"` (snake_case)
  - Pastikan value bukan 0 atau kosong
  - Jangan menggunakan `"id_puskesmas": null` atau `"id_puskesmas": 0`
  - Pastikan tipe data adalah integer: `"id_puskesmas": 1`

### Error: "posyandu tidak ditemukan"
- Pastikan posyandu sudah dibuat terlebih dahulu
- Verify posyandu_id ada di tabel posyandu

### Error: "status harus aktif atau nonaktif"
- Status hanya menerima: "aktif" atau "nonaktif"
- Case-sensitive, gunakan lowercase

### 401 Unauthorized
- JWT Token mungkin expired
- Re-login untuk dapatkan token baru
- Pastikan token di-pass di Authorization header

---

## 📝 Notes
- Semua timestamp dalam format ISO 8601 (UTC)
- ID adalah integer (int32 untuk bidan/kader, int64 untuk posyandu)
- deleted_at null artinya data masih aktif (soft delete pattern)
- Pastikan Bidan sudah login sebelum access endpoint
