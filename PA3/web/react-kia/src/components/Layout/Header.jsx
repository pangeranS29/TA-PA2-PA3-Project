// src/components/Layout/Header.jsx
import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown, User } from "lucide-react";
import { getCurrentUser, logout } from "../../services/auth";

const Header = () => {
  const user = getCurrentUser(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Menutup dropdown saat klik di luar area profil
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // Redirect ke login setelah logout
  };

  return (
    <header className="bg-white px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 relative z-50">
      {/* Kiri: Judul dan Subtitle */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-800">
          Kia Cerdas
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Pemantauan status gizi, berat badan, dan tinggi badan balita di wilayah desa.
        </p>
      </div>

      {/* Kanan: Profile & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center gap-3 p-1.5 pr-3 rounded-2xl transition-all duration-200 border-2 ${
            isDropdownOpen ? "bg-slate-50 border-blue-100" : "border-transparent hover:bg-slate-50"
          }`}
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-blue-600 shadow-lg shadow-blue-100 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || "B"}
          </div>

          {/* Info User */}
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-none">{user?.name || "Bidan Desa"}</p>
            <p className="text-[10px] text-slate-400 mt-1">Petugas Medis</p>
          </div>

          <ChevronDown 
            size={16} 
            className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
            <div className="px-4 py-2 border-b border-slate-50 mb-1">
              <p className="text-xs text-slate-400">Masuk sebagai</p>
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.email || "admin@kia.com"}</p>
            </div>
            
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <User size={18} className="text-slate-400" />
              <span>Profil Saya</span>
            </button>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium">Keluar</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;