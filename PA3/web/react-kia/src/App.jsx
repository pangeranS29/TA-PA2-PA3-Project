// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/Private-routes";

// Data Ibu
import IbuList from "./pages/Ibu/IbuList";
import IbuDetail from "./pages/Ibu/IbuDetail";
import IbuEdit from "./pages/Ibu/IbuEdit";
import SkriningPreeklampsia from "./pages/Ibu/SkriningPreeklampsia";
import PemeriksaanFisik from "./pages/Ibu/PemeriksaanFisik";
import GrafikEvaluasi from "./pages/Ibu/GrafikEvaluasi";
import RencanaPersalinan from "./pages/Ibu/RencanaPersalinan";
import PelayananNifas from "./pages/Ibu/PelayananNifas";
import EvaluasiKesehatanIbu from "./pages/Ibu/EvaluasiKesehatanIbu";
import PemeriksaanDokterT1 from "./pages/Ibu/PemeriksaanDokterT1";
import PemeriksaanLabJiwa from "./pages/Ibu/PemeriksaanLabJiwa";
import CatatanPelayanan from "./pages/Ibu/CatatanPelayanan";
import PemeriksaanDokterT3 from "./pages/Ibu/PemeriksaanDokterT3";
import PemeriksaanLanjutanT3 from "./pages/Ibu/PemeriksaanLanjutanT3";
import RujukanPage from "./pages/Ibu/Rujukan";
import SkriningDMGestasional from "./pages/Ibu/SkriningDMGestasional";
import PelayananPersalinan from "./pages/Ibu/PelayananPersalinan";
import PemeriksaanKehamilanList from "./pages/Ibu/PemeriksaanKehamilanList";
import PemeriksaanKehamilanForm from "./pages/Ibu/PemeriksaanKehamilanForm";
import RujukanDashboard from "./pages/Ibu/RujukanDashboard";

// Data Anak (sudah ada)
import AnakListNakes from "./pages/Anak";
import CreateAnak from "./pages/Anak/create";
import EditAnak from "./pages/Anak/edit";
import DetailAnak from "./pages/Anak/detail";
// Monitoring & Laporan
import Monitoring from "./pages/Monitoring";
import Laporan from "./pages/Laporan";
import IbuCreate from "./pages/Ibu/IbuCreate";
import KependudukanList from "./pages/Kependudukan/KependudukanList";
import KependudukanCreate from "./pages/Kependudukan/KependudukanCreate";
import KependudukanEdit from "./pages/Kependudukan/KependudukanEdit";

import AnakDashboard from "./pages/Anak/Dashboard"
import PelayananGiziIndex from "./pages/Pelayanan-Gizi-Anak/index"
// import PrivateRoute from "./routes/Private-routes";
import PelayananGiziCreate from "./pages/Pelayanan-Gizi-Anak/create";
import PelayananVitaminIndex from"./pages/Pelayanan-Vitamin-Anak/index"
// import PelayananVitaminCreate from"./pages/Pelayanan-Vitamin-Anak/create"
// import PelayananImunisasiIndex from"./pages/Pelayanan-Imunisasi-Anak/index"
// import PelayananGigiIndex from"./pages/PelayananGigi/index"
// import TumbuhKembangAnak from"./pages/SDIDTK/index"
import NeonatusIndex from "./pages/Kesehatan-Neonatus/NeonatusIndex"

