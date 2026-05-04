// src/pages/Ibu/SkriningDMG.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import api from "../../services/api";
import { getCurrentUser, isDokterUser } from "../../services/auth";
import { Plus, Edit2, Eye, Save, Pill, CheckCircle2, AlertCircle, Home } from "lucide-react";

export default function SkriningDMG() {
    const { id: ibuId } = useParams();
    const [searchParams] = useSearchParams();
    const kehamilanId = searchParams.get("kehamilan_id");
    const navigate = useNavigate();

    // Role
    const user = getCurrentUser();
    const isDokter = isDokterUser(user);
    const canEdit = isDokter; // Bidan hanya baca

    const [kehamilan, setKehamilan] = useState(null);
    const [skriningDMG, setSkriningDMG] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        gula_darah_puasa_hasil: "",
        gula_darah_puasa_rencana_tindak_lanjut: "",
        gula_darah_2_jam_post_prandial_hasil: "",
        gula_darah_2_jam_post_prandial_rencana_tindak_lanjut: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const kehamilanList = await getKehamilanByIbuId(ibuId);
                if (!kehamilanList.length) {
                    alert("Ibu belum memiliki data kehamilan.");
                    navigate(`/data-ibu/${ibuId}`);
                    return;
                }

                let targetKehamilan = null;
                if (kehamilanId) {
                    targetKehamilan = kehamilanList.find(k => k.id == kehamilanId);
                    if (!targetKehamilan) {
                        alert(`Kehamilan dengan ID ${kehamilanId} tidak ditemukan.`);
                        navigate(`/data-ibu/${ibuId}`);
                        return;
                    }
                } else {
                    targetKehamilan = kehamilanList[0];
                }
                setKehamilan(targetKehamilan);

                const res = await api.get(`/tenaga-kesehatan/skrining-dm-gestasional?kehamilan_id=${targetKehamilan.id}`);
                const data = res.data?.data;
                if (data && data.length > 0) {
                    const d = data[0];
                    setSkriningDMG(d);
                    setForm({
                        gula_darah_puasa_hasil: d.gula_darah_puasa_hasil || "",
                        gula_darah_puasa_rencana_tindak_lanjut: d.gula_darah_puasa_rencana_tindak_lanjut || "",
                        gula_darah_2_jam_post_prandial_hasil: d.gula_darah_2_jam_post_prandial_hasil || "",
                        gula_darah_2_jam_post_prandial_rencana_tindak_lanjut: d.gula_darah_2_jam_post_prandial_rencana_tindak_lanjut || "",
                    });
                }

                // Hanya Dokter yang bisa mengedit
                const isEditMode = searchParams.get("edit") === "true";
                setIsEditing(canEdit && isEditMode);
            } catch (err) {
                console.error(err);
                alert("Gagal memuat data DMG");
            } finally {
                setLoading(false);
            }
        };
        if (ibuId) fetchData();
    }, [ibuId, kehamilanId, navigate, searchParams, canEdit]);

    const handleChange = (e) => {
        if (!canEdit) return;
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.gula_darah_puasa_hasil) {
            newErrors.gula_darah_puasa_hasil = "Hasil gula darah puasa wajib diisi";
        } else {
            const gdp = parseFloat(form.gula_darah_puasa_hasil);
            if (isNaN(gdp) || gdp < 0) {
                newErrors.gula_darah_puasa_hasil = "Harus berupa angka positif";
            }
        }
        if (!form.gula_darah_2_jam_post_prandial_hasil) {
            newErrors.gula_darah_2_jam_post_prandial_hasil = "Hasil gula darah 2 jam post prandial wajib diisi";
        } else {
            const gd2 = parseFloat(form.gula_darah_2_jam_post_prandial_hasil);
            if (isNaN(gd2) || gd2 < 0) {
                newErrors.gula_darah_2_jam_post_prandial_hasil = "Harus berupa angka positif";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canEdit) {
            alert("Anda tidak memiliki izin untuk mengubah data.");
            return;
        }
        if (!validateForm()) return;
        if (!kehamilan) {
            alert("Data kehamilan tidak ditemukan");
            return;
        }
        setSaving(true);
        try {
            const payload = {
                kehamilan_id: kehamilan.id,
                ...form,
            };
            if (skriningDMG) {
                await api.put(`/tenaga-kesehatan/skrining-dm-gestasional/${skriningDMG.id_skrining_dm}`, payload);
            } else {
                await api.post(`/tenaga-kesehatan/skrining-dm-gestasional`, payload);
            }
            alert("Skrining DM Gestasional berhasil disimpan!");
            setIsEditing(false);
            const freshRes = await api.get(`/tenaga-kesehatan/skrining-dm-gestasional?kehamilan_id=${kehamilan.id}`);
            if (freshRes.data?.data?.length) setSkriningDMG(freshRes.data.data[0]);
        } catch (err) {
            console.error(err);
            alert(`Gagal menyimpan: ${err.response?.data?.message || err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const getStatusDMG = () => {
        if (!skriningDMG) return "BELUM ADA DATA";
        const gdp = parseFloat(skriningDMG.gula_darah_puasa_hasil);
        const gd2 = parseFloat(skriningDMG.gula_darah_2_jam_post_prandial_hasil);
        if ((!isNaN(gdp) && gdp >= 92) || (!isNaN(gd2) && gd2 >= 153)) return "TIDAK NORMAL (Perlu evaluasi lebih lanjut)";
        return "NORMAL";
    };

    // Breadcrumb component
    const Breadcrumb = () => {
        if (!kehamilan) return null;
        return (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
                <Link to="/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
                    <Home size={14} /> Beranda
                </Link>
                <span>/</span>
                <Link to="/data-ibu" className="hover:text-indigo-600">Data Ibu</Link>
                <span>/</span>
                <Link to={`/data-ibu/${ibuId}?kehamilan_id=${kehamilan.id}`} className="hover:text-indigo-600">
                    Detail Ibu
                </Link>
                <span>/</span>
                <span className="text-gray-700 font-medium">Skrining DM Gestasional</span>
            </div>
        );
    };

    // Tampilan hasil untuk semua user
    const ResultView = () => {
        if (!skriningDMG) {
            return (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-purple-50 rounded-full">
                            <Pill size={48} className="text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Belum Ada Data Skrining DM Gestasional</h3>
                        <p className="text-gray-500 max-w-md">
                            Silakan lakukan skrining Diabetes Melitus Gestasional untuk ibu hamil ini.
                        </p>
                        {canEdit && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2"
                            >
                                <Plus size={18} /> Mulai Skrining
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-600" size={24} />
                    <div>
                        <p className="font-semibold text-emerald-800">Status Skrining DMG</p>
                        <p className="text-emerald-700">{getStatusDMG()}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-5 py-3">
                        <div className="flex items-center gap-2">
                            <Pill size={22} className="text-white" />
                            <h3 className="text-lg font-bold text-white">Detail Skrining DM Gestasional</h3>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Gula Darah Puasa (GDP)</h4>
                            <div className="bg-purple-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">Hasil</p>
                                <p className="text-xl font-bold text-purple-700">{skriningDMG.gula_darah_puasa_hasil || "-"} mg/dL</p>
                                {skriningDMG.gula_darah_puasa_rencana_tindak_lanjut && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">Rencana Tindak Lanjut</p>
                                        <p className="text-sm text-purple-900">{skriningDMG.gula_darah_puasa_rencana_tindak_lanjut}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Gula Darah 2 Jam Post Prandial (TTGO 75g)</h4>
                            <div className="bg-indigo-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">Hasil</p>
                                <p className="text-xl font-bold text-indigo-700">{skriningDMG.gula_darah_2_jam_post_prandial_hasil || "-"} mg/dL</p>
                                {skriningDMG.gula_darah_2_jam_post_prandial_rencana_tindak_lanjut && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">Rencana Tindak Lanjut</p>
                                        <p className="text-sm text-indigo-900">{skriningDMG.gula_darah_2_jam_post_prandial_rencana_tindak_lanjut}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 justify-end">
                    {canEdit && (
                        <button onClick={() => setIsEditing(true)} className="bg-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2">
                            <Edit2 size={18} /> Edit Skrining
                        </button>
                    )}
                    {/* <button onClick={() => navigate(`/data-ibu/${ibuId}/skrining?kehamilan_id=${kehamilan.id}`)} className="bg-gray-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2">
            <Eye size={18} /> Lihat Semua Skrining
          </button> */}
                    <button
  onClick={() => navigate(`/data-ibu/${ibuId}?kehamilan_id=${kehamilan.id}`)}
  className="bg-gray-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"
> Kembali ke Detail Ibu
</button>
                </div>
            </div>
        );
    };

    // Form input (hanya untuk Dokter)
    const FormView = () => (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-purple-700">Form Skrining DM Gestasional</h2>
            <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-800">
                Test Toleransi Glukosa Oral (TTGO) pada usia kehamilan 24-28 minggu.
            </div>

            <div>
                <label className="block font-semibold mb-1">
                    Gula Darah Puasa (GDP) - mg/dL <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    step="0.01"
                    name="gula_darah_puasa_hasil"
                    value={form.gula_darah_puasa_hasil}
                    onChange={handleChange}
                    disabled={!canEdit}
                    className={`w-full border rounded-lg p-2 ${!canEdit ? 'bg-gray-100' : ''} ${errors.gula_darah_puasa_hasil ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Contoh: 90"
                />
                {errors.gula_darah_puasa_hasil && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.gula_darah_puasa_hasil}
                    </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Nilai normal: &lt; 92 mg/dL</p>
            </div>

            <div>
                <label className="block font-semibold mb-1">Rencana Tindak Lanjut (GDP)</label>
                <input
                    type="text"
                    name="gula_darah_puasa_rencana_tindak_lanjut"
                    value={form.gula_darah_puasa_rencana_tindak_lanjut}
                    onChange={handleChange}
                    disabled={!canEdit}
                    className={`w-full border rounded-lg p-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
                    placeholder="Misal: Edukasi diet, rujuk ke internis"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1">
                    Gula Darah 2 Jam Post Prandial (mg/dL) <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    step="0.01"
                    name="gula_darah_2_jam_post_prandial_hasil"
                    value={form.gula_darah_2_jam_post_prandial_hasil}
                    onChange={handleChange}
                    disabled={!canEdit}
                    className={`w-full border rounded-lg p-2 ${!canEdit ? 'bg-gray-100' : ''} ${errors.gula_darah_2_jam_post_prandial_hasil ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Contoh: 140"
                />
                {errors.gula_darah_2_jam_post_prandial_hasil && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.gula_darah_2_jam_post_prandial_hasil}
                    </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Nilai normal: &lt; 153 mg/dL</p>
            </div>

            <div>
                <label className="block font-semibold mb-1">Rencana Tindak Lanjut (2 jam PP)</label>
                <input
                    type="text"
                    name="gula_darah_2_jam_post_prandial_rencana_tindak_lanjut"
                    value={form.gula_darah_2_jam_post_prandial_rencana_tindak_lanjut}
                    onChange={handleChange}
                    disabled={!canEdit}
                    className={`w-full border rounded-lg p-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
                    placeholder="Misal: Konsultasi gizi, kontrol ulang"
                />
            </div>

            {canEdit && (
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-lg">
                        Batal
                    </button>
                    <button type="submit" disabled={saving} className="bg-purple-600 text-white px-5 py-2 rounded-lg flex items-center gap-2">
                        <Save size={18} /> {saving ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            )}
        </form>
    );

    if (loading) return <MainLayout><div className="p-6">Memuat...</div></MainLayout>;
    if (!kehamilan) return <MainLayout><div className="p-6 text-red-600">Error: Kehamilan tidak ditemukan</div></MainLayout>;

    return (
        <MainLayout>
            <div className="p-6 max-w-5xl ">
                
                <Breadcrumb />
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">Skrining Diabetes Melitus Gestasional</h1>
                    {!canEdit && (
                        <div className="mt-2 bg-blue-50 border border-blue-200 p-2 rounded-lg text-blue-700 text-sm flex items-center gap-2">
                            <Eye size={16} /> Anda dalam mode baca (Bidan). Data hanya dapat dilihat, tidak dapat diubah.
                        </div>
                    )}
                </div>
                {isEditing ? <FormView /> : <ResultView />}
            </div>
        </MainLayout>
    );
}