import React from "react";
import EdukasiDigitalCrudPage from "./EdukasiDigitalCrudPage";

export default function MenyusuiAsiFormPage() {
  return (
    <EdukasiDigitalCrudPage
      title="Form Edukasi Menyusui ASI"
      resourcePath="edukasi-menyusui-asi"
      view="form"
      listPath="/edukasi-digital/menyusui-asi"
      fields={[
        { key: "judul", label: "Judul", type: "text" },
        { key: "gambar_url", label: "URL gambar (opsional)", type: "text" },
        { key: "isi", label: "Isi konten", type: "textarea", rows: 6 },
      ]}
    />
  );
}
