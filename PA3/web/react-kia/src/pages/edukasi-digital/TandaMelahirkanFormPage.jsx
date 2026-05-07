import React from "react";
import EdukasiDigitalCrudPage from "./EdukasiDigitalCrudPage";

export default function TandaMelahirkanFormPage() {
  return (
    <EdukasiDigitalCrudPage
      title="Form Edukasi Tanda Melahirkan"
      resourcePath="edukasi-tanda-melahirkan"
      view="form"
      listPath="/edukasi-digital/tanda-melahirkan"
      fields={[
        { key: "judul", label: "Judul", type: "text" },
        { key: "gambar_url", label: "URL gambar (opsional)", type: "text" },
        { key: "ringkasan", label: "Ringkasan (singkat)", type: "textarea", rows: 2 },
        { key: "isi", label: "Isi konten", type: "textarea", rows: 6 },
      ]}
    />
  );
}
