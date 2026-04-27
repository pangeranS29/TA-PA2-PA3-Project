import React from "react";
import EdukasiDigitalCrudPage from "./EdukasiDigitalCrudPage";

export default function InformasiUmumFormPage() {
  return (
    <EdukasiDigitalCrudPage
      title="Form Edukasi Informasi Umum"
      resourcePath="edukasi-informasi-umum"
      view="form"
      listPath="/edukasi-digital/informasi-umum"
      fields={[
        { key: "judul", label: "Judul", type: "text" },
        { key: "gambar_url", label: "URL gambar (opsional)", type: "text" },
        { key: "deskripsi", label: "Deskripsi", type: "textarea", rows: 2 },
        { key: "isi_konten", label: "Isi konten", type: "textarea", rows: 6 },
        { key: "materi_inti", label: "Materi inti", type: "textarea", rows: 2 },
        { key: "hal_penting", label: "Hal penting", type: "textarea", rows: 2 },
      ]}
    />
  );
}
