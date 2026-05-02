import React from "react";
import EdukasiDigitalCrudPage from "./EdukasiDigitalCrudPage";

export default function PerawatanAnakFormPage() {
  return (
    <EdukasiDigitalCrudPage
      title="Form Edukasi Perawatan Anak"
      resourcePath="edukasi-perawatan-anak"
      view="form"
      listPath="/edukasi-digital/perawatan-anak"
      fields={[
        { key: "judul", label: "Judul", type: "text" },
        { key: "gambar_url", label: "URL gambar (opsional)", type: "text" },
        { key: "isi_konten", label: "Isi", type: "textarea", rows: 10 },
      ]}
    />
  );
}
