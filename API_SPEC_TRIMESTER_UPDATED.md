# API Specification - Pemeriksaan Trimester 1 & 3 (Updated)

## 📋 Perubahan API Request - Field Baru & Dihapus

---

## TRIMESTER 1

### POST /api/pemeriksaan-trimester-1

#### Request Body (BARU)
```json
{
  "kehamilan_id": 1,
  "nama_dokter": "Dr. Budi Santoso",
  "konsep_anamnesa_pemeriksaan": "Ibu hamil dengan riwayat hipertensi",
  "gambar_usg": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...",
  
  // Fisik Pemeriksaan
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
  
  // Riwayat Kehamilan
  "hpht": "2025-10-06",
  "keteraturan_haid": "teratur",
  "umur_hamil_hpht_minggu": 13,
  "umur_hamil_usg_minggu": 13,
  
  // USG Trimester 1
  "usg_jumlah_gs": "1",
  "usg_diameter_gs_cm": 2.5,
  "usg_diameter_gs_minggu": 13,
  "usg_diameter_gs_hari": 0,
  "usg_jumlah_bayi": "1",
  "usg_crl_cm": 7.2,
  "usg_crl_minggu": 13,
  "usg_crl_hari": 0,
  "usg_letak_produk_kehamilan": "uterus",
  "usg_pulsasi_jantung": "ada",
  "usg_kecurigaan_temuan_abnormal": "tidak",
  "usg_keterangan_temuan_abnormal": "",
  
  // Lab Jiwa (Trimester 1) - Optional
  "lab_hemoglobin_hasil_jiwa": 11.5,
  "lab_hemoglobin_rencana_tindak_lanjut": "normal",
  "lab_golongan_darah_rhesus_hasil": "O+",
  "lab_golongan_darah_rhesus_rencana_tindak_lanjut": "normal",
  "lab_gula_darah_sewaktu_hasil": 105,
  "lab_gula_darah_sewaktu_rencana_tindak_lanjut": "normal",
  "lab_hiv_hasil": "negatif",
  "lab_hiv_rencana_tindak_lanjut": "normal",
  "lab_sifilis_hasil": "negatif",
  "lab_sifilis_rencana_tindak_lanjut": "normal",
  "lab_hepatitis_b_hasil": "negatif",
  "lab_hepatitis_b_rencana_tindak_lanjut": "normal",
  
  // Skrining Jiwa (Trimester 1) - Optional
  "skrining_jiwa_hasil": "normal",
  "skrining_jiwa_tindak_lanjut": "tidak perlu",
  "skrining_jiwa_perlu_rujukan": "tidak",
  "kesimpulan": "Kehamilan normal",
  "rekomendasi": "Kontrol rutin"
}
```

#### Field DIHAPUS (tidak perlu dikirim lagi)
```
❌ tanggal_periksa           → Auto set ke hari ini
❌ hpl_berdasarkan_hpht      → Auto calculate dari HPHT
❌ hpl_berdasarkan_usg       → Auto calculate dari umur hamil USG
❌ tanggal_lab_jiwa          → Auto set ke hari ini
❌ tanggal_skrining_jiwa     → Auto set ke hari ini
```

#### Response (200 OK)
```json
{
  "id": 1,
  "kehamilan_id": 1,
  "nama_dokter": "Dr. Budi Santoso",
  "tanggal_periksa": "2026-05-06",  ← Auto set (hari pemeriksaan)
  "konsep_anamnesa_pemeriksaan": "Ibu hamil dengan riwayat hipertensi",
  "gambar_usg": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...",  ← Tersimpan
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
  "keteraturan_haid": "teratur",
  "umur_hamil_hpht_minggu": 13,
  "hpl_berdasarkan_hpht": "2026-07-06",  ← Auto calculate
  "umur_hamil_usg_minggu": 13,
  "hpl_berdasarkan_usg": "2026-07-06",   ← Auto calculate
  "usg_jumlah_gs": "1",
  "usg_diameter_gs_cm": 2.5,
  "usg_diameter_gs_minggu": 13,
  "usg_diameter_gs_hari": 0,
  "usg_jumlah_bayi": "1",
  "usg_crl_cm": 7.2,
  "usg_crl_minggu": 13,
  "usg_crl_hari": 0,
  "usg_letak_produk_kehamilan": "uterus",
  "usg_pulsasi_jantung": "ada",
  "usg_kecurigaan_temuan_abnormal": "tidak",
  "usg_keterangan_temuan_abnormal": "",
  "created_at": "2026-05-06T10:30:45Z",
  "lab_jiwa": {
    "id": 101,
    "kehamilan_id": 1,
    "trimester": 1,
    "tanggal_lab": "2026-05-06",  ← Auto set
    "lab_hemoglobin_hasil": 11.5,
    "lab_hemoglobin_rencana_tindak_lanjut": "normal",
    "lab_golongan_darah_rhesus_hasil": "O+",
    "lab_golongan_darah_rhesus_rencana": "normal",
    "lab_gula_darah_sewaktu_hasil": 105,
    "lab_gula_darah_sewaktu_rencana": "normal",
    "lab_hiv_hasil": "negatif",
    "lab_hiv_rencana": "normal",
    "lab_sifilis_hasil": "negatif",
    "lab_sifilis_rencana": "normal",
    "lab_hepatitis_b_hasil": "negatif",
    "lab_hepatitis_b_rencana": "normal",
    "tanggal_skrining_jiwa": "2026-05-06",  ← Auto set
    "skrining_jiwa_hasil": "normal",
    "skrining_jiwa_tindak_lanjut": "tidak perlu",
    "skrining_jiwa_perlu_rujukan": "tidak",
    "kesimpulan": "Kehamilan normal",
    "rekomendasi": "Kontrol rutin"
  }
}
```

