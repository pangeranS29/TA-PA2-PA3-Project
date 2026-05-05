import React from "react";
import EdukasiDigitalCrudPage from "./EdukasiDigitalCrudPage";

const mpasiFields = [
  { key: "judul", label: "Judul Edukasi MPASI", type: "text" },
  { key: "gambar_url", label: "URL Gambar", type: "text" },
  { key: "isi", label: "Isi Konten / Penjelasan", type: "textarea", rows: 6 },
  { key: "resep", label: "Resep Makanan", type: "textarea", rows: 10 },
];

export default function MpasiFormPage() {
  return (
    <EdukasiDigitalCrudPage
      title="Form Edukasi MPASI"
      resourcePath="edukasi-mpasi"
      view="form"
      listPath="/edukasi-digital/mpasi"
      fields={mpasiFields}
    />
  );
}
