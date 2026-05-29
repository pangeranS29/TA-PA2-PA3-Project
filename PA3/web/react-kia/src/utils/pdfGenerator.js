import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN = 15;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

/**
 * Format tanggal ke format Indonesia
 */
const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";
  const date = new Date(tanggal);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format umur dalam format yang readable
 */
const formatUmur = (tanggalLahir) => {
  if (!tanggalLahir) return "-";
  const birthDate = new Date(tanggalLahir);
  const today = new Date();
  let umur = today.getFullYear() - birthDate.getFullYear();
  const bulan = today.getMonth() - birthDate.getMonth();
  if (bulan < 0 || (bulan === 0 && today.getDate() < birthDate.getDate())) {
    umur--;
  }
  return `${umur} tahun`;
};

/**
 * Generate PDF single laporan ibu hamil
 */
export const generatePDFLaporanIbu = async (laporanData, fileName = "Laporan_Ibu_Hamil") => {
  const {
    ibuData,
    kehamilanData,
    ayahData,
    evaluasiKesehatan,
    pemeriksaanKehamilan,
    grafikData,
    lingkunganData,
  } = laporanData;

  const doc = new jsPDF("p", "mm", "A4");
  let currentPage = 1;
  let yPosition = MARGIN;

  const addNewPage = () => {
    doc.addPage();
    currentPage++;
    yPosition = MARGIN;
  };

  const addTitle = (title, fontSize = 16) => {
    if (yPosition > PAGE_HEIGHT - MARGIN - 15) {
      addNewPage();
    }
    doc.setFontSize(fontSize);
    doc.setFont(undefined, "bold");
    doc.text(title, MARGIN, yPosition);
    yPosition += fontSize / 2 + 5;
  };

  const addSubtitle = (subtitle, fontSize = 12) => {
    if (yPosition > PAGE_HEIGHT - MARGIN - 10) {
      addNewPage();
    }
    doc.setFontSize(fontSize);
    doc.setFont(undefined, "bold");
    doc.text(subtitle, MARGIN + 5, yPosition);
    yPosition += fontSize / 2 + 4;
  };

  const addContent = (label, value, fontSize = 10) => {
    if (yPosition > PAGE_HEIGHT - MARGIN - 8) {
      addNewPage();
    }
    doc.setFontSize(fontSize);
    doc.setFont(undefined, "bold");
    doc.text(`${label}:`, MARGIN + 5, yPosition);

    doc.setFont(undefined, "normal");
    const labelWidth = doc.getTextWidth(`${label}: `);
    const maxContentWidth = CONTENT_WIDTH - labelWidth - 10;
    const splitText = doc.splitTextToSize(String(value || "-"), maxContentWidth);

    splitText.forEach((line, index) => {
      if (index === 0) {
        doc.text(line, MARGIN + 5 + labelWidth, yPosition);
      } else {
        yPosition += fontSize / 2 + 2;
        if (yPosition > PAGE_HEIGHT - MARGIN - 8) {
          addNewPage();
        }
        doc.text(line, MARGIN + 5 + labelWidth, yPosition);
      }
    });

    yPosition += fontSize / 2 + 3;
  };

  const addSectionDivider = () => {
    if (yPosition > PAGE_HEIGHT - MARGIN - 10) {
      addNewPage();
    }
    doc.setDrawColor(200);
    doc.line(MARGIN, yPosition, PAGE_WIDTH - MARGIN, yPosition);
    yPosition += 8;
  };

  // ========== PAGE 1: COVER & DATA IBU ==========
  // Header
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text("LAPORAN DATA IBU HAMIL", MARGIN, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text("Sistem Informasi Manajemen Kesehatan Ibu dan Anak", MARGIN, yPosition);
  yPosition += 12;

  addSectionDivider();

  // Data Ibu
  addTitle("DATA IBU HAMIL", 14);
  addContent("Nama Lengkap", ibuData?.nama_lengkap);
  addContent("NIK", ibuData?.nik);
  addContent("No. KK", ibuData?.no_kk);
  addContent("Tanggal Lahir", formatTanggal(ibuData?.tanggal_lahir));
  addContent("Umur", formatUmur(ibuData?.tanggal_lahir));
  addContent("Alamat", ibuData?.alamat);
  addContent("Dusun", ibuData?.dusun);
  addContent("Desa", ibuData?.desa);
  addContent("Kecamatan", ibuData?.kecamatan);
  addContent("No. Telepon", ibuData?.no_hp);
  addContent("Pekerjaan", ibuData?.pekerjaan);
  addContent("Pendidikan", ibuData?.pendidikan_terakhir);

  // Data Kehamilan
  if (kehamilanData) {
    yPosition += 5;
    addSubtitle("Data Kehamilan Saat Ini", 11);
    addContent("Status Kehamilan", kehamilanData?.status_kehamilan);
    addContent("Usia Kehamilan", `${kehamilanData?.usia_kehamilan} minggu`);
    addContent("Tanggal Haid Terakhir", formatTanggal(kehamilanData?.tanggal_haid_terakhir));
    addContent("Taksiran Persalinan", formatTanggal(kehamilanData?.taksiran_persalinan));
    addContent("Paritas", kehamilanData?.paritas);
    addContent("Gravida", kehamilanData?.gravida);
  }

  // ========== PAGE 2: DATA AYAH & KESEHATAN ==========
  if (ayahData) {
    addNewPage();
    addTitle("DATA AYAH/SUAMI", 14);
    addContent("Nama Lengkap", ayahData?.nama_lengkap);
    addContent("NIK", ayahData?.nik);
    addContent("Tanggal Lahir", formatTanggal(ayahData?.tanggal_lahir));
    addContent("Umur", formatUmur(ayahData?.tanggal_lahir));
    addContent("Pekerjaan", ayahData?.pekerjaan);
    addContent("Pendidikan", ayahData?.pendidikan_terakhir);
    addContent("No. Telepon", ayahData?.no_hp);
  }

  // Data Kesehatan Ibu
  if (evaluasiKesehatan) {
    addSectionDivider();
    addTitle("DATA KESEHATAN IBU HAMIL", 14);

    if (Array.isArray(evaluasiKesehatan)) {
      const evalData = evaluasiKesehatan[0];
      if (evalData) {
        addContent("Tekanan Darah", evalData?.tekanan_darah);
        addContent("Berat Badan", `${evalData?.berat_badan} kg`);
        addContent("Tinggi Badan", `${evalData?.tinggi_badan} cm`);
        addContent("LILA", `${evalData?.lila} cm`);
        addContent("Hemoglobin", `${evalData?.hemoglobin} g/dL`);
        addContent("Riwayat Penyakit", evalData?.riwayat_penyakit);
        addContent("Alergi", evalData?.alergi);
        addContent("Status Risiko", evalData?.status_risiko);
        addContent("Catatan Kesehatan", evalData?.catatan);
      }
    } else if (evaluasiKesehatan) {
      addContent("Tekanan Darah", evaluasiKesehatan?.tekanan_darah);
      addContent("Berat Badan", `${evaluasiKesehatan?.berat_badan} kg`);
      addContent("Tinggi Badan", `${evaluasiKesehatan?.tinggi_badan} cm`);
      addContent("LILA", `${evaluasiKesehatan?.lila} cm`);
      addContent("Hemoglobin", `${evaluasiKesehatan?.hemoglobin} g/dL`);
      addContent("Riwayat Penyakit", evaluasiKesehatan?.riwayat_penyakit);
      addContent("Alergi", evaluasiKesehatan?.alergi);
      addContent("Status Risiko", evaluasiKesehatan?.status_risiko);
      addContent("Catatan Kesehatan", evaluasiKesehatan?.catatan);
    }
  }

  // Data Lingkungan
  if (lingkunganData && Array.isArray(lingkunganData) && lingkunganData.length > 0) {
    addSectionDivider();
    addTitle("DATA LINGKUNGAN", 14);
    const lingkungan = lingkunganData[0];
    addContent("Status Air Bersih", lingkungan?.air_bersih);
    addContent("Status Toilet/Kamar Mandi", lingkungan?.toilet);
    addContent("Status Pembuangan Sampah", lingkungan?.sampah);
    addContent("Status Ventilasi", lingkungan?.ventilasi);
    addContent("Catatan Lingkungan", lingkungan?.catatan);
  }

  // ========== PAGE 3: DATA PEMERIKSAAN ANC RUTIN ==========
  if (pemeriksaanKehamilan && pemeriksaanKehamilan.length > 0) {
    addNewPage();
    addTitle("RIWAYAT PEMERIKSAAN ANC RUTIN", 14);

    // Tabel data pemeriksaan
    const pemeriksaanData = pemeriksaanKehamilan.slice(0, 8).map((p) => [
      formatTanggal(p?.tanggal_periksa),
      `${p?.usia_kehamilan} mg`,
      p?.tekanan_darah || "-",
      `${p?.berat_badan} kg`,
      `${p?.tinggi_fundus} cm`,
      p?.denyut_jantung_janin || "-",
      p?.status_risiko || "-",
    ]);

    // Table headers
    const headers = ["Tanggal", "Usia", "TD", "BB", "TFU", "DJJ", "Risiko"];
    const columnWidths = [35, 20, 20, 20, 20, 20, 25];

    let tableY = yPosition;
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.setFillColor(220, 220, 220);

    // Draw headers
    let xPos = MARGIN;
    headers.forEach((header, i) => {
      doc.rect(xPos, tableY, columnWidths[i], 8, "F");
      doc.text(header, xPos + 2, tableY + 5, { maxWidth: columnWidths[i] - 4 });
      xPos += columnWidths[i];
    });

    tableY += 8;
    doc.setFont(undefined, "normal");
    doc.setFillColor(255, 255, 255);

    // Draw data rows
    pemeriksaanData.forEach((row, rowIndex) => {
      if (tableY > PAGE_HEIGHT - MARGIN - 15) {
        addNewPage();
        tableY = yPosition;
      }

      xPos = MARGIN;
      row.forEach((cell, colIndex) => {
        doc.rect(xPos, tableY, columnWidths[colIndex], 8);
        doc.text(String(cell), xPos + 2, tableY + 5, {
          maxWidth: columnWidths[colIndex] - 4,
        });
        xPos += columnWidths[colIndex];
      });

      tableY += 8;
    });

    yPosition = tableY + 5;

    // Info pemeriksaan
    if (pemeriksaanKehamilan.length > 0) {
      addContent(
        "Total Pemeriksaan",
        `${pemeriksaanKehamilan.length} kali`
      );
      addContent(
        "Pemeriksaan Terakhir",
        formatTanggal(pemeriksaanKehamilan[pemeriksaanKehamilan.length - 1]?.tanggal_periksa)
      );
    }
  }

  // ========== PAGE 4: GRAFIK (jika ada) ==========
  if (grafikData) {
    addNewPage();
    addTitle("GRAFIK PEMERIKSAAN KESEHATAN IBU", 14);

    // Create chart summary from graph data
    if (Array.isArray(grafikData) && grafikData.length > 0) {
      addSubtitle("Data Tekanan Darah", 11);
      
      // Extract and display blood pressure data
      const bpData = grafikData.filter(d => d.tekanan_darah);
      if (bpData.length > 0) {
        addContent("Tekanan Darah Terendah", bpData[bpData.length - 1]?.tekanan_darah);
        addContent("Tekanan Darah Tertinggi", bpData[0]?.tekanan_darah);
        addContent("Total Pemeriksaan TD", `${bpData.length} kali`);
      }

      yPosition += 3;
      addSubtitle("Data Berat Badan", 11);
      
      // Extract and display weight data
      const bbData = grafikData.filter(d => d.berat_badan);
      if (bbData.length > 0) {
        addContent("BB Awal", `${bbData[bbData.length - 1]?.berat_badan} kg`);
        addContent("BB Terakhir", `${bbData[0]?.berat_badan} kg`);
        const totalGain = parseFloat(bbData[0]?.berat_badan) - parseFloat(bbData[bbData.length - 1]?.berat_badan);
        addContent("Penambahan BB", `${totalGain.toFixed(1)} kg`);
      }

      yPosition += 3;
      addSubtitle("Data Denyut Jantung Janin (DJJ)", 11);
      
      // Extract and display fetal heart rate data
      const dJJData = grafikData.filter(d => d.denyut_jantung_janin && d.denyut_jantung_janin !== "-");
      if (dJJData.length > 0) {
        const dJJValues = dJJData.map(d => parseInt(d.denyut_jantung_janin)).filter(v => !isNaN(v));
        if (dJJValues.length > 0) {
          addContent("DJJ Terendah", `${Math.min(...dJJValues)} bpm`);
          addContent("DJJ Tertinggi", `${Math.max(...dJJValues)} bpm`);
          addContent("DJJ Rata-rata", `${(dJJValues.reduce((a, b) => a + b) / dJJValues.length).toFixed(0)} bpm`);
        }
      }

      yPosition += 3;
      addSubtitle("Data Tinggi Fundus (TFU)", 11);
      
      // Extract and display TFU data
      const tfuData = grafikData.filter(d => d.tinggi_fundus && d.tinggi_fundus !== "-");
      if (tfuData.length > 0) {
        addContent("TFU Awal", `${tfuData[tfuData.length - 1]?.tinggi_fundus} cm`);
        addContent("TFU Terakhir", `${tfuData[0]?.tinggi_fundus} cm`);
        addContent("Total Pengukuran TFU", `${tfuData.length} kali`);
      }
    } else {
      addContent("Status Grafik", "Data grafik belum tersedia");
    }
  }

  // ========== PAGE AKHIR: TANDA TANGAN & CATATAN ==========
  if (yPosition > PAGE_HEIGHT - MARGIN - 50) {
    addNewPage();
  }

  addSectionDivider();
  yPosition += 20;

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text("Catatan Penting:", MARGIN, yPosition);
  yPosition += 5;
  doc.setFontSize(9);
  const catatan = [
    "1. Laporan ini merupakan rekapitulasi data kesehatan ibu hamil dari Sistem Informasi KIA.",
    "2. Silakan konsultasi dengan petugas kesehatan untuk interpretasi hasil pemeriksaan.",
    "3. Jaga kesehatan dengan melakukan ANC rutin sesuai jadwal yang ditetapkan.",
    "4. Laporkan kepada petugas kesehatan jika ada keluhan atau perubahan kondisi kesehatan.",
  ];
  doc.text(catatan, MARGIN, yPosition, { maxWidth: CONTENT_WIDTH });

  yPosition += 35;
  doc.setFontSize(10);
  doc.text("Tanggal Cetak: " + formatTanggal(new Date()), MARGIN, yPosition);

  // Save PDF
  doc.save(`${fileName}_${formatTanggal(new Date()).replace(/\s/g, "_")}.pdf`);
};

/**
 * Generate PDF untuk laporan semua ibu hamil
 */
export const generatePDFLaporanSemuaIbu = async (laporanList, fileName = "Laporan_Semua_Ibu_Hamil") => {
  const doc = new jsPDF("p", "mm", "A4");
  let currentPage = 1;
  let yPosition = MARGIN;

  const addNewPage = () => {
    doc.addPage();
    currentPage++;
    yPosition = MARGIN;
  };

  // Cover page
  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  yPosition = PAGE_HEIGHT / 2 - 30;
  doc.text("LAPORAN DATA IBU HAMIL", PAGE_WIDTH / 2, yPosition, { align: "center" });

  yPosition += 15;
  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  doc.text("SISTEM INFORMASI MANAJEMEN KESEHATAN IBU DAN ANAK", PAGE_WIDTH / 2, yPosition, {
    align: "center",
  });

  yPosition += 25;
  doc.setFontSize(10);
  doc.text(`Total Ibu Hamil: ${laporanList.length} orang`, PAGE_WIDTH / 2, yPosition, {
    align: "center",
  });

  yPosition += 15;
  doc.text(`Tanggal Cetak: ${formatTanggal(new Date())}`, PAGE_WIDTH / 2, yPosition, {
    align: "center",
  });

  // Tabel ringkasan
  addNewPage();
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text("RINGKASAN DATA IBU HAMIL", MARGIN, yPosition);
  yPosition += 10;

  const summaryData = laporanList.map((laporan, index) => [
    String(index + 1),
    laporan.ibuData?.nama_lengkap || "-",
    laporan.ibuData?.nik || "-",
    laporan.kehamilanData?.status_kehamilan || "-",
    `${laporan.kehamilanData?.usia_kehamilan || "-"} mg`,
    laporan.ibuData?.dusun || "-",
  ]);

  const headers = ["No", "Nama Ibu", "NIK", "Status", "Usia", "Dusun"];
  const columnWidths = [12, 50, 40, 30, 25, 32];

  let tableY = yPosition;
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.setFillColor(41, 128, 185);
  doc.setTextColor(255, 255, 255);

  let xPos = MARGIN;
  headers.forEach((header, i) => {
    doc.rect(xPos, tableY, columnWidths[i], 7, "F");
    doc.text(header, xPos + 1, tableY + 4, { maxWidth: columnWidths[i] - 2 });
    xPos += columnWidths[i];
  });

  tableY += 7;
  doc.setFont(undefined, "normal");
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(240, 240, 240);

  summaryData.forEach((row, rowIndex) => {
    if (tableY > PAGE_HEIGHT - MARGIN - 10) {
      addNewPage();
      tableY = yPosition;
    }

    xPos = MARGIN;
    row.forEach((cell, colIndex) => {
      const isEvenRow = rowIndex % 2 === 0;
      if (isEvenRow) {
        doc.setFillColor(240, 240, 240);
        doc.rect(xPos, tableY, columnWidths[colIndex], 6, "F");
      }
      doc.rect(xPos, tableY, columnWidths[colIndex], 6);
      doc.text(String(cell).substring(0, 20), xPos + 1, tableY + 3.5, {
        maxWidth: columnWidths[colIndex] - 2,
      });
      xPos += columnWidths[colIndex];
    });

    tableY += 6;
  });

  // Save PDF
  doc.save(`${fileName}_${formatTanggal(new Date()).replace(/\s/g, "_")}.pdf`);
};
