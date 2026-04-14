// src/components/Layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Baby, 
  FileText, 
  Settings,
  LogOut 
} from "lucide-react";
import { logout } from "../../services/auth";

const Sidebar = () => {
  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { path: "/data-ibu", name: "Data Ibu", icon: Users },
    { path: "/data-anak", name: "Data Anak", icon: Baby },
    { path: "/laporan", name: "Laporan", icon: FileText },
    { path: "/pengaturan", name: "Pengaturan", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-indigo-800 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-indigo-700">KIA System</div>
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 hover:bg-indigo-700 transition ${
                isActive ? "bg-indigo-700" : ""
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-700 transition border-t border-indigo-700"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;