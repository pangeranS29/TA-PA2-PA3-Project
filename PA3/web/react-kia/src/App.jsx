// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getPostLoginRoute, isAuthenticated } from "./services/auth";

// Auth & Layout
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/Private-routes";
import AdminRoute from "./routes/AdminRoute";

// Admin
import AdminAkunKeluargaCreate from "./pages/Admin/AkunKeluargaCreate";
import AkunKeluargaManagement from "./pages/Admin/AkunKeluargaManagement";
import TenagaKesehatanManagement from "./pages/Admin/TenagaKesehatanManagement";
import JadwalLayanan from "./pages/Admin/JadwalLayanan";

// Data Ibu
import IbuList from "./pages/Ibu/IbuList";
import IbuCreate from "./pages/Ibu/IbuCreate";
import IbuDetail from "./pages/Ibu/IbuDetail";
import IbuEdit from "./pages/Ibu/IbuEdit";
import SkriningPreeklampsia from "./pages/Ibu/SkriningPreeklampsia";
import PemeriksaanFisik from "./pages/Ibu/PemeriksaanFisik";
import GrafikEvaluasiKehamilan from "./pages/Ibu/GrafikEvaluasiKehamilan";
import GrafikPeningkatanBB from "./pages/Ibu/GrafikPeningkatanBB";
import RencanaPersalinan from "./pages/Ibu/RencanaPersalinan";
import RencanaPersalinanForm from "./pages/Ibu/RencanaPersalinanForm";
import RencanaPersalinanDetail from "./pages/Ibu/RencanaPersalinanDetail";
import RencanaPersalinanRedirect from "./pages/Ibu/RencanaPersalinanRedirect";
import PelayananNifas from "./pages/Ibu/PelayananNifas";
import EvaluasiKesehatanIbu from "./pages/Ibu/EvaluasiKesehatanIbu";
import CatatanPelayanan from "./pages/Ibu/CatatanPelayanan";
import RujukanPage from "./pages/Ibu/Rujukan";
import RujukanDashboard from "./pages/Ibu/RujukanDashboard";
import RujukanDisplay from "./pages/Ibu/RujukanDisplay";
import PelayananPersalinan from "./pages/Ibu/PelayananPersalinan";
import PemeriksaanKehamilanList from "./pages/Ibu/PemeriksaanKehamilanList";
import PemeriksaanKehamilanForm from "./pages/Ibu/PemeriksaanKehamilanForm";
import SkriningDashboard from "./pages/Ibu/SkriningDashboard";
import SkriningDashboardList from "./pages/Ibu/SkriningDashboardList";
import PemeriksaanDokterT1Complete from "./pages/Ibu/PemeriksaanDokterT1Complete";
import PemeriksaanDokterT3Complete from "./pages/Ibu/PemeriksaanDokterT3Complete";

// Data Anak
import AnakListNakes from "./pages/Anak";
import CreateAnak from "./pages/Anak/create";
import EditAnak from "./pages/Anak/edit";
import DetailAnak from "./pages/Anak/detail";
import AnakDashboard from "./pages/Anak/Dashboard";
import PertumbuhanIndex from "./pages/Pertumbuhan/index";

// Kependudukan
import KependudukanList from "./pages/Kependudukan/KependudukanList";
import KependudukanCreate from "./pages/Kependudukan/KependudukanCreate";
import KependudukanEdit from "./pages/Kependudukan/KependudukanEdit";

// Monitoring & Laporan
import Monitoring from "./pages/Monitoring";
import Laporan from "./pages/Laporan";

// Pelayanan Anak
import PelayananGiziIndex from "./pages/Pelayanan-Gizi-Anak/index";
import PelayananGiziCreate from "./pages/Pelayanan-Gizi-Anak/create";
import PelayananVitaminIndex from "./pages/Pelayanan-Vitamin-Anak/index";
import PelayananVitaminCreate from "./pages/Pelayanan-Vitamin-Anak/create";
import PelayananImunisasiIndex from "./pages/Pelayanan-Imunisasi-Anak/index";
import PelayananGigiIndex from "./pages/PelayananGigi/index";
import TumbuhKembangAnak from "./pages/SDIDTK/index";
import NeonatusIndex from "./pages/Kesehatan-Neonatus/NeonatusIndex";

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

