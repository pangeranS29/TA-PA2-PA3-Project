import MainLayout from "../../components/Layout/MainLayout";
import { Link } from "react-router-dom";

export default function NeonatusCreate() {
  return (
    <MainLayout>
      <h1 className="text-xl font-bold mb-4">D Neonatus</h1>

      <Link
        to="/neonatus/create"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Tambah Data
      </Link>

      {/* nanti isi tabel di sini */}
    </MainLayout>
  );
}