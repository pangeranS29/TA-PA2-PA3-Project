import React from "react";
import EdukasiDigitalCrudPage from "./EdukasiDigitalCrudPage";

export default function ImdFormPage() {
  return (
    <EdukasiDigitalCrudPage
      title="Form Edukasi IMD"
      resourcePath="edukasi-imd"
      view="form"
      listPath="/edukasi-digital/imd"
      fields={[
        { key: "judul", label: "Judul", type: "text" },
        { key: "gambar_url", label: "URL gambar (opsional)", type: "text" },
        { key: "isi", label: "Isi konten", type: "textarea", rows: 6 },
      ]}
    />
  );
}
