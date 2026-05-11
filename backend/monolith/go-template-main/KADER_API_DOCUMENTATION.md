# 📋 KADER PROFILE MANAGEMENT API

## Overview
Sistem manajemen profil Kader dengan kontrol akses berbasis role. Hanya **Bidan** yang dapat mengelola kader di Posyandu mereka.

---

## 🔐 Authorization

### Role-Based Access Control
| Role | Permission | Endpoint |
|------|-----------|----------|
| **Bidan** | View & Edit kader di posyandu mereka | `/tenaga-kesehatan/kader/*` |
| **Admin** | Full CRUD untuk semua kader | `/admin/kader/*` |
| **Lainnya** | No access | ❌ |

### Header yang Diperlukan
```bash
Authorization: Bearer {JWT_TOKEN}
```

---

## 🔌 API Endpoints

### 1️⃣ **BIDAN - List Kader di Posyandu**
```http
GET /tenaga-kesehatan/kader
Authorization: Bearer {JWT_TOKEN}
```

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Cari berdasarkan nama atau NIK |

#### Request Example
```bash
curl -X GET "http://localhost:8080/tenaga-kesehatan/kader?search=John" \
  -H "Authorization: Bearer {token}"
```

#### Response Success (200 OK)
```json
{
  "status_code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "penduduk_id": 10,
      "nama_lengkap": "John Doe",
      "nik": "1234567890123456",
      "kecamatan": "Kecamatan A",
      "desa": "Desa B",
      "posyandu_id": 5,
      "status": "aktif",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "error": null
}
```

#### Response Error (400 Bad Request)
```json
{
  "status_code": 400,
  "message": "Bad Request",
  "errors": ["search parameter invalid"]
}
```

---

### 2️⃣ **BIDAN - Get Detail Kader**
```http
GET /tenaga-kesehatan/kader/:id
Authorization: Bearer {JWT_TOKEN}
```

#### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | ID kader |

#### Request Example
```bash
curl -X GET "http://localhost:8080/tenaga-kesehatan/kader/1" \
  -H "Authorization: Bearer {token}"
```

#### Response Success (200 OK)
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "penduduk_id": 10,
    "posyandu_id": 5,
    "status": "aktif",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "penduduk": {
      "id_kependudukan": 10,
      "nama_lengkap": "John Doe",
      "nik": "1234567890123456",
      "kecamatan": "Kecamatan A",
      "desa": "Desa B"
    }
  },
  "error": null
}
```

#### Response Error (404 Not Found)
```json
{
  "status_code": 404,
  "message": "Not Found",
  "errors": ["kader tidak ditemukan"]
}
```

---

### 3️⃣ **BIDAN - Update Kader Profile**
```http
PUT /tenaga-kesehatan/kader/:id
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

#### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | ID kader |

#### Request Body
```json
{
  "posyandu_id": 5,
  "status": "aktif"
}
```

#### Request Example
```bash
curl -X PUT "http://localhost:8080/tenaga-kesehatan/kader/1" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "posyandu_id": 5,
    "status": "aktif"
  }'
```

#### Response Success (200 OK)
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "penduduk_id": 10,
    "posyandu_id": 5,
    "status": "aktif",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:45:00Z"
  },
  "error": null
}
```

#### Response Error (400 Bad Request)
```json
{
  "status_code": 400,
  "message": "Bad Request",
  "errors": ["status harus 'aktif' atau 'nonaktif'"]
}
```

---

### 4️⃣ **ADMIN - List Semua Kader**
```http
GET /admin/kader
Authorization: Bearer {JWT_TOKEN}
```

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `desa` | string | No | Filter berdasarkan nama desa |

#### Request Example
```bash
curl -X GET "http://localhost:8080/admin/kader?desa=Desa%20B" \
  -H "Authorization: Bearer {token}"
```

#### Response Success (200 OK)
```json
{
  "status_code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "penduduk_id": 10,
      "nama_lengkap": "John Doe",
      "nik": "1234567890123456",
      "kecamatan": "Kecamatan A",
      "desa": "Desa B",
      "posyandu_id": 5,
      "status": "aktif",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "error": null
}
```

---

### 5️⃣ **ADMIN - Create Kader Baru**
```http
POST /admin/kader
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

#### Request Body
```json
{
  "penduduk_id": 10,
  "posyandu_id": 5,
  "status": "aktif"
}
```

#### Request Example
```bash
curl -X POST "http://localhost:8080/admin/kader" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "penduduk_id": 10,
    "posyandu_id": 5,
    "status": "aktif"
  }'
```

#### Response Success (201 Created)
```json
{
  "status_code": 201,
  "message": "Success",
  "data": {
    "id": 1,
    "penduduk_id": 10,
    "posyandu_id": 5,
    "status": "aktif",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "penduduk": {
      "id_kependudukan": 10,
      "nama_lengkap": "John Doe",
      "nik": "1234567890123456"
    }
  },
  "error": null
}
```

