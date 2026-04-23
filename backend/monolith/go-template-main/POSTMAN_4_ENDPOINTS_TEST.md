# Postman Test Guide - 4 Endpoints

Dokumen ini untuk test endpoint berikut:
- POST /login
- POST /logout
- GET /profile/keluarga
- POST /keluarga-lengkap

## Informasi Penting

- Role aparat desa di Supabase Anda ada di `roles.id = 6`.
- Pastikan nilai `roles.name` untuk id 6 adalah `Aparat_desa` atau `aparat_desa`.
- Backend sudah dibuat case-insensitive saat cek role aparat desa.
- Password default user baru dari endpoint keluarga-lengkap adalah `huta_mejan123`.

## Setup Environment di Postman

Buat Environment variable:
- `base_url` = `http://localhost:8080`
- `token_aparat` = kosong dulu
- `token_user_baru` = kosong dulu

## Seed Data Login Aparat Desa (Supabase)

Jalankan SQL berikut di Supabase SQL Editor sebelum test `POST /login`.

```sql
-- 1) Pastikan extension pgcrypto aktif (untuk hash bcrypt)
create extension if not exists pgcrypto;

-- 2) Pastikan role id 6 adalah Aparat_desa
insert into public.roles (id, name, description, created_at, updated_at)
values (6, 'Aparat_desa', 'Perangkat desa', now(), now())
on conflict (id) do update
set name = excluded.name,
    description = excluded.description,
    updated_at = now();

-- 3) Insert / update user aparat desa untuk login
-- password plaintext: Aparat123!
insert into public.users (nomor_telepon, kata_sandi, roles_id, isdeleted, created_at, updated_at)
values (
  '081234567890', 
  crypt('Aparat123!', gen_salt('bf', 10)),
  6,
  false,
  now(),
  now()
)
on conflict do nothing;

-- Jika nomor telepon sudah ada, update password + role:
update public.users
set kata_sandi = crypt('Aparat123!', gen_salt('bf', 10)),
    roles_id = 6,
    isdeleted = false,
    updated_at = now()
where nomor_telepon = '081234567890';
```

## Endpoint 1 - Login Aparat Desa

Method: `POST`
URL: `{{base_url}}/login`
Headers:
- `Content-Type: application/json`

Body (raw JSON):

```json
{
  "nomor_telepon": "081234567890",
  "kata_sandi": "Aparat123!"
}
```

Expected:
- Status `200`
- Ambil nilai `data.token`, simpan ke `token_aparat`

Contoh Tests script Postman:

```javascript
pm.test("login sukses", function () {
  pm.response.to.have.status(200);
});
const res = pm.response.json();
if (res && res.data && res.data.token) {
  pm.environment.set("token_aparat", res.data.token);
}
```

## Endpoint 2 - Create Keluarga Lengkap (role id 6)

Method: `POST`
URL: `{{base_url}}/keluarga-lengkap`
Headers:
- `Content-Type: application/json`
- `Authorization: Bearer {{token_aparat}}`

Body (raw JSON) dummy:

