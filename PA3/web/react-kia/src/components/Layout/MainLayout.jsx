// src/components/Layout/MainLayout.jsx
import Header from "./Header";
import Sidebar from "./Sidebar";
import Breadcrumbs from "../Breadcrumbs";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50">

      {/* Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Right Area */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs />
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}