import React from "react";
import EdukasiDigitalCrudPage from "./EdukasiDigitalCrudPage";

export default function TandaBahayaTrimesterFormPage() {
  return (
    <EdukasiDigitalCrudPage
      title="Form Edukasi Tanda Bahaya Trimester"
      resourcePath="edukasi-tanda-bahaya-trimester"
      view="form"
      listPath="/edukasi-digital/tanda-bahaya-trimester"
      fields={[
        { key: "judul", label: "Judul", type: "text" },
        { key: "gambar_url", label: "URL gambar (opsional)", type: "text" },
        { key: "isi", label: "Isi konten", type: "textarea", rows: 6 },
      ]}
    />
  );
}
