# 🤰 MamaCare AI – Sistem Prediksi Risiko Kehamilan

**Proyek Machine Learning | Institut Teknologi Del**
Mata Kuliah: 4143104 – Pembelajaran Mesin
Dosen: Oppir Hutapea, S.Tr.Kom., M.Kom

---

## 📁 Struktur File Proyek

```
mamacare_project/
├── dataset_anc_bumil.xlsx     ← Dataset (10.000 pasien)
├── mamacare_train.py          ← Script pelatihan model (JALANKAN PERTAMA)
├── mamacare_app.py            ← Aplikasi Streamlit web
├── requirements.txt           ← Dependensi Python
└── README.md                  ← Panduan ini
```

Setelah training berhasil, file berikut akan dibuat otomatis:
```
├── maternal_model_rf.pkl      ← Model Random Forest (utama)
├── maternal_model_lr.pkl      ← Model Logistic Regression
├── maternal_model.pkl         ← Alias RF untuk Streamlit
├── scaler_maternal.pkl        ← StandardScaler
├── feature_cols.pkl           ← Daftar 37 fitur
├── label_map.pkl              ← Mapping label
├── feature_importances.pkl    ← Feature importance
├── feature_importance.png     ← Visualisasi feature importance
├── confusion_matrix.png       ← Confusion matrix
└── distribusi_kelas.png       ← Distribusi kelas
```

---

## 🚀 Cara Menjalankan (Langkah demi Langkah)

### Langkah 1 – Install dependensi
```bash
pip install -r requirements.txt
```

### Langkah 2 – Siapkan dataset
Pastikan file `dataset_anc_bumil.xlsx` ada di folder yang sama dengan script.

### Langkah 3 – Latih model
```bash
python mamacare_train.py
```
Proses ini akan:
- Memuat dan memproses dataset
- Membentuk label risiko berbasis aturan klinis
- Melakukan feature engineering (37 fitur)
- Train-test split 80:20 + oversampling
- GridSearchCV hyperparameter tuning (5-fold CV)
- Evaluasi dan menyimpan model

**Hasil yang diharapkan:**
- Random Forest Akurasi : ~98.50% (F1: 0.9850)
- Logistic Regression  : ~95.65% (F1: 0.9566)
- ✅ Kedua model > 80% (target terpenuhi)

### Langkah 4 – Jalankan aplikasi web
```bash
streamlit run mamacare_app.py
```
Buka browser di: `http://localhost:8501`

---

## 🎯 Kelas Risiko

| Kelas | Label | Deskripsi |
|-------|-------|-----------|
| 0 | NORMAL | Tidak ada kondisi berisiko bermakna |
| 1 | PERLU TINDAKAN | Ada indikasi klinis, perlu intervensi |
| 2 | PERLU RUJUKAN | Kondisi kritis, rujuk ke RSUD |

---

## 📊 Hasil Evaluasi Model

| Model | Sebelum Tuning | Setelah Tuning | F1-Score |
|-------|---------------|----------------|----------|
| Random Forest | 98.30% | **98.50%** | **0.9850** |
| Logistic Regression | 95.55% | **95.65%** | **0.9566** |
| RF Cross-Val (5-fold) | — | **98.79% ± 0.13%** | — |

---

## 🔧 Fitur Terpenting (Top 5)

1. Risk_Score (0.217) – Skor risiko komposit
2. Riwayat_Berat (0.204) – Riwayat penyakit berat
3. Riwayat_Enc (0.078) – Ada/tidak riwayat penyakit
4. Hemoglobin/Hb (0.036) – Kadar hemoglobin
5. Sif_Rek (0.034) – Tripel Eliminasi Sifilis

---

## 📋 Catatan Penting

- Aplikasi ini adalah alat bantu skrining **edukatif**
- **TIDAK menggantikan** diagnosis medis profesional
- Untuk kondisi darurat hubungi: **Hotline Kesehatan 119**

