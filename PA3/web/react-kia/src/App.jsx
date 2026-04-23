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
import NeonatusIndex from "./pages/Kesehatan-Neonatus/NeonatusIndex"
import PelayananGiziCreate from "./pages/Pelayanan-Gizi-Anak/create";
import PelayananVitaminIndex from"./pages/Pelayanan-Vitamin-Anak/index"
import PelayananVitaminCreate from"./pages/Pelayanan-Vitamin-Anak/create"
import PelayananImunisasiIndex from"./pages/Pelayanan-Imunisasi-Anak/index"
import PelayananGigiIndex from"./pages/PelayananGigi/index"
import TumbuhKembangAnak from"./pages/SDIDTK/index"


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
          

          {/* Data Anak (sudah ada) */}
          <Route path="/daftar-anak" element={<AnakListNakes />} />
          <Route path="/data-anak/create" element={<CreateAnak />} />
          <Route path="/data-anak/edit/:id" element={<EditAnak />} />
          <Route path="/data-anak/:id" element={<DetailAnak />} />

          {/* Monitoring & Laporan */}
          <Route path="/monitoring" element={<Monitoring />} />
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
          



        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;