```json
{
  "no_kk": "3374042204260001",
  "id_role_pengguna": 6,
  "nik_pemilik_akun": "3374042204260003",
  "anggota": [
    {
      "nik": "3374042204260001",
      "nomor_telepon": "081234567801",
      "nama_lengkap": "Budi Kepala",
      "jenis_kelamin": "Laki-laki",
      "tanggal_lahir": "1990-01-10T00:00:00Z",
      "tempat_lahir": "Semarang",
      "golongan_darah": "O",
      "agama": "Islam",
      "status_perkawinan": "Kawin",
      "pendidikan_terakhir": "SMA",
      "pekerjaan": "Wiraswasta",
      "baca_huruf": "Ya",
      "kedudukan_keluarga": "Kepala Keluarga",
      "dusun": "Dusun 1",
      "tanggal_penambahan": "2026-04-22T00:00:00Z",
      "asal_penduduk": "Lahir",
      "tanggal_pengurangan": null,
      "tujuan_pindah": "",
      "tempat_meninggal": "",
      "keterangan": "Data dummy kepala keluarga"
    },
    {
      "nik": "3374042204260002",
      "nomor_telepon": "081234567802",
      "nama_lengkap": "Siti Ibu",
      "jenis_kelamin": "Perempuan",
      "tanggal_lahir": "1992-05-12T00:00:00Z",
      "tempat_lahir": "Semarang",
      "golongan_darah": "A",
      "agama": "Islam",
      "status_perkawinan": "Kawin",
      "pendidikan_terakhir": "SMA",
      "pekerjaan": "Ibu Rumah Tangga",
      "baca_huruf": "Ya",
      "kedudukan_keluarga": "Ibu",
      "dusun": "Dusun 1",
      "tanggal_penambahan": "2026-04-22T00:00:00Z",
      "asal_penduduk": "Datang",
      "tanggal_pengurangan": null,
      "tujuan_pindah": "",
      "tempat_meninggal": "",
      "keterangan": "Data dummy ibu"
    },
    {
      "nik": "3374042204260003",
      "nomor_telepon": "081234567803",
      "nama_lengkap": "Andi Anak",
      "jenis_kelamin": "Laki-laki",
      "tanggal_lahir": "2023-03-01T00:00:00Z",
      "tempat_lahir": "Semarang",
      "golongan_darah": "B",
      "agama": "Islam",
      "status_perkawinan": "Belum Kawin",
      "pendidikan_terakhir": "PAUD",
      "pekerjaan": "-",
      "baca_huruf": "Belum",
      "kedudukan_keluarga": "Anak",
      "dusun": "Dusun 1",
      "tanggal_penambahan": "2026-04-22T00:00:00Z",
      "asal_penduduk": "Lahir",
      "tanggal_pengurangan": null,
      "tujuan_pindah": "",
      "tempat_meninggal": "",
      "keterangan": "Data dummy anak",
      "nik_ibu": "3374042204260002"
    }
  ]
}
```

Expected:
- Status `200`
- Response berisi:
  - `id_pengguna`
  - `nomor_telepon_akun`
  - `password_default` (default `huta_mejan123`)

## Endpoint 3 - Login User Baru Hasil Keluarga Lengkap

Method: `POST`
URL: `{{base_url}}/login`
Headers:
- `Content-Type: application/json`

Body (raw JSON):

```json
{
  "nomor_telepon": "081234567803",
  "kata_sandi": "huta_mejan123"
}
```

Expected:
- Status `200`
- Simpan token ke `token_user_baru`

Contoh Tests script Postman:

```javascript
pm.test("login user baru sukses", function () {
  pm.response.to.have.status(200);
});
const res = pm.response.json();
if (res && res.data && res.data.token) {
  pm.environment.set("token_user_baru", res.data.token);
}
```

## Endpoint 4 - Profile Keluarga

Method: `GET`
URL: `{{base_url}}/profile/keluarga`
Headers:
- `Authorization: Bearer {{token_user_baru}}`

Expected:
- Status `200`
- `data.anggota_keluarga` berisi anggota pada KK yang sama

## Endpoint 5 - Logout

Method: `POST`
URL: `{{base_url}}/logout`
Headers:
- `Authorization: Bearer {{token_user_baru}}`

Expected:
- Status `200`
- Message logout berhasil

## Troubleshooting Cepat

- Jika `403` saat `/keluarga-lengkap`:
  - Cek akun login memang punya role aparat desa/admin/superadmin.
  - Cek `roles.id = 6` dan `roles.name` benar.
- Jika `409 nomor telepon sudah digunakan`:
  - Ganti nomor telepon dummy.
- Jika `nik sudah terdaftar`:
  - Ganti NIK dummy.
- Jika token invalid:
  - Login ulang dan update environment token.