// import PelayananVitaminIndex from"./pages/Pelayanan-Vitamin-Anak/index"
import PelayananVitaminCreate from"./pages/Pelayanan-Vitamin-Anak/create"
import PelayananImunisasiIndex from"./pages/Pelayanan-Imunisasi-Anak/index"
import PelayananGigiIndex from"./pages/PelayananGigi/index"
import TumbuhKembangAnak from"./pages/SDIDTK/index"
import PelayananLilaIndex from "./pages/Pelayanan-LILA-Anak/index";
import PelayananLilaCreate from "./pages/Pelayanan-LILA-Anak/create";
import PelayananLilaEdit from "./pages/Pelayanan-LILA-Anak/edit";
import KelolaPemantauan from "./pages/Pemantauan/KelolaPemantauan";
import LihatDataPemantauan from "./pages/Pemantauan/LihatDataPemantauan";
import KesehatanLingkunganCatatanPage from "./pages/Pencatatan/KesehatanLingkunganCatatan";
import InformasiUmumPage from "./pages/edukasi-digital/InformasiUmumPage";
import InformasiUmumFormPage from "./pages/edukasi-digital/InformasiUmumFormPage";
import TandaBahayaTrimesterPage from "./pages/edukasi-digital/TandaBahayaTrimesterPage";
import TandaMelahirkanPage from "./pages/edukasi-digital/TandaMelahirkanPage";
import ImdPage from "./pages/edukasi-digital/ImdPage";
import SetelahMelahirkanPage from "./pages/edukasi-digital/SetelahMelahirkanPage";
import MenyusuiAsiPage from "./pages/edukasi-digital/MenyusuiAsiPage";
import PolaAsuhPage from "./pages/edukasi-digital/PolaAsuhPage";
import KesehatanMentalPage from "./pages/edukasi-digital/KesehatanMentalPage";
import ImdFormPage from "./pages/edukasi-digital/ImdFormPage";
import KesehatanMentalFormPage from "./pages/edukasi-digital/KesehatanMentalFormPage";
import MenyusuiAsiFormPage from "./pages/edukasi-digital/MenyusuiAsiFormPage";
import PolaAsuhFormPage from "./pages/edukasi-digital/PolaAsuhFormPage";
import SetelahMelahirkanFormPage from "./pages/edukasi-digital/SetelahMelahirkanFormPage";
import TandaBahayaTrimesterFormPage from "./pages/edukasi-digital/TandaBahayaTrimesterFormPage";
import TandaMelahirkanFormPage from "./pages/edukasi-digital/TandaMelahirkanFormPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* // tambahkan route */}
          <Route path="/kependudukan" element={<KependudukanList />} />
          <Route path="/kependudukan/create" element={<KependudukanCreate />} />
          <Route path="/kependudukan/edit/:id" element={<KependudukanEdit />} />
          <Route path="/pencatatan/kesehatan-lingkungan" element={<KesehatanLingkunganCatatanPage />} />
          {/* Data Ibu */}
          <Route path="/data-ibu/create" element={<IbuCreate />} />
          <Route path="/data-ibu" element={<IbuList />} />
          <Route path="/data-ibu/:id" element={<IbuDetail />} />
          <Route path="/data-ibu/:id/edit" element={<IbuEdit />} />
          <Route path="/data-ibu/:id/skrining-preeklampsia" element={<SkriningPreeklampsia />} />
          <Route path="/data-ibu/:id/pemeriksaan-fisik" element={<PemeriksaanFisik />} />
          <Route path="/data-ibu/:id/grafik-evaluasi" element={<GrafikEvaluasi />} />
          <Route path="/data-ibu/:id/rencana-persalinan" element={<RencanaPersalinan />} />
          <Route path="/data-ibu/:id/pelayanan-nifas" element={<PelayananNifas />} />
          <Route path="/data-ibu/:id/evaluasi-kesehatan" element={<EvaluasiKesehatanIbu />} />
          <Route path="/data-ibu/:id/pemeriksaan-dokter-t1" element={<PemeriksaanDokterT1 />} />
          <Route path="/data-ibu/:id/pemeriksaan-lab-jiwa" element={<PemeriksaanLabJiwa />} />
          <Route path="/data-ibu/:id/catatan-pelayanan" element={<CatatanPelayanan />} />
          <Route path="/data-ibu/:id/pemeriksaan-dokter-t3" element={<PemeriksaanDokterT3 />} />
          <Route path="/data-ibu/:id/pemeriksaan-lanjutan-t3" element={<PemeriksaanLanjutanT3 />} />
          <Route path="/data-ibu/:id/rujukan" element={<RujukanPage />} />
          <Route path="/data-ibu/:id/skrining-dm-gestasional" element={<SkriningDMGestasional />} />
          <Route path="/data-ibu/:id/pelayanan-persalinan" element={<PelayananPersalinan />} />
          <Route path="/data-ibu/:id/pemeriksaan-rutin" element={<PemeriksaanKehamilanList />} />
          <Route path="/data-ibu/:id/pemeriksaan-rutin/:periksaId" element={<PemeriksaanKehamilanForm />} />
          <Route path="/daftar-rujukan" element={<RujukanDashboard />} />
          

          {/* Data Anak (sudah ada) */}
          <Route path="/daftar-anak" element={<AnakListNakes />} />
          <Route path="/data-anak/create" element={<CreateAnak />} />
          <Route path="/data-anak/edit/:id" element={<EditAnak />} />
          <Route path="/data-anak/:id" element={<DetailAnak />} />

          {/* Monitoring & Laporan */}
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/pemantauan/kelola" element={<KelolaPemantauan />} />
          <Route path="/pemantauan/lihat" element={<LihatDataPemantauan />} />
           <Route path="/edukasi-digital/informasi-umum" element={<InformasiUmumPage />} />
           <Route path="/edukasi-digital/informasi-umum/form" element={<InformasiUmumFormPage />} />
           <Route path="/edukasi-digital/informasi-umum/form/:id" element={<InformasiUmumFormPage />} />
           <Route path="/edukasi-digital/imd" element={<ImdPage />} />
           <Route path="/edukasi-digital/imd/form" element={<ImdFormPage />} />
           <Route path="/edukasi-digital/imd/form/:id" element={<ImdFormPage />} />
           <Route path="/edukasi-digital/kesehatan-mental" element={<KesehatanMentalPage />} />
           <Route path="/edukasi-digital/kesehatan-mental/form" element={<KesehatanMentalFormPage />} />
           <Route path="/edukasi-digital/kesehatan-mental/form/:id" element={<KesehatanMentalFormPage />} />
           <Route path="/edukasi-digital/menyusui-asi" element={<MenyusuiAsiPage />} />
           <Route path="/edukasi-digital/menyusui-asi/form" element={<MenyusuiAsiFormPage />} />
           <Route path="/edukasi-digital/menyusui-asi/form/:id" element={<MenyusuiAsiFormPage />} />
           <Route path="/edukasi-digital/pola-asuh" element={<PolaAsuhPage />} />
           <Route path="/edukasi-digital/pola-asuh/form" element={<PolaAsuhFormPage />} />
           <Route path="/edukasi-digital/pola-asuh/form/:id" element={<PolaAsuhFormPage />} />
           <Route path="/edukasi-digital/setelah-melahirkan" element={<SetelahMelahirkanPage />} />
           <Route path="/edukasi-digital/setelah-melahirkan/form" element={<SetelahMelahirkanFormPage />} />
           <Route path="/edukasi-digital/setelah-melahirkan/form/:id" element={<SetelahMelahirkanFormPage />} />
           <Route path="/edukasi-digital/tanda-bahaya-trimester" element={<TandaBahayaTrimesterPage />} />
           <Route path="/edukasi-digital/tanda-bahaya-trimester/form" element={<TandaBahayaTrimesterFormPage />} />
           <Route path="/edukasi-digital/tanda-bahaya-trimester/form/:id" element={<TandaBahayaTrimesterFormPage />} />
           <Route path="/edukasi-digital/tanda-melahirkan" element={<TandaMelahirkanPage />} />
           <Route path="/edukasi-digital/tanda-melahirkan/form" element={<TandaMelahirkanFormPage />} />
           <Route path="/edukasi-digital/tanda-melahirkan/form/:id" element={<TandaMelahirkanFormPage />} />
           <Route path="/edukasi-digital/tanda-bahaya-trimester" element={<TandaBahayaTrimesterPage />} />
           <Route path="/edukasi-digital/tanda-melahirkan" element={<TandaMelahirkanPage />} />
           <Route path="/edukasi-digital/imd" element={<ImdPage />} />
           <Route path="/edukasi-digital/setelah-melahirkan" element={<SetelahMelahirkanPage />} />
           <Route path="/edukasi-digital/menyusui-asi" element={<MenyusuiAsiPage />} />
           <Route path="/edukasi-digital/pola-asuh" element={<PolaAsuhPage />} />
           <Route path="/edukasi-digital/kesehatan-mental" element={<KesehatanMentalPage />} />
          <Route path="/laporan" element={<Laporan />} />
        </Route>
          <Route path="/data-anak/dashboard/:id" element= {<AnakDashboard/>} />
          <Route path="/data-anak/neonatus/:id" element= {<NeonatusIndex/>} />    
          <Route path="/data-anak/pelayanan-gizi/:id" element= {<PelayananGiziIndex/>}></Route>
          <Route path="/data-anak/pelayanan-gizi/:id/create" element={<PelayananGiziCreate/>}></Route>
          <Route path="/data-anak/pelayanan-vitamin/:id" element={<PelayananVitaminIndex />} />
          <Route path="/data-anak/pelayanan-vitamin/:id/create" element={<PelayananVitaminCreate />} />
          <Route path="/data-anak/pelayanan-Imunisasi/:id" element={<PelayananImunisasiIndex />} />
          <Route path="/data-anak/pelayanan-Gigi/:id" element={<PelayananGigiIndex/>}></Route>
          <Route path="/data-anak/Tumbuh-kembang-Anak/:id" element= {<TumbuhKembangAnak/>}></Route>          
          <Route path="/data-anak/lila/:id" element={<PelayananLilaIndex/>}></Route>
          <Route path="/data-anak/lila/:id/create" element={<PelayananLilaCreate/>}></Route>
          <Route path="/data-anak/lila/:id/edit/:lilaId" element={<PelayananLilaEdit/>}></Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;