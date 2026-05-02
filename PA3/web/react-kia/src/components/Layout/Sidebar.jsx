// src/components/Layout/Sidebar.jsx
import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { getCurrentUser, getUserRedirectRoute, isAdminUser } from "../../services/auth";
import {
  ChevronDown,
  LayoutGrid,
  Users,
  Baby,
  Activity,
  BarChart3,
  Settings,
  ShieldPlus,
  UserCheck,
  UserPlus,
  BriefcaseMedical,
  CalendarDays,
  ClipboardEdit,
  TableProperties,
  ClipboardList,
  BookOpenCheck,
  Ruler
} from "lucide-react";

const Sidebar = () => {
  const user = getCurrentUser();
  const isAdmin = isAdminUser(user);
  const dashboardPath = getUserRedirectRoute(user);
  const location = useLocation();

  const [isFamilyMenuOpen, setIsFamilyMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    monitoring: location.pathname.startsWith("/monitoring") || location.pathname.startsWith("/pemantauan"),
    edukasiDigital: location.pathname.startsWith("/edukasi-digital"),
  });

  const toggleDropdown = (key) => {
    setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const adminFamilyMenuItems = useMemo(
    () => [
      { path: "/dashboard/admin/manajemen-keluarga", name: "Manajemen KK", icon: UserCheck },
      { path: "/dashboard/admin/akun-keluarga", name: "Buat Akun", icon: UserPlus },
    ],
    []
  );

  const bidanMenuItems = [
    { path: "/data-ibu", name: "Data Ibu", icon: Users },
    { path: "/daftar-anak", name: "Data Anak", icon: Baby },
    // { path: "/data-anak/lila", name: "Pelayanan LILA", icon: Ruler },
    { path: "/kependudukan", name: "Manajemen KK", icon: UserCheck },
    { path: "/pencatatan/kesehatan-lingkungan", name: "Kesehatan Lingkungan", icon: ClipboardList },
    {
      name: "Monitoring",
      icon: Activity,
      isDropdown: true,
      dropdownKey: "monitoring",
      children: [
        { path: "/monitoring", name: "Rekap Wilayah", icon: BarChart3 },
        { path: "/pemantauan/lihat", name: "Data Pemantauan Anak", icon: TableProperties },
        { path: "/pemantauan/perkembangan", name: "Data Perkembangan Anak", icon: TableProperties },
        { path: "/pemantauan/kelola-perkembangan", name: "Kelola Penanda Perkembangan Anak", icon: ClipboardEdit },
        { path: "/pemantauan/kelola", name: "Kelola Indikator Anak", icon: ClipboardEdit },
      ],
    },
    {
      name: "Edukasi Digital",
      icon: BookOpenCheck,
      isDropdown: true,
      dropdownKey: "edukasiDigital",
      children: [
        { path: "/edukasi-digital/informasi-umum", name: "Informasi Umum", icon: ClipboardList },
        { path: "/edukasi-digital/tanda-bahaya-trimester", name: "Tanda Bahaya Trimester", icon: ClipboardList },
        { path: "/edukasi-digital/tanda-melahirkan", name: "Tanda Melahirkan", icon: ClipboardList },
        { path: "/edukasi-digital/imd", name: "Edukasi IMD", icon: ClipboardList },
        { path: "/edukasi-digital/setelah-melahirkan", name: "Setelah Melahirkan", icon: ClipboardList },
        { path: "/edukasi-digital/menyusui-asi", name: "Menyusui & ASI", icon: ClipboardList },
        { path: "/edukasi-digital/pola-asuh", name: "Pola Asuh", icon: ClipboardList },
        { path: "/edukasi-digital/kesehatan-mental", name: "Kesehatan Mental", icon: ClipboardList },
        { path: "/edukasi-digital/perawatan-anak", name: "Perawatan Anak", icon: ClipboardList },
        { path: "/edukasi-digital/mpasi", name: "MPASI & Resep", icon: ClipboardList },
      ],
    },
    { path: "/laporan", name: "Laporan", icon: BarChart3 },
    { path: "/pengaturan", name: "Pengaturan", icon: Settings },
  ];

  const menuItems = [
    { path: dashboardPath, name: "Dashboard", icon: LayoutGrid },
    ...(isAdmin ? [] : bidanMenuItems),
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
      ? "bg-blue-50 text-blue-600 font-semibold"
      : "text-slate-500 hover:bg-gray-50 hover:text-slate-700"
    }`;

  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col p-6">
      {/* Header Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
          <ShieldPlus size={28} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">KIA Cerdas</h1>
          <p className="text-xs text-slate-400">Dashboard Bidan Desa</p>
        </div>
      </div>

      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">
        Menu utama
      </p>

      {/* Navigasi */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item) => {
          if (!item.isDropdown) {
            return (
              <NavLink key={item.path} to={item.path} className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    <item.icon size={20} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          }

          const isChildActive = item.children.some((child) => location.pathname.startsWith(child.path));
          const isOpen = dropdownOpen[item.dropdownKey] || false;

          return (
            <div key={item.name} className="space-y-1">
              <button
                onClick={() => toggleDropdown(item.dropdownKey)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isOpen || isChildActive
                    ? "text-slate-700 font-medium"
                    : "text-slate-500 hover:bg-gray-50 hover:text-slate-700"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={(isOpen || isChildActive) ? "text-blue-600" : "text-slate-400"} />
                  <span>{item.name}</span>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="ml-9 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${isActive
                          ? "text-blue-600 font-semibold"
                          : "text-slate-400 hover:text-slate-600 hover:bg-gray-50"
                        }`
                      }
                    >
                      <child.icon size={16} />
                      <span>{child.name}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Admin Menu */}
        {isAdmin && (
          <div className="pt-2">
            <NavLink to="/dashboard/admin/tenaga-kesehatan" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <BriefcaseMedical size={20} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} />
                  <span className="truncate">Mengelola Bidan & Kader</span>
                </>
              )}
            </NavLink>

            <button
              type="button"
              onClick={() => setIsFamilyMenuOpen((prev) => !prev)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-gray-50 hover:text-slate-700"
            >
              <UserCheck size={20} className="text-slate-400" />
              <span className="flex-1 text-left truncate">Mengelola Profile Keluarga</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isFamilyMenuOpen ? "rotate-180" : "rotate-0"}`} />
            </button>

            {isFamilyMenuOpen && (
              <div className="mt-1 space-y-1 pl-5 border-l border-slate-200 ml-5">
                {adminFamilyMenuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-sm ${isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-500 hover:bg-gray-50 hover:text-slate-700"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon size={16} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} />
                        <span className="truncate">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}

            <NavLink to="/dashboard/admin/jadwal-layanan" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <CalendarDays size={20} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} />
                  <span className="truncate">Jadwal Layanan</span>
                </>
              )}
            </NavLink>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <h4 className="text-sm font-bold text-slate-800">Wilayah aktif</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Desa Suka Maju · 4 posyandu aktif · sinkron terakhir 08.10 WIB
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;