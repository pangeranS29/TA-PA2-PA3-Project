// src/components/Layout/Sidebar.jsx
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  getCurrentUser,
  getUserRedirectRoute,
  isAdminUser,
  isBidanUser,
  isDokterUser
} from "../../services/auth";
import {
  ChevronDown,
  LayoutGrid,
  Users,
  Baby,
  Activity,
  BarChart3,
  Settings,
  UserCheck,
  UserPlus,
  BriefcaseMedical,
  ClipboardEdit,
  TableProperties,
  ClipboardList,
  ShieldPlus,
  BookOpenCheck,
} from "lucide-react";
import logo from "./LOGO.png";
const baseItemClass = (isActive) =>
  `flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
    ? "bg-blue-50 text-blue-600 font-semibold"
    : "text-slate-500 hover:bg-gray-50 hover:text-slate-700"
  }`;

const Sidebar = () => {
  const user = getCurrentUser();
  const isAdmin = isAdminUser(user);
  const isBidan = isBidanUser(user);
  const isDokter = isDokterUser(user);
  const location = useLocation();

  const dashboardPath = getUserRedirectRoute(user);
  const [isFamilyMenuOpen, setIsFamilyMenuOpen] = useState(false);

  const getDropdownOpenState = (pathname) => ({
    monitoring: pathname.startsWith("/monitoring") || pathname.startsWith("/pemantauan"),
    edukasiDigital: pathname.startsWith("/edukasi-digital"),
    kesehatanLingkungan: pathname.startsWith("/pencatatan/kesehatan-lingkungan"),
    bidanKaderManagement: pathname.startsWith("/manajemen-posyandu") || pathname.startsWith("/manajemen-bidan") || pathname.startsWith("/manajemen-kader"),
  });

  const [dropdownOpen, setDropdownOpen] = useState(() => getDropdownOpenState(location.pathname));

  useEffect(() => {
    setDropdownOpen(getDropdownOpenState(location.pathname));
  }, [location.pathname]);

  const toggleDropdown = (key) => {
    setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Menu untuk bidan (lengkap)
  const bidanMenuItems = [
    { path: "/data-ibu", name: "Data Ibu", icon: Users },
    { path: "/daftar-anak", name: "Data Anak", icon: Baby },
    // { path: "/kependudukan", name: "Manajemen KK", icon: UserCheck },
    // { path: "/monitoring", name: "Monitoring", icon: Activity },
    {
      name: "Manajemen Bidan & Kader",
      icon: BriefcaseMedical,
      isDropdown: true,
      dropdownKey: "bidanKaderManagement",
      children: [
        { path: "/manajemen-posyandu", name: "Kelola Posyandu", icon: TableProperties },
        { path: "/manajemen-bidan", name: "Kelola Bidan", icon: UserCheck },
        { path: "/manajemen-kader", name: "Kelola Kader", icon: UserPlus },
      ],
    },
    {
      name: "Kesehatan Lingkungan",
      icon: ClipboardList,
      isDropdown: true,
      dropdownKey: "kesehatanLingkungan",
      children: [
        { path: "/pencatatan/kesehatan-lingkungan", name: "Data Pencatatan", icon: TableProperties },
        { path: "/pencatatan/kesehatan-lingkungan/kelola", name: "Kelola Indikator", icon: ClipboardEdit },
      ],
    },
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
        { path: "/pemantauan/kelola", name: "Kelola Pemantauan Anak", icon: ClipboardEdit },
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
        { path: "/edukasi-digital/nifas", name: "Edukasi Nifas", icon: ClipboardList },
        { path: "/edukasi-digital/menyusui-asi", name: "Menyusui & ASI", icon: ClipboardList },
        { path: "/edukasi-digital/pola-asuh", name: "Pola Asuh", icon: ClipboardList },
        { path: "/edukasi-digital/kesehatan-mental", name: "Kesehatan Mental", icon: ClipboardList },
        { path: "/edukasi-digital/perawatan-anak", name: "Perawatan Anak", icon: ClipboardList },
        { path: "/edukasi-digital/mpasi", name: "MPASI", icon: ClipboardList },
      ],
    },
    { path: "/laporan", name: "Laporan", icon: BarChart3 },
  ];

  // Menu untuk dokter (hanya Data Ibu & Laporan)
  const dokterMenuItems = [
    { path: "/data-ibu", name: "Data Ibu", icon: Users },
    { path: "/laporan", name: "Laporan", icon: BarChart3 },
  ];

  // Menu admin (kelola keluarga)
  const adminFamilyMenuItems = useMemo(
    () => [
      { path: "/dashboard/admin/manajemen-keluarga", name: "Manajemen KK", icon: UserCheck },
      { path: "/dashboard/admin/akun-keluarga", name: "Buat Akun", icon: UserPlus },
    ],
    []
  );

  // Menentukan menuItems berdasarkan role
  let menuItems = [];
  if (isAdmin) {
    menuItems = [{ path: dashboardPath, name: "Dashboard", icon: LayoutGrid }];
  } else if (isDokter) {
    menuItems = [
      { path: dashboardPath, name: "Dashboard", icon: LayoutGrid },
      ...dokterMenuItems,
    ];
  } else if (isBidan) {
    menuItems = [
      { path: dashboardPath, name: "Dashboard", icon: LayoutGrid },
      ...bidanMenuItems,
    ];
  } else {
    menuItems = [{ path: dashboardPath, name: "Dashboard", icon: LayoutGrid }];
  }

  const settingsMenu = { path: "/pengaturan", name: "Pengaturan", icon: Settings };

  const renderNavLink = (item, className = "text-sm") => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) => `${baseItemClass(isActive)} ${className}`}
    >
      {({ isActive }) => (
        <>
          <item.icon
            size={18}
            className={`flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}
          />
          <span className="truncate text-sm">{item.name}</span>
        </>
      )}
    </NavLink>
  );

  const renderDropdown = (item) => {
    const isOpen = dropdownOpen[item.dropdownKey];
    const hasActiveChild = item.children?.some((child) => location.pathname.startsWith(child.path));

    return (
      <div key={item.dropdownKey} className="space-y-0.5">
        <button
          type="button"
          onClick={() => toggleDropdown(item.dropdownKey)}
          className={`${baseItemClass(isOpen || hasActiveChild)} w-full`}
        >
          <item.icon
            size={18}
            className={`flex-shrink-0 ${(isOpen || hasActiveChild) ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}
          />
          <span className="flex-1 text-left truncate text-sm">{item.name}</span>
          <ChevronDown
            size={14}
            className={`flex-shrink-0 transition-transform duration-200 ${(isOpen || hasActiveChild) ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        {(isOpen || hasActiveChild) && (
          <div className="ml-3 pl-3 space-y-0.5 border-l border-slate-200">
            {item.children.map((child) => renderNavLink(child, "text-sm px-3 py-2 rounded-lg"))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col p-4">
      {/* Header Logo */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className=" p-1.5 rounded-lg text-white shadow-lg shadow-blue-100 flex-shrink-0">
  <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
</div>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-slate-800 leading-tight">KIA Cerdas</h1>
          <p className="text-[11px] text-slate-400">Dashboard {isDokter ? "Dokter" : isBidan ? "Bidan" : "Admin"}</p>
        </div>
      </div>

      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
        Menu utama
      </p>

      {/* Navigasi */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item) =>
          item.isDropdown ? renderDropdown(item) : renderNavLink(item)
        )}

        {/* Menu khusus admin */}
        {isAdmin && (
          <div className="pt-1">
            <NavLink
              to="/dashboard/admin/tenaga-kesehatan"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-500 hover:bg-gray-50 hover:text-slate-700"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <BriefcaseMedical
                    size={18}
                    className={`flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}
                  />
                  <span className="truncate text-sm">Mengelola Profile Bidan & Kader</span>
                </>
              )}
            </NavLink>

            <button
              type="button"
              onClick={() => setIsFamilyMenuOpen((prev) => !prev)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 text-slate-500 hover:bg-gray-50 hover:text-slate-700"
            >
              <UserCheck size={18} className="flex-shrink-0 text-slate-400" />
              <span className="flex-1 text-left truncate text-sm">Mengelola Profile Keluarga</span>
              <ChevronDown
                size={14}
                className={`flex-shrink-0 transition-transform duration-200 ${isFamilyMenuOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>

            {isFamilyMenuOpen && (
              <div className="mt-0.5 space-y-0.5 pl-3 border-l border-slate-200 ml-3">
                {adminFamilyMenuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2.5 py-2 rounded-md transition-all duration-200 group text-sm ${isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-500 hover:bg-gray-50 hover:text-slate-700"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          size={16}
                          className={`flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}
                        />
                        <span className="truncate text-xs">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Menu Pengaturan untuk semua role */}
        {/* {renderNavLink(settingsMenu)} */}
      </nav>
    </aside>
  );
};

export default Sidebar;