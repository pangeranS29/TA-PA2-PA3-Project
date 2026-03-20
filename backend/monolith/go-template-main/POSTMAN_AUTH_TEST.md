# Auth API Test Guide (Postman)
## 1. Persiapan

1. Pastikan file `.env` sudah berisi `DB_POSTGRES_DSN`.
2. Jalankan service dari folder `backend/monolith/go-template-main`:

```bash
go run cmd/main.go
```

3. Base URL default:

```text
http://localhost:8080
```

## 2. Endpoint yang tersedia

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (protected, wajib Bearer token)

## 3. Test cepat health check

Request:

- Method: `GET`
- URL: `http://localhost:8080/health`

Expected response:

```json
{
  "status": "ok"
}
```

## 4. Register user

Request:

- Method: `POST`
- URL: `http://localhost:8080/auth/register`
- Header: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "name": "Dokter Satu",
  "email": "dokter1@example.com",
  "password": "password123",
  "role_name": "Dokter"
}
```

Role yang valid:

- `Tenaga-kesehatan`
- `Dokter`
- `Kader`
- `Bidan`
- `Orangtua`

Expected response sukses (`201`):

```json
{
  "status_code": 201,
  "message": [
    "Success"
  ],
  "data": {
    "message": "registrasi berhasil"
  }
}
```

## 5. Login user

Request:

- Method: `POST`
- URL: `http://localhost:8080/auth/login`
- Header: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "email": "dokter1@example.com",
  "password": "password123"
}
```

Expected response sukses (`200`) untuk role Dokter:

```json
{
  "status_code": 200,
  "message": [
    "Success"
  ],
  "data": {
    "access_token": "<jwt-token>",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user_id": 1,
    "name": "Dokter Satu",
    "email": "dokter1@example.com",
    "role": "Dokter",
    "target_app": "website",
    "redirect_route": "/dashboard/dokter"
  }
}
```

## 6. Test endpoint protected dengan Bearer token

Request:

- Method: `GET`
- URL: `http://localhost:8080/auth/me`
- Header:

```text
Authorization: Bearer <access_token_dari_login>
```

Expected response sukses (`200`):

```json
{
  "status_code": 200,
  "message": [
    "Success"
  ],
  "data": {
    "user_id": 1,
    "email": "dokter1@example.com",
    "role": "Dokter",
    "target_app": "website",
    "redirect_route": "/dashboard/dokter"
  }
}
```

## 7. Mapping role ke platform

- `Dokter` -> `website`
- `Tenaga-kesehatan` -> `website`
- `Kader` -> `mobile`
- `Bidan` -> `mobile`
- `Orangtua` -> `mobile`

## 8. Verifikasi data masuk Supabase

Buka Supabase SQL Editor, jalankan query:

```sql
select u.id, u.name, u.email, r.name as role_name, u.created_at
from users u
join roles r on r.id = u.role_id
order by u.id desc;
```

Kalau register berhasil, data user akan muncul di hasil query.

## 9. Catatan auto-migration tabel

Aplikasi menjalankan `AutoMigrate` saat startup.

- Jika tabel `roles` atau `users` belum ada: tabel akan dibuat.
- Jika tabel sudah ada: tabel tidak dibuat ulang dari nol, data lama tetap ada.
- Seed role memakai `FirstOrCreate`, jadi role default tidak dobel.

## 10. Skenario error umum

1. Email sudah terdaftar saat register -> `400`.
2. Role tidak valid / tidak ada di tabel `roles` -> `404`.
3. Email/password salah saat login -> `400`.
4. Header Authorization tidak valid saat akses `/auth/me` -> `401`.
