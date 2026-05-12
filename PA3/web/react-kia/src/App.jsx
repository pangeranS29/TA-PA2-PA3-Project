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
import { getPostLoginRoute, isAuthenticated } from "./services/auth";

// Data Ibu
import IbuList from "./pages/Ibu/IbuList";
import IbuDetail from "./pages/Ibu/IbuDetail";
import IbuEdit from "./pages/Ibu/IbuEdit";
import SkriningPreeklampsia from "./pages/Ibu/SkriningPreeklampsia";
import SkriningDMG from"./pages/Ibu/SkriningDMG";
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

//Dokter
import ProtectedRoute from "./components/ProtectedRoute";
import DokterDashboard from "./pages/Dokter/index";
// import PelayananGiziIndex from "./pages/Pelayanan-Gizi-Anak/index";
// import PelayananGiziCreate from "./pages/Pelayanan-Gizi-Anak/create";
import PelayananVitaminIndex from "./pages/Pelayanan-Vitamin-Anak/index";
import PelayananVitaminCreate from "./pages/Pelayanan-Vitamin-Anak/create";
import PelayananImunisasiIndex from "./pages/Pelayanan-Imunisasi-Anak/index";
import PelayananGigiIndex from "./pages/PelayananGigi/index";
import TumbuhKembangAnak from "./pages/SDIDTK/index";
// import NeonatusIndex from "./pages/Kesehatan-Neonatus/NeonatusIndex";

// Pelayanan LILA Anak
import PelayananLilaGlobalList from "./pages/Pelayanan-LILA-Anak/GlobalList";
import PelayananLilaIndex from "./pages/Pelayanan-LILA-Anak/index";
import PelayananLilaCreate from "./pages/Pelayanan-LILA-Anak/create";
import PelayananLilaEdit from "./pages/Pelayanan-LILA-Anak/edit";

// Pemantauan
import KelolaPemantauan from "./pages/Pemantauan-anak/KelolaPemantauan";
import LihatDataPemantauan from "./pages/Pemantauan-anak/LihatDataPemantauan";

// Pencatatan
import KesehatanLingkunganCatatanPage from "./pages/Pencatatan/KesehatanLingkunganCatatan";
import InformasiUmumPage from "./pages/edukasi-digital/InformasiUmumPage";
import InformasiUmumFormPage from "./pages/edukasi-digital/InformasiUmumFormPage";
import TandaBahayaTrimesterPage from "./pages/edukasi-digital/TandaBahayaTrimesterPage";
import TandaBahayaTrimesterFormPage from "./pages/edukasi-digital/TandaBahayaTrimesterFormPage";
import TandaMelahirkanPage from "./pages/edukasi-digital/TandaMelahirkanPage";
import TandaMelahirkanFormPage from "./pages/edukasi-digital/TandaMelahirkanFormPage";
import ImdPage from "./pages/edukasi-digital/ImdPage";
import ImdFormPage from "./pages/edukasi-digital/ImdFormPage";
import SetelahMelahirkanPage from "./pages/edukasi-digital/SetelahMelahirkanPage";
import SetelahMelahirkanFormPage from "./pages/edukasi-digital/SetelahMelahirkanFormPage";
import MenyusuiAsiPage from "./pages/edukasi-digital/MenyusuiAsiPage";
import MenyusuiAsiFormPage from "./pages/edukasi-digital/MenyusuiAsiFormPage";
import NifasPage from "./pages/edukasi-digital/NifasPage";
import NifasFormPage from "./pages/edukasi-digital/NifasFormPage";
import PolaAsuhPage from "./pages/edukasi-digital/PolaAsuhPage";
import PolaAsuhFormPage from "./pages/edukasi-digital/PolaAsuhFormPage";
import KesehatanMentalPage from "./pages/edukasi-digital/KesehatanMentalPage";
import KesehatanMentalFormPage from "./pages/edukasi-digital/KesehatanMentalFormPage";
import PerawatanAnakPage from "./pages/edukasi-digital/PerawatanAnakPage";
import PerawatanAnakFormPage from "./pages/edukasi-digital/PerawatanAnakFormPage";
import MpasiPage from "./pages/edukasi-digital/MpasiPage";
import MpasiFormPage from "./pages/edukasi-digital/MpasiFormPage";
import KeluhanAnak from "./pages/Anak/Keluhan/KeluhanAnak";
import PemantauanAnakPage from "./pages/Anak/Pemantauan/PemantauanAnakPage";
import PerkembanganAnakPage from "./pages/Anak/Perkembangan/PerkembanganAnakPage";
import LihatDataPerkembangan from "./pages/penanda-perkembangan-anak/LihatDataPerkembangan";
import KelolaPerkembangan from "./pages/penanda-perkembangan-anak/KelolaPerkembangan";
import KelolaLingkungan from "./pages/KesehatanLingkungan/KelolaLingkungan";
import DataLingkungan from "./pages/KesehatanLingkungan/DataLingkungan";
import DetailLembarLingkungan from "./pages/KesehatanLingkungan/DetailLembarLingkungan";
import PertumbuhanIndex from "./pages/Pertumbuhan/index";

// Manajemen Bidan Kader
import PosyanduList from "./pages/ManajemenBidanKader/PosyanduList";
import BidanList from "./pages/ManajemenBidanKader/BidanList";
import KaderList from "./pages/ManajemenBidanKader/KaderList";

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
          <Route path="/dashboard/bidan" element={<Dashboard />} />
          
          {/* Kependudukan */}
          <Route path="/kependudukan" element={<KependudukanList />} />
          <Route path="/kependudukan/create" element={<KependudukanCreate />} />
          <Route path="/kependudukan/edit/:id" element={<KependudukanEdit />} />

          {/* Manajemen Bidan Kader & Posyandu */}
          <Route path="/manajemen-posyandu" element={<PosyanduList />} />
          <Route path="/manajemen-bidan" element={<BidanList />} />
          <Route path="/manajemen-kader" element={<KaderList />} />

          {/* Data Ibu */}
          <Route path="/data-ibu/create" element={<IbuCreate />} />
          <Route path="/data-ibu" element={<IbuList />} />
          <Route path="/data-ibu/:id" element={<IbuDetail />} />
          <Route path="/data-ibu/:id/edit" element={<IbuEdit />} />
          {/* <Route path="/data-ibu/:id/rencana-persalinan" element={<RencanaPersalinanRedirect />} /> */}
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
          <Route path="/data-ibu/:id/Skrining-Diabetes-Melitus-Gestasional" element={<SkriningDMG />} />
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
        </Route>

        {/* ── RUTE ANAK (tanpa auth wrapper) ── */}
        <Route path="/data-anak/dashboard/:id" element={<AnakDashboard />} />
        <Route path="/data-anak/pertumbuhan/:id" element={<PertumbuhanIndex />} />
        <Route path="/data-anak/neonatus/:id" element={<NeonatusIndex />} />
        <Route path="/data-anak/pelayanan-gizi/:id" element={<PelayananGiziIndex />} />
        <Route path="/data-anak/pelayanan-gizi/:id/create" element={<PelayananGiziCreate />} />
        <Route path="/data-anak/pelayanan-vitamin/:id" element={<PelayananVitaminIndex />} />
        <Route path="/data-anak/pelayanan-vitamin/:id/create" element={<PelayananVitaminCreate />} />
        <Route path="/data-anak/pelayanan-Imunisasi/:id" element={<PelayananImunisasiIndex />} />
        <Route path="/data-anak/pelayanan-Gigi/:id" element={<PelayananGigiIndex />} />
        <Route path="/data-anak/Tumbuh-kembang-Anak/:id" element={<TumbuhKembangAnak />} />
        <Route path="/data-anak/lila" element={<PelayananLilaGlobalList />} />
        <Route path="/data-anak/lila/:id" element={<PelayananLilaIndex />} />
        <Route path="/data-anak/lila/:id/create" element={<PelayananLilaCreate />} />
        <Route path="/data-anak/lila/:id/edit/:lilaId" element={<PelayananLilaEdit />} />
        <Route path="/data-anak/keluhan/:id" element={<KeluhanAnak />} />
        <Route path="/data-anak/pemantauan/:id" element={<PemantauanAnakPage />} />
        <Route path="/data-anak/perkembangan/:id" element={<PerkembanganAnakPage />} />

        <Route path="/dashboard/dokter" element={<ProtectedRoute allowedRoles={["dokter"]}> <Dashboard /></ProtectedRoute>}/>
        {/* ── PEMANTAUAN & PERKEMBANGAN ── */}
        <Route path="/pemantauan/lihat" element={<LihatDataPemantauan />} />
        <Route path="/pemantauan/perkembangan" element={<LihatDataPerkembangan />} />
        <Route path="/pemantauan/kelola-perkembangan" element={<KelolaPerkembangan />} />
        <Route path="/pemantauan/kelola" element={<KelolaPemantauan />} />

        {/* ── PENCATATAN ── */}
        <Route path="/pencatatan/kesehatan-lingkungan" element={<DataLingkungan />} />
        <Route path="/pencatatan/kesehatan-lingkungan/kelola" element={<KelolaLingkungan />} />
        <Route path="/pencatatan/kesehatan-lingkungan/detail/:id" element={<DetailLembarLingkungan />} />

        {/* ── EDUKASI DIGITAL ── */}
        <Route path="/edukasi-digital/informasi-umum" element={<InformasiUmumPage />} />
        <Route path="/edukasi-digital/informasi-umum/form" element={<InformasiUmumFormPage />} />
        <Route path="/edukasi-digital/informasi-umum/form/:id" element={<InformasiUmumFormPage />} />
        <Route path="/edukasi-digital/tanda-bahaya-trimester" element={<TandaBahayaTrimesterPage />} />
        <Route path="/edukasi-digital/tanda-bahaya-trimester/form" element={<TandaBahayaTrimesterFormPage />} />
        <Route path="/edukasi-digital/tanda-bahaya-trimester/form/:id" element={<TandaBahayaTrimesterFormPage />} />
        <Route path="/edukasi-digital/tanda-melahirkan" element={<TandaMelahirkanPage />} />
        <Route path="/edukasi-digital/tanda-melahirkan/form" element={<TandaMelahirkanFormPage />} />
        <Route path="/edukasi-digital/tanda-melahirkan/form/:id" element={<TandaMelahirkanFormPage />} />
        <Route path="/edukasi-digital/imd" element={<ImdPage />} />
        <Route path="/edukasi-digital/imd/form" element={<ImdFormPage />} />
        <Route path="/edukasi-digital/imd/form/:id" element={<ImdFormPage />} />
        <Route path="/edukasi-digital/setelah-melahirkan" element={<SetelahMelahirkanPage />} />
        <Route path="/edukasi-digital/setelah-melahirkan/form" element={<SetelahMelahirkanFormPage />} />
        <Route path="/edukasi-digital/setelah-melahirkan/form/:id" element={<SetelahMelahirkanFormPage />} />
        <Route path="/edukasi-digital/menyusui-asi" element={<MenyusuiAsiPage />} />
        <Route path="/edukasi-digital/menyusui-asi/form" element={<MenyusuiAsiFormPage />} />
        <Route path="/edukasi-digital/menyusui-asi/form/:id" element={<MenyusuiAsiFormPage />} />
        <Route path="/edukasi-digital/nifas" element={<NifasPage />} />
        <Route path="/edukasi-digital/nifas/form" element={<NifasFormPage />} />
        <Route path="/edukasi-digital/nifas/form/:id" element={<NifasFormPage />} />
        <Route path="/edukasi-digital/pola-asuh" element={<PolaAsuhPage />} />
        <Route path="/edukasi-digital/pola-asuh/form" element={<PolaAsuhFormPage />} />
        <Route path="/edukasi-digital/pola-asuh/form/:id" element={<PolaAsuhFormPage />} />
        <Route path="/edukasi-digital/kesehatan-mental" element={<KesehatanMentalPage />} />
        <Route path="/edukasi-digital/kesehatan-mental/form" element={<KesehatanMentalFormPage />} />
        <Route path="/edukasi-digital/kesehatan-mental/form/:id" element={<KesehatanMentalFormPage />} />
        <Route path="/edukasi-digital/perawatan-anak" element={<PerawatanAnakPage />} />
        <Route path="/edukasi-digital/perawatan-anak/form" element={<PerawatanAnakFormPage />} />
        <Route path="/edukasi-digital/perawatan-anak/form/:id" element={<PerawatanAnakFormPage />} />
        <Route path="/edukasi-digital/mpasi" element={<MpasiPage />} />
        <Route path="/edukasi-digital/mpasi/form" element={<MpasiFormPage />} />
        <Route path="/edukasi-digital/mpasi/form/:id" element={<MpasiFormPage />} />

        {/* ── DOKTER ── */}
        <Route path="/dashboard/dokter" element={<ProtectedRoute allowedRoles={["dokter"]}><DokterDashboard /></ProtectedRoute>} />

        {/* ── DEFAULT ── */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;