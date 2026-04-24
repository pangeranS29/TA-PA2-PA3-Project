// src/components/Layout/Header.jsx
import { getCurrentUser } from "../../services/auth";

const Header = () => {
  const user = getCurrentUser();
  return (
    <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Halo, {user?.name || "User"}</span>
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
          {user?.name?.charAt(0) || "U"}
        </div>
      </div>
    </header>
  );
};

export default Header;