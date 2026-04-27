import React from "react";
import EdukasiDigitalCrudPage from "./EdukasiDigitalCrudPage";

export default function PolaAsuhFormPage() {
  return (
    <EdukasiDigitalCrudPage
      title="Form Edukasi Pola Asuh"
      resourcePath="edukasi-pola-asuh"
      view="form"
      listPath="/edukasi-digital/pola-asuh"
      fields={[
        { key: "judul", label: "Judul", type: "text" },
        { key: "gambar_url", label: "URL gambar (opsional)", type: "text" },
        { key: "isi", label: "Isi konten", type: "textarea", rows: 6 },
      ]}
    />
  );
}
