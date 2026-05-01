import React, { useEffect, useState } from "react";
import { ChevronLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/Puskesmas/MainLayout";
import { getVaksinById } from "../../services/vaksin";

const labelClass = "text-xs font-semibold text-slate-500 uppercase";

const getErrorMessage = (error, fallback) => {
  const status = error?.response?.status;
  if (status === 401) return "Sesi login habis. Silakan login ulang.";
  if (status === 403) return "Anda tidak memiliki akses ke data vaksin.";
  if (status === 404) return "Data vaksin tidak ditemukan.";
  const message = error?.response?.data?.message;
  if (Array.isArray(message) && message[0]) return message[0];
  if (typeof message === "string") return message;
  return fallback;
};

export default function VaksinDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const result = await getVaksinById(id);
        setData(result);
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Gagal memuat data vaksin"));
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <button
                type="button"
                onClick={() => navigate("/vaksin")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft size={18} />
                Kembali ke daftar vaksin
              </button>
              <h1 className="text-xl font-semibold text-slate-900 mt-2">Detail Vaksin</h1>
              <p className="text-xs text-slate-500 mt-1">Ringkasan lengkap informasi vaksin.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/vaksin/${id}/edit`)}
              disabled={data?.status === "nonaktif"}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${
                data?.status === "nonaktif"
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              <Pencil size={16} />
              Edit
            </button>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          )}

          {loading && <div className="text-sm text-slate-500">Memuat data...</div>}

          {!loading && data && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <p className={labelClass}>Jenis Vaksin</p>
                <p className="text-sm text-slate-800">{data.jenis_vaksin || "-"}</p>
              </div>
              <div className="space-y-2">
                <p className={labelClass}>Kepanjangan</p>
                <p className="text-sm text-slate-800">{data.kepanjangan || "-"}</p>
              </div>
              <div className="space-y-2">
                <p className={labelClass}>Ditujukan Kepada</p>
                <p className="text-sm text-slate-800">{data.ditujukan_kepada || "-"}</p>
              </div>
              <div className="space-y-2">
                <p className={labelClass}>Waktu Pemberian</p>
                <p className="text-sm text-slate-800">{data.waktu_pemberian || "-"}</p>
              </div>
              <div className="space-y-2">
                <p className={labelClass}>Status</p>
                <p className="text-sm text-slate-800">{data.status || "aktif"}</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <p className={labelClass}>Deskripsi</p>
                <p className="text-sm text-slate-800 whitespace-pre-line">{data.deskripsi || "-"}</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <p className={labelClass}>Efek Samping</p>
                <p className="text-sm text-slate-800 whitespace-pre-line">{data.efek_samping || "-"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
