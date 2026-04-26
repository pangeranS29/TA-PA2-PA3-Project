// src/components/Layout/MainLayout.jsx
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  return (
    // overflow-hidden di sini mencegah seluruh halaman scrolling
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      
      {/* Sidebar - Tetap di kiri, tidak ikut scroll */}
      {/* Kita tambahkan hidden md:flex agar di mobile tersembunyi (responsive awal) */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* Area Kanan (Header + Main Content) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* Header - Tetap di atas, tidak ikut scroll */}
        <Header />

        {/* Main Content - Hanya area ini yang bisa scroll kebawah */}
        <main className="flex-1 overflow-y-auto px-4 pb-4 pt-2 md:px-8 md:pb-8 md:pt-3 custom-scrollbar">
          {/* Container agar konten tidak terlalu lebar di layar ultra-wide */}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}