#### Error (400 Bad Request)
```json
{
  "message": "kehamilan_id wajib diisi"
}
```

---

### PUT /api/pemeriksaan-trimester-1/:id

Sama dengan POST, structure request/response sama.

---

### GET /api/pemeriksaan-trimester-1/:id

Response sama dengan POST response (200 OK)

---

### GET /api/pemeriksaan-trimester-1?kehamilan_id=1

Response array dari GET /:id

---

### DELETE /api/pemeriksaan-trimester-1/:id

```json
Response (200 OK):
{
  "message": "Data berhasil dihapus"
}

Catatan: 
- Data pemeriksaan dihapus
- ✅ Catatan Pelayanan Trimester 1 terkait OTOMATIS terhapus (CASCADE DELETE)
```

---

---

## TRIMESTER 3

### POST /api/pemeriksaan-trimester-3

#### Request Body (BARU)
```json
{
  "kehamilan_id": 1,
  "nama_dokter": "Dr. Budi Santoso",
  "konsep_anamnesa_pemeriksaan": "Ibu hamil memasuki trimester 3",
  "gambar_usg": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...",
  
  // Fisik Pemeriksaan
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
  
  // USG Trimester 3
  "usg_trimester_3_dilakukan": "ya",
  "uk_berdasarkan_usg_trimester_1_minggu": 38,
  "uk_berdasarkan_hpht_minggu": 38,
  "uk_berdasarkan_biometri_usg_trimester_3_minggu": 38,
  "selisih_uk_3_minggu_atau_lebih": "tidak",
  "usg_jumlah_bayi": "1",
  "usg_letak_bayi": "cephalic",
  "usg_presentasi_bayi": "kepala",
  "usg_keadaan_bayi": "tunggal",
  "usg_djj_nilai": 140,
  "usg_djj_status": "normal",
  "usg_lokasi_plasenta": "anterior",
  "usg_cairan_ketuban_sdp_cm": 8.5,
  "usg_cairan_ketuban_status": "normal",
  "biometri_bpd_cm": 9.5,
  "biometri_bpd_minggu": 38,
  "biometri_hc_cm": 34.2,
  "biometri_hc_minggu": 38,
  "biometri_ac_cm": 31.8,
  "biometri_ac_minggu": 38,
  "biometri_fl_cm": 7.2,
  "biometri_fl_minggu": 38,
  "biometri_efw_tbj_gram": 3200,
  "biometri_efw_tbj_minggu": 38,
  "usg_kecurigaan_temuan_abnormal": "tidak",
  "usg_keterangan_temuan_abnormal": "",
  
  // Lanjutan Trimester 3
  "hasil_usg_catatan": "USG normal, siap persalinan",
  "lab_hemoglobin_hasil": 11.0,
  "lab_hemoglobin_rencana_tindak_lanjut": "normal",
  "lab_protein_urin_hasil": 0,
  "lab_protein_urin_rencana_tindak_lanjut": "normal",
  "lab_urin_reduksi_hasil": "negatif",
  "lab_urin_reduksi_rencana_tindak_lanjut": "normal",
  "skrining_jiwa_hasil": "normal",
  "skrining_jiwa_tindak_lanjut": "tidak perlu",
  "skrining_jiwa_perlu_rujukan": "tidak",
  
  // Rencana Konsultasi
  "rencana_konsultasi_gizi": false,
  "rencana_konsultasi_kebidanan": true,
  "rencana_konsultasi_anak": false,
  "rencana_konsultasi_penyakit_dalam": false,
  "rencana_konsultasi_neurologi": false,
  "rencana_konsultasi_tht": false,
  "rencana_konsultasi_psikiatri": false,
  "rencana_konsultasi_lain_lain": "",
  
  // Rencana Proses Persalinan & Kontrasepsi
  "rencana_proses_melahirkan": "spontan",
  "rencana_kontrasepsi_akdr": true,
  "rencana_kontrasepsi_pil": false,
  "rencana_kontrasepsi_suntik": false,
  "rencana_kontrasepsi_steril": false,
  "rencana_kontrasepsi_mal": false,
  "rencana_kontrasepsi_implan": false,
  "rencana_kontrasepsi_belum_memilih": false,
  
  "kebutuhan_konseling": "tidak",
  "penjelasan": "Siap untuk persalinan normal",
  "kesimpulan_rekomendasi_tempat_melahirkan": "faskes_rujukan",
  
  // Lab & Skrining Jiwa (Optional)
  "lab_hemoglobin_hasil_jiwa": 11.0,
  "lab_hemoglobin_rencana_tindak_lanjut_jiwa": "normal",
  "lab_golongan_darah_rhesus_hasil": "O+",
  "lab_golongan_darah_rhesus_rencana_tindak_lanjut": "normal",
  "lab_gula_darah_sewaktu_hasil": 100,
  "lab_gula_darah_sewaktu_rencana_tindak_lanjut": "normal",
  "lab_hiv_hasil": "negatif",
  "lab_hiv_rencana_tindak_lanjut": "normal",
  "lab_sifilis_hasil": "negatif",
  "lab_sifilis_rencana_tindak_lanjut": "normal",
  "lab_hepatitis_b_hasil": "negatif",
  "lab_hepatitis_b_rencana_tindak_lanjut": "normal",
  "skrining_jiwa_hasil_tr": "normal",
  "skrining_jiwa_tindak_lanjut_tr": "tidak perlu",
  "skrining_jiwa_perlu_rujukan_tr": "tidak",
  "kesimpulan_tr": "Mental sehat",
  "rekomendasi_tr": "Siap persalinan"
}
```

