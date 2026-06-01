import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  getCurrentUser,
  getUserRedirectRoute,
  isSuperadminUser,
  isAdminUser,
  isBidanUser,
  isDokterUser,
} from "../../services/auth";
import {
  ChevronDown,
  LayoutGrid,
  Users,
  Baby,
  Activity,
  Calendar,
  BarChart3,
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
  const isSuperadmin = isSuperadminUser(user);
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
    mpasi: pathname.startsWith("/edukasi-digital/mpasi"),
  });

  const [dropdownOpen, setDropdownOpen] = useState(() => getDropdownOpenState(location.pathname));

  useEffect(() => {
    setDropdownOpen(getDropdownOpenState(location.pathname));
  }, [location.pathname]);

  const toggleDropdown = (key) => {
    setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const bidanMenuItems = [
    { path: "/data-ibu", name: "Data Ibu", icon: Users },
    { path: "/daftar-anak", name: "Data Anak", icon: Baby },
    {
      name: "Kesehatan Lingkungan",
      icon: ClipboardList,
      isDropdown: true,
      dropdownKey: "kesehatanLingkungan",
      children: [
        { path: "/pencatatan/kesehatan-lingkungan", name: "Data Pencatatan", icon: TableProperties },
        { path: "/pencatatan/kesehatan-lingkungan/kelola", name: "Kelola Pertanyaan", icon: ClipboardEdit },
      ],
    },
    {
      name: "Monitoring",
      icon: Activity,
      isDropdown: true,
      dropdownKey: "monitoring",
      children: [
        { path: "/pemantauan/lihat", name: "Data Pemantauan Anak", icon: TableProperties },
        { path: "/pemantauan/perkembangan", name: "Data Perawatan Anak", icon: TableProperties },
        { path: "/pemantauan/kelola-perkembangan", name: "Kelola Perawatan Anak", icon: ClipboardEdit },
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
        { path: "/edukasi-digital/trimester", name: "Edukasi Trimester", icon: ClipboardList },
        { path: "/edukasi-digital/tanda-melahirkan", name: "Tanda Melahirkan", icon: ClipboardList },
        { path: "/edukasi-digital/imd", name: "Edukasi IMD", icon: ClipboardList },
        { path: "/edukasi-digital/setelah-melahirkan", name: "Setelah Melahirkan", icon: ClipboardList },
        { path: "/edukasi-digital/menyusui-asi", name: "Menyusui & ASI", icon: ClipboardList },
        { path: "/edukasi-digital/pola-asuh", name: "Pola Asuh", icon: ClipboardList },
        { path: "/edukasi-digital/kesehatan-mental", name: "Kesehatan Mental", icon: ClipboardList },
        { path: "/edukasi-digital/perawatan-anak", name: "Perawatan Anak", icon: ClipboardList },
        {
          name: "MPASI",
          icon: ClipboardList,
          isDropdown: true,
          dropdownKey: "mpasi",
          children: [
            { path: "/edukasi-digital/mpasi", name: "Materi MPASI", icon: ClipboardList },
            { path: "/edukasi-digital/mpasi-aturan-porsi", name: "Aturan Porsi", icon: ClipboardList },
            { path: "/edukasi-digital/mpasi-jadwal-harian", name: "Jadwal Harian", icon: ClipboardList },
            { path: "/edukasi-digital/mpasi-resep", name: "Resep", icon: ClipboardList },
          ],
        },
      ],
    },
    { path: "/jadwal-layanan", name: "Jadwal Layanan", icon: Calendar },
    { path: "/laporan", name: "Laporan", icon: BarChart3 },
  ];

  const dokterMenuItems = [
    { path: "/data-ibu", name: "Data Ibu", icon: Users },
    { path: "/laporan", name: "Laporan", icon: BarChart3 },
    { path: "/daftar-rujukan", name: "Rujukan", icon: ClipboardList },
  ];

  const adminFamilyMenuItems = useMemo(
    () => [
      { path: "/dashboard/admin/manajemen-keluarga", name: "Manajemen KK", icon: UserCheck },
      { path: "/dashboard/admin/akun-keluarga", name: "Buat Akun", icon: UserPlus },
    ],
    []
  );

  const superadminMenuItems = useMemo(
    () => [
      { path: "/superadmin/dashboard", name: "Dashboard", icon: LayoutGrid },
      { path: "/superadmin/kelola-user", name: "Kelola Bidan&Kader&Admin desa", icon: ShieldPlus },
      { path: "/superadmin/kelola-user-per-desa", name: "Kelola Akun User Per Desa", icon: Users },
      { path: "/superadmin/kelola-desa", name: "Kelola Desa", icon: TableProperties },
    ],
    []
  );

  let menuItems = [];
  if (isSuperadmin) {
    menuItems = superadminMenuItems;
  } else if (isAdmin) {
    menuItems = [{ path: dashboardPath, name: "Dashboard", icon: LayoutGrid }];
  } else if (isDokter) {
    menuItems = [{ path: dashboardPath, name: "Dashboard", icon: LayoutGrid }, ...dokterMenuItems];
  } else if (isBidan) {
    menuItems = [{ path: dashboardPath, name: "Dashboard", icon: LayoutGrid }, ...bidanMenuItems];
  } else {
    menuItems = [{ path: dashboardPath, name: "Dashboard", icon: LayoutGrid }];
  }

  const renderMenuItem = (item) => {
    if (item.isDropdown) {
      const open = dropdownOpen[item.dropdownKey];
      const Icon = item.icon;
      return (
        <div key={item.name} className="space-y-1">
          <button
            type="button"
            onClick={() => toggleDropdown(item.dropdownKey)}
            className={`${baseItemClass(open)} w-full text-left`}
          >
            <Icon size={18} className="flex-shrink-0" />
            <span className="flex-1 truncate">{item.name}</span>
            <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="ml-4 space-y-1 border-l border-slate-200 pl-3">
              {item.children.map((child) => renderMenuItem(child))}
            </div>
          )}
        </div>
      );
    }

    const Icon = item.icon;
    return (
      <NavLink key={item.path} to={item.path} className={({ isActive }) => baseItemClass(isActive)}>
        <Icon size={18} className="flex-shrink-0" />
        <span className="truncate text-sm">{item.name}</span>
      </NavLink>
    );
  };

  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <img src={logo} alt="Logo" className="h-11 w-11 rounded-xl object-cover shadow-sm" />
        <div>
          <div className="text-sm font-semibold text-slate-900">KIA Dashboard</div>
          <div className="text-xs text-slate-500">Posyandu & edukasi digital</div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
        <div className="space-y-2">{menuItems.map((item) => renderMenuItem(item))}</div>

        {isAdmin && adminFamilyMenuItems.length > 0 && (
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setIsFamilyMenuOpen((prev) => !prev)}
              className={`${baseItemClass(isFamilyMenuOpen)} w-full text-left`}
            >
              <BriefcaseMedical size={18} className="flex-shrink-0" />
              <span className="flex-1 truncate">Kelola Keluarga</span>
              <ChevronDown size={16} className={`transition-transform ${isFamilyMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {isFamilyMenuOpen && (
              <div className="ml-4 space-y-1 border-l border-slate-200 pl-3">
                {adminFamilyMenuItems.map((item) => renderMenuItem(item))}
              </div>
            )}
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
