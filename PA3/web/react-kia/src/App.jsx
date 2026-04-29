import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/Private-routes";
import RencanaPersalinanForm from './pages/Ibu/RencanaPersalinanForm';
import RencanaPersalinanDetail from './pages/Ibu/RencanaPersalinanDetail';
import RencanaPersalinanRedirect from './pages/Ibu/RencanaPersalinanRedirect';
import AdminRoute from "./routes/AdminRoute";
import AdminAkunKeluargaCreate from "./pages/Admin/AkunKeluargaCreate";
import AkunKeluargaManagement from "./pages/Admin/AkunKeluargaManagement";
import TenagaKesehatanManagement from "./pages/Admin/TenagaKesehatanManagement";
import JadwalLayanan from "./pages/Admin/JadwalLayanan";
import { getPostLoginRoute, isAuthenticated } from "./services/auth";

// Data Ibu
import IbuList from "./pages/Ibu/IbuList";
import IbuDetail from "./pages/Ibu/IbuDetail";
import IbuEdit from "./pages/Ibu/IbuEdit";
import SkriningPreeklampsia from "./pages/Ibu/SkriningPreeklampsia";
import PemeriksaanFisik from "./pages/Ibu/PemeriksaanFisik";
import GrafikEvaluasiKehamilan from "./pages/Ibu/GrafikEvaluasiKehamilan";
import GrafikPeningkatanBB from "./pages/Ibu/GrafikPeningkatanBB";
import RencanaPersalinan from "./pages/Ibu/RencanaPersalinan";
import PelayananNifas from "./pages/Ibu/PelayananNifas";
import EvaluasiKesehatanIbu from "./pages/Ibu/EvaluasiKesehatanIbu";
import CatatanPelayanan from "./pages/Ibu/CatatanPelayanan";
import RujukanPage from "./pages/Ibu/Rujukan";
import PelayananPersalinan from "./pages/Ibu/PelayananPersalinan";
import PemeriksaanKehamilanList from "./pages/Ibu/PemeriksaanKehamilanList";
import PemeriksaanKehamilanForm from "./pages/Ibu/PemeriksaanKehamilanForm";
import RujukanDashboard from "./pages/Ibu/RujukanDashboard";
import SkriningDashboard from "./pages/Ibu/SkriningDashboard";
import SkriningDashboardList from "./pages/Ibu/SkriningDashboardList";
import RujukanDisplay from "./pages/Ibu/RujukanDisplay";

// Data Anak
import AnakListNakes from "./pages/Anak";
import CreateAnak from "./pages/Anak/create";
import EditAnak from "./pages/Anak/edit";
import DetailAnak from "./pages/Anak/detail";

// Monitoring & Laporan
import Monitoring from "./pages/Monitoring";
import Laporan from "./pages/Laporan";
import IbuCreate from "./pages/Ibu/IbuCreate";

// Kependudukan
import KependudukanList from "./pages/Kependudukan/KependudukanList";
import KependudukanCreate from "./pages/Kependudukan/KependudukanCreate";
import KependudukanEdit from "./pages/Kependudukan/KependudukanEdit";

// Anak Dashboard & Pelayanan
import AnakDashboard from "./pages/Anak/Dashboard";
import PelayananGiziIndex from "./pages/Pelayanan-Gizi-Anak/index";
import NeonatusIndex from "./pages/Kesehatan-Neonatus/NeonatusIndex";
import PelayananGiziCreate from "./pages/Pelayanan-Gizi-Anak/create";

// Pemeriksaan Dokter Complete T1
import PemeriksaanDokterT1CompleteEntry from "./pages/Ibu/PemeriksaanDokterT1CompleteEntry";
import PemeriksaanDokterT1CompleteDetail from "./pages/Ibu/PemeriksaanDokterT1CompleteDetail";
import PemeriksaanDokterT1Complete from "./pages/Ibu/PemeriksaanDokterT1Complete";

// Pemeriksaan Dokter Complete T3
import PemeriksaanDokterT3CompleteEntry from "./pages/Ibu/PemeriksaanDokterT3CompleteEntry";
import PemeriksaanDokterT3CompleteDetail from "./pages/Ibu/PemeriksaanDokterT3CompleteDetail";
import PemeriksaanDokterT3Complete from "./pages/Ibu/PemeriksaanDokterT3Complete";