#### Field DIHAPUS
```
❌ tanggal_periksa              → Auto set ke hari ini
❌ tanggal_lab                  → Auto set ke hari ini
❌ tanggal_skrining_jiwa        → Auto set ke hari ini
❌ tanggal_lab_jiwa             → Auto set ke hari ini
❌ tanggal_skrining_jiwa_tr     → Auto set ke hari ini
```

#### Response (200 OK)
Serupa dengan Trimester 1, semua tanggal auto-set.

---

### PUT /api/pemeriksaan-trimester-3/:id
Sama dengan POST

---

### GET /api/pemeriksaan-trimester-3/:id
Response berupa detail pemeriksaan

---

### GET /api/pemeriksaan-trimester-3?kehamilan_id=1
Response array

---

### DELETE /api/pemeriksaan-trimester-3/:id
```json
{
  "message": "Data berhasil dihapus"
}

Catatan:
- ✅ Catatan Pelayanan Trimester 3 terkait OTOMATIS terhapus (CASCADE DELETE)
```

---

---

## 📌 CATATAN PENTING

### 1. Gambar USG Format
- **Format:** Base64 encoded image dengan prefix
- **Contoh:** `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...`
- **Alternatif:** `data:image/png;base64,...`

**Cara convert di Frontend:**
```javascript
const fileInput = document.getElementById('gambar-usg');
const file = fileInput.files[0];
const reader = new FileReader();

reader.onload = (e) => {
  const base64 = e.target.result;
  // base64 sudah dalam format: "data:image/jpeg;base64,..."
  
  // Kirim ke API
  fetch('/api/pemeriksaan-trimester-1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      kehamilan_id: 1,
      gambar_usg: base64,  ← Langsung base64 dari reader
      // ... field lainnya
    })
  });
};

reader.readAsDataURL(file);
```

### 2. Tanggal Auto-Set
- **Tidak perlu kirim** `tanggal_periksa`, `tanggal_lab`, `tanggal_skrining_jiwa`
- **Backend otomatis** set ke `time.Now()` (hari pemeriksaan)
- **Response akan include** tanggal-tanggal tersebut (sudah terisi)

### 3. Cascade Delete
- **DELETE pemeriksaan** → Catatan Pelayanan Trimester terkait otomatis terhapus
- **Tidak perlu** delete catatan secara manual
- **Data integrity** terjaga otomatis

### 4. Optional Fields
- Field lab dan skrining jiwa opsional
- Jika tidak ada data, kirim `null` atau jangan include
- Response tetap include (null jika tidak ada)

---

## 🧪 TESTING dengan cURL

### Trimester 1 - Create
```bash
curl -X POST http://localhost:8080/api/pemeriksaan-trimester-1 \
  -H "Content-Type: application/json" \
  -d '{
    "kehamilan_id": 1,
    "nama_dokter": "Dr. Budi",
    "gambar_usg": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...",
    "konsep_anamnesa_pemeriksaan": "Normal",
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
    "keteraturan_haid": "teratur",
    "usg_jumlah_gs": "1",
    "usg_jumlah_bayi": "1"
  }'
```

### Trimester 1 - Get
```bash
curl http://localhost:8080/api/pemeriksaan-trimester-1/1
```

### Trimester 1 - Delete (cascade)
```bash
curl -X DELETE http://localhost:8080/api/pemeriksaan-trimester-1/1
```

---

**Version: 2.0 (Updated)**
**Date: 2026-05-06**
**Status: ✅ Production Ready**
