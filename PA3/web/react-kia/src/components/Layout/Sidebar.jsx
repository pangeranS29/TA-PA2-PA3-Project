// src/components/Layout/Sidebar.jsx
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Baby,
  Activity,
  BarChart3,
  Settings,
  ShieldPlus,
  UserCheck,
  ChevronDown, // Ikon tambahan untuk panah dropdown
  ClipboardEdit, // Ikon untuk Kelola
  TableProperties, // Ikon untuk Lihat Data
  ClipboardList,
  Database,
  BookOpenCheck
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(() => ({
    pemantauan: location.pathname.startsWith("/pemantauan"),
    edukasiDigital: location.pathname.startsWith("/edukasi-digital"),
  }));

  const toggleDropdown = (key) => {
    setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: LayoutGrid },
    { path: "/data-ibu", name: "Data Ibu", icon: Users },
    { path: "/daftar-anak", name: "Data Anak", icon: Baby },
    { path: "/kependudukan", name: "Manajemen KK", icon: UserCheck },
    { path: "/pencatatan/kesehatan-lingkungan", name: "Kesehatan dan Keselamatan Lingkungan", icon: ClipboardList },
    { path: "/monitoring", name: "Monitoring", icon: Activity },
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
      ],
    },
    {
      name: "Pemantauan",
      icon: Activity,
      isDropdown: true,
      dropdownKey: "pemantauan",
      children: [
        { path: "/pemantauan/kelola", name: "Kelola Pemantauan", icon: ClipboardEdit },
        { path: "/pemantauan/lihat", name: "Lihat Data Pemantauan", icon: TableProperties },
      ],
    },
    { path: "/laporan", name: "Laporan", icon: BarChart3 },
    { path: "/pengaturan", name: "Pengaturan", icon: Settings },
  ];

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
          // Logika untuk Menu Biasa
          if (!item.isDropdown) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-500 hover:bg-gray-50 hover:text-slate-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={20}
                      className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}
                    />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          }

          // Logika untuk Menu Dropdown
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
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Sub Menu */}
              {isOpen && (
                <div className="ml-9 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
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
      </nav>

      {/* Footer Info Wilayah */}
      <div className="mt-auto pt-6">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <h4 className="text-sm font-bold text-slate-800">Wilayah aktif</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Huta Bulu Mejan · Partner: Ibu Evaliana · 9.9 km
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;