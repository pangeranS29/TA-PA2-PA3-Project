import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-4 bg-gray-100 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}