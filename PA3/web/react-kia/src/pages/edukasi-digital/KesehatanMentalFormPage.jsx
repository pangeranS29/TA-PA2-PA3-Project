import React from "react";
import EdukasiDigitalCrudPage from "./EdukasiDigitalCrudPage";

export default function KesehatanMentalFormPage() {
  return (
    <EdukasiDigitalCrudPage
      title="Form Edukasi Kesehatan Mental"
      resourcePath="edukasi-kesehatan-mental"
      view="form"
      listPath="/edukasi-digital/kesehatan-mental"
      fields={[
        { key: "judul", label: "Judul", type: "text" },
        { key: "gambar_url", label: "URL gambar (opsional)", type: "text" },
        { key: "deskripsi", label: "Deskripsi", type: "textarea", rows: 2 },
        { key: "isi", label: "Isi konten", type: "textarea", rows: 6 },
      ]}
    />
  );
}