const HomeRedirect = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={getPostLoginRoute()} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Kependudukan */}
          <Route path="/kependudukan" element={<KependudukanList />} />
          <Route path="/kependudukan/create" element={<KependudukanCreate />} />
          <Route path="/kependudukan/edit/:id" element={<KependudukanEdit />} />

          {/* Data Ibu */}
          <Route path="/data-ibu/create" element={<IbuCreate />} />
          <Route path="/data-ibu" element={<IbuList />} />
          <Route path="/data-ibu/:id" element={<IbuDetail />} />
          <Route path="/data-ibu/:id/edit" element={<IbuEdit />} />
          <Route path="/data-ibu/:id/rencana-persalinan" element={<RencanaPersalinanRedirect />} />
          <Route path="/data-ibu/:id/rencana-persalinan/form" element={<RencanaPersalinanForm />} />
          <Route path="/data-ibu/:id/rencana-persalinan/detail" element={<RencanaPersalinanDetail />} />

          {/* Pemeriksaan Dokter T1 Complete */}
          <Route path="/data-ibu/:id/pemeriksaan-dokter-t1-complete" element={<PemeriksaanDokterT1CompleteEntry />} />
          <Route path="/data-ibu/:id/pemeriksaan-dokter-t1-complete/detail" element={<PemeriksaanDokterT1CompleteDetail />} />
          <Route path="/data-ibu/:id/pemeriksaan-dokter-t1-complete/form" element={<PemeriksaanDokterT1Complete />} />

          {/* Pemeriksaan Dokter T3 Complete */}
          <Route path="/data-ibu/:id/pemeriksaan-dokter-t3-complete" element={<PemeriksaanDokterT3CompleteEntry />} />
          <Route path="/data-ibu/:id/pemeriksaan-dokter-t3-complete/detail" element={<PemeriksaanDokterT3CompleteDetail />} />
          <Route path="/data-ibu/:id/pemeriksaan-dokter-t3-complete/form" element={<PemeriksaanDokterT3Complete />} />

          {/* Ibu Lainnya */}
          <Route path="/data-ibu/:id/skrining-preeklampsia" element={<SkriningPreeklampsia />} />
          <Route path="/data-ibu/:id/skrining-dashboard" element={<SkriningDashboard />} />
          <Route path="/data-ibu/:id/pemeriksaan-fisik" element={<PemeriksaanFisik />} />
          <Route path="/data-ibu/:id/grafik-evaluasi" element={<GrafikEvaluasiKehamilan />} />
          <Route path="/data-ibu/:id/grafik-bb" element={<GrafikPeningkatanBB />} />
          <Route path="/data-ibu/:id/rencana-persalinan" element={<RencanaPersalinan />} />
          <Route path="/data-ibu/:id/pelayanan-nifas" element={<PelayananNifas />} />
          <Route path="/data-ibu/:id/evaluasi-kesehatan" element={<EvaluasiKesehatanIbu />} />
          <Route path="/data-ibu/:id/catatan-pelayanan" element={<CatatanPelayanan />} />
          <Route path="/data-ibu/:id/rujukan" element={<RujukanPage />} />
          <Route path="/data-ibu/:id/rujukan-display" element={<RujukanDisplay />} />
          <Route path="/data-ibu/:id/pelayanan-persalinan" element={<PelayananPersalinan />} />
          <Route path="/data-ibu/:id/pemeriksaan-rutin" element={<PemeriksaanKehamilanList />} />
          <Route path="/data-ibu/:id/pemeriksaan-rutin/:periksaId" element={<PemeriksaanKehamilanForm />} />
          <Route path="/daftar-rujukan" element={<RujukanDashboard />} />
<Route path="/daftar-skrining" element={<SkriningDashboardList />} />
          
{/* Data Anak */}
          <Route path="/daftar-anak" element={<AnakListNakes />} />
          <Route path="/data-anak/create" element={<CreateAnak />} />
          <Route path="/data-anak/edit/:id" element={<EditAnak />} />
          <Route path="/data-anak/:id" element={<DetailAnak />} />

          {/* Monitoring & Laporan */}
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/laporan" element={<Laporan />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<AdminRoute />}>
          <Route path="/dashboard/admin" element={<Dashboard />} />
          <Route path="/dashboard/admin/akun-keluarga" element={<AdminAkunKeluargaCreate />} />
          <Route path="/dashboard/admin/manajemen-keluarga" element={<AkunKeluargaManagement />} />
          <Route path="/dashboard/admin/tenaga-kesehatan" element={<TenagaKesehatanManagement />} />
          <Route path="/dashboard/admin/jadwal-layanan" element={<JadwalLayanan />} />
        </Route>

        {/* Rute Anak Dashboard & Pelayanan */}
        <Route path="/data-anak/dashboard/:id" element={<AnakDashboard />} />
        <Route path="/data-anak/neonatus/:id" element={<NeonatusIndex />} />
        <Route path="/data-anak/pelayanan-gizi/:id" element={<PelayananGiziIndex />} />
        <Route path="/data-anak/pelayanan-gizi/:id/create" element={<PelayananGiziCreate />} />

        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;