// Edukasi Digital
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

        {/* PROTECTED (Bidan/Kader) */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Kependudukan */}
          <Route path="/kependudukan" element={<KependudukanList />} />
          <Route path="/kependudukan/create" element={<KependudukanCreate />} />
          <Route path="/kependudukan/edit/:id" element={<KependudukanEdit />} />

          {/* Data Ibu */}
          <Route path="/data-ibu" element={<IbuList />} />
          <Route path="/data-ibu/create" element={<IbuCreate />} />
          <Route path="/data-ibu/:id" element={<IbuDetail />} />
          <Route path="/data-ibu/:id/edit" element={<IbuEdit />} />
          <Route path="/data-ibu/:id/skrining-preeklampsia" element={<SkriningPreeklampsia />} />
          <Route path="/data-ibu/:id/skrining-dashboard" element={<SkriningDashboard />} />
          <Route path="/data-ibu/:id/pemeriksaan-fisik" element={<PemeriksaanFisik />} />
          <Route path="/data-ibu/:id/grafik-evaluasi" element={<GrafikEvaluasiKehamilan />} />
          <Route path="/data-ibu/:id/grafik-bb" element={<GrafikPeningkatanBB />} />
          <Route path="/data-ibu/:id/rencana-persalinan" element={<RencanaPersalinanRedirect />} />
          <Route path="/data-ibu/:id/rencana-persalinan/form" element={<RencanaPersalinanForm />} />
          <Route path="/data-ibu/:id/rencana-persalinan/detail" element={<RencanaPersalinanDetail />} />
          <Route path="/data-ibu/:id/pelayanan-nifas" element={<PelayananNifas />} />
          <Route path="/data-ibu/:id/evaluasi-kesehatan" element={<EvaluasiKesehatanIbu />} />
          <Route path="/data-ibu/:id/catatan-pelayanan" element={<CatatanPelayanan />} />
          <Route path="/data-ibu/:id/rujukan" element={<RujukanPage />} />
          <Route path="/data-ibu/:id/rujukan-display" element={<RujukanDisplay />} />
          <Route path="/data-ibu/:id/pelayanan-persalinan" element={<PelayananPersalinan />} />
          <Route path="/data-ibu/:id/pemeriksaan-rutin" element={<PemeriksaanKehamilanList />} />
          <Route path="/data-ibu/:id/pemeriksaan-rutin/:periksaId" element={<PemeriksaanKehamilanForm />} />
          <Route path="/data-ibu/:id/pemeriksaan-dokter-t1-complete" element={<PemeriksaanDokterT1Complete />} />
          <Route path="/data-ibu/:id/pemeriksaan-dokter-t3-complete" element={<PemeriksaanDokterT3Complete />} />
          <Route path="/daftar-rujukan" element={<RujukanDashboard />} />
          <Route path="/daftar-skrining" element={<SkriningDashboardList />} />

          {/* Data Anak */}
          <Route path="/daftar-anak" element={<AnakListNakes />} />
          <Route path="/data-anak/create" element={<CreateAnak />} />
          <Route path="/data-anak/edit/:id" element={<EditAnak />} />
          <Route path="/data-anak/:id" element={<DetailAnak />} />
          <Route path="/data-anak/keluhan/:id" element={<KeluhanAnak />} />
          <Route path="/data-anak/pemantauan/:id" element={<PemantauanAnakPage />} />
          <Route path="/data-anak/perkembangan/:id" element={<PerkembanganAnakPage />} />

          {/* Monitoring & Laporan */}
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/laporan" element={<Laporan />} />

          {/* Pemantauan */}
          <Route path="/pemantauan/lihat" element={<LihatDataPemantauan />} />
          <Route path="/pemantauan/perkembangan" element={<LihatDataPerkembangan />} />
          <Route path="/pemantauan/kelola-perkembangan" element={<KelolaPerkembangan />} />
          <Route path="/pemantauan/kelola" element={<KelolaPemantauan />} />

          {/* Pencatatan */}
          <Route path="/pencatatan/kesehatan-lingkungan" element={<DataLingkungan />} />
          <Route path="/pencatatan/kesehatan-lingkungan/kelola" element={<KelolaLingkungan />} />

          {/* Edukasi Digital */}
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

          {/* Pelayanan LILA Anak */}
          <Route path="/data-anak/lila" element={<PelayananLilaGlobalList />} />
          <Route path="/data-anak/lila/:id" element={<PelayananLilaIndex />} />
          <Route path="/data-anak/lila/:id/create" element={<PelayananLilaCreate />} />
          <Route path="/data-anak/lila/:id/edit/:lilaId" element={<PelayananLilaEdit />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<AdminRoute />}>
          <Route path="/dashboard/admin" element={<Dashboard />} />
          <Route path="/dashboard/admin/akun-keluarga" element={<AdminAkunKeluargaCreate />} />
          <Route path="/dashboard/admin/manajemen-keluarga" element={<AkunKeluargaManagement />} />
          <Route path="/dashboard/admin/tenaga-kesehatan" element={<TenagaKesehatanManagement />} />
          <Route path="/dashboard/admin/jadwal-layanan" element={<JadwalLayanan />} />
        </Route>

        {/* Rute Anak (tanpa auth wrapper - bisa diakses langsung) */}
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

        {/* Default & Wildcard */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;