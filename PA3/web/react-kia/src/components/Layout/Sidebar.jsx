// src/components/Layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { 
  LayoutGrid, 
  Users, 
  Baby,        // Ditambahkan
  Activity,    // Ditambahkan
  BarChart3,   // Ditambahkan
  Settings,    // Ditambahkan
  ShieldPlus,
  HeartPulse,
  Calendar,
  ClipboardList
} from "lucide-react";
import { logout } from "../../services/auth";

const Sidebar = () => {
  const menuItems = [
    // Sesuaikan ikon dengan apa yang diimport di atas
    { path: "/dashboard", name: "Dashboard", icon: LayoutGrid }, // Menggunakan LayoutGrid agar konsisten dengan UI sebelumnya
    { path: "/data-ibu", name: "Data Ibu", icon: Users },
    { path: "/daftar-anak", name: "Data Anak", icon: Baby },
    { path: "/kependudukan", name: "Manajemen KK", icon: Users },
    { path: "/monitoring", name: "Monitoring", icon: Activity },
    { path: "/laporan", name: "Laporan", icon: BarChart3 },
    { path: "/pengaturan", name: "Pengaturan", icon: Settings },
  ];

  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
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
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
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
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="mt-auto pt-4 border-t border-gray-50">
        <div className="bg-slate-50 rounded-2xl p-4">
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