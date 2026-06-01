import React from "react";
import EdukasiDigitalCrudPage from "./EdukasiDigitalCrudPage";

<<<<<<< HEAD
const mpasiFields = [
=======
const fields = [
>>>>>>> 9a739a5998c7885144f27c747e57ca06296d6a4e
  { key: "judul", label: "Judul Edukasi MPASI", type: "text", required: true },
  { key: "konten", label: "Konten", type: "textarea", rows: 6, required: true },
  { key: "bulan_min", label: "Bulan Minimal (Opsional)", type: "number" },
  { key: "bulan_max", label: "Bulan Maksimal (Opsional)", type: "number" },
<<<<<<< HEAD
=======
  { key: "gambar_url", label: "URL Gambar (opsional)", type: "text" },
>>>>>>> 9a739a5998c7885144f27c747e57ca06296d6a4e
];

export default function MpasiFormPage() {
  return (
    <EdukasiDigitalCrudPage
      title="Form Edukasi MPASI"
      resourcePath="edukasi-mpasi"
      view="form"
      listPath="/edukasi-digital/mpasi"
      fields={fields}
    />
  );
}