#### Response Error (409 Conflict)
```json
{
  "status_code": 409,
  "message": "Conflict",
  "errors": ["penduduk sudah terdaftar sebagai kader"]
}
```

---

### 6️⃣ **ADMIN - Update Kader**
```http
PUT /admin/kader/:id
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

#### Request Body
```json
{
  "posyandu_id": 6,
  "status": "nonaktif"
}
```

#### Response Success (200 OK)
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "penduduk_id": 10,
    "posyandu_id": 6,
    "status": "nonaktif",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T12:00:00Z"
  },
  "error": null
}
```

---

### 7️⃣ **ADMIN - Update Status Kader**
```http
PATCH /admin/kader/:id/status
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

#### Request Body
```json
{
  "status": "aktif"
}
```

#### Request Example
```bash
curl -X PATCH "http://localhost:8080/admin/kader/1/status" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "aktif"
  }'
```

#### Response Success (200 OK)
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "updated": true
  },
  "error": null
}
```

---

### 8️⃣ **ADMIN - Delete Kader**
```http
DELETE /admin/kader/:id
Authorization: Bearer {JWT_TOKEN}
```

#### Request Example
```bash
curl -X DELETE "http://localhost:8080/admin/kader/1" \
  -H "Authorization: Bearer {token}"
```

#### Response Success (200 OK)
```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "deleted": true
  },
  "error": null
}
```

#### Response Error (404 Not Found)
```json
{
  "status_code": 404,
  "message": "Not Found",
  "errors": ["kader tidak ditemukan"]
}
```

---

## 📊 Status Code Reference

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request berhasil |
| 201 | Created | Resource berhasil dibuat |
| 400 | Bad Request | Format request invalid |
| 401 | Unauthorized | Token tidak valid atau tidak ada |
| 403 | Forbidden | Anda tidak punya akses |
| 404 | Not Found | Resource tidak ditemukan |
| 409 | Conflict | Data sudah ada |
| 500 | Internal Server Error | Error pada server |

---

## 🔄 Status Values

- `aktif` - Kader sedang aktif
- `nonaktif` - Kader tidak aktif

---

## 💡 Usage Examples

### Postman Collection
Semua endpoint dapat ditest dengan Postman. Import collection berikut:

**BIDAN - List Kader**
```
Method: GET
URL: http://localhost:8080/tenaga-kesehatan/kader
Headers:
  Authorization: Bearer {your_bidan_token}
```

**BIDAN - Update Kader Profile**
```
Method: PUT
URL: http://localhost:8080/tenaga-kesehatan/kader/1
Headers:
  Authorization: Bearer {your_bidan_token}
  Content-Type: application/json
Body (JSON):
{
  "status": "aktif"
}
```

**ADMIN - Create Kader**
```
Method: POST
URL: http://localhost:8080/admin/kader
Headers:
  Authorization: Bearer {your_admin_token}
  Content-Type: application/json
Body (JSON):
{
  "penduduk_id": 10,
  "posyandu_id": 5,
  "status": "aktif"
}
```

---

## 🛡️ Security Notes

1. **JWT Token** - Semua request memerlukan JWT token valid
2. **Role Check** - Middleware akan validate role sebelum akses endpoint
3. **Soft Delete** - Delete operation menggunakan soft delete (data tidak benar-benar dihapus)
4. **Input Validation** - Semua input akan di-validasi sebelum diproses

---

## 🚀 Development Tips

### Debugging
Tambahkan log ke database:
```go
// Di kader_usecase.go
log.Printf("[DEBUG] Fetching kader with ID: %d", id)
```

### Error Handling
Semua error akan return dengan format standar:
```json
{
  "status_code": 400,
  "message": "Bad Request",
  "errors": ["specific error message"]
}
```

### Testing
Test dengan curl command:
```bash
# List kader
curl -X GET "http://localhost:8080/tenaga-kesehatan/kader" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Implementation Checklist

- ✅ Model Kader sudah ada
- ✅ Repository Kader sudah ada
- ✅ Usecase Kader sudah dibuat (kader_usecase.go)
- ✅ Controller Kader sudah dibuat (kader_controller.go)
- ✅ Middleware BidanOnly ditambahkan
- ✅ Routes dikonfigurasi
- ✅ Init files di-update

---

## 🔄 Next Steps (Optional)

1. **Tambahkan Email Notification** - Kirim email ketika kader dibuat/diupdate
2. **Tambahkan Audit Log** - Catat semua perubahan data kader
3. **Tambahkan Batch Import** - Import kader dari CSV file
4. **Tambahkan Dashboard** - Visualisasi data kader di frontend

---

**Last Updated:** 2024-01-15
**Status:** ✅ Ready for Production
