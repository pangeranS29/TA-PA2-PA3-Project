import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { listDesa } from "../../services/desa";
import {
  createAdminDesaUser,
  createBidanUser,
  deactivateSuperadminUser,
  listSuperadminUsers,
  resetSuperadminUserPassword,
  superadminUserErrorMessage,
} from "../../services/superadminUsers";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  KeyRound,
  Loader2,
  Plus,
  Power,
  Search,
  ShieldCheck,
  ShieldPlus,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const emptyBidanForm = {
  penduduk_id: "",
  name: "",
  email: "",
  phone_number: "",
  password: "",
  desa_id: "",
  no_str: "",
  no_sipb: "",
};

const emptyAdminDesaForm = {
  penduduk_id: "",
  name: "",
  email: "",
  phone_number: "",
  password: "",
  desa_id: "",
};

const emptyResetForm = {
  password: "",
};

const cardClass = "rounded-3xl border border-slate-200 bg-white shadow-sm";

const roleOptions = [
  { value: "", label: "Semua role" },
  { value: "Admin", label: "Admin" },
  { value: "Bidan", label: "Bidan" },
  { value: "Kader", label: "Kader" },
  { value: "Superadmin", label: "Superadmin" },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [desaOptions, setDesaOptions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingDesa, setLoadingDesa] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [desaFilter, setDesaFilter] = useState("");
  const [activeTab, setActiveTab] = useState("bidan");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [bidanForm, setBidanForm] = useState(emptyBidanForm);
  const [adminDesaForm, setAdminDesaForm] = useState(emptyAdminDesaForm);
  const [resetUser, setResetUser] = useState(null);
  const [resetForm, setResetForm] = useState(emptyResetForm);
  const [showResetModal, setShowResetModal] = useState(false);

  const loadUsers = async (override = {}) => {
    try {
      setLoadingUsers(true);
      const data = await listSuperadminUsers({
        search: override.search ?? search,
        role: override.role ?? roleFilter,
        desa: override.desa ?? desaFilter,
      });
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(superadminUserErrorMessage(error, "Gagal memuat data user"));
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadDesa = async () => {
    try {
      setLoadingDesa(true);
      const data = await listDesa();
      setDesaOptions(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(superadminUserErrorMessage(error, "Gagal memuat data desa"));
    } finally {
      setLoadingDesa(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadDesa();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const desaMap = useMemo(() => {
    return desaOptions.reduce((acc, desa) => {
      acc[String(desa.id)] = desa;
      return acc;
    }, {});
  }, [desaOptions]);

  const activeStats = useMemo(() => {
    const activeUsers = users.filter((user) => user.is_active).length;
    const inactiveUsers = users.length - activeUsers;
    const bidanCount = users.filter((user) => (user.role || "").toLowerCase() === "bidan").length;
    const adminCount = users.filter((user) => (user.role || "").toLowerCase() === "admin").length;

    return [
      { label: "Total User", value: users.length, icon: Users, tone: "bg-cyan-50 text-cyan-700" },
      { label: "Aktif", value: activeUsers, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
      { label: "Bidan", value: bidanCount, icon: ShieldPlus, tone: "bg-violet-50 text-violet-700" },
      { label: "Admin Desa", value: adminCount, icon: ShieldCheck, tone: "bg-amber-50 text-amber-700" },
      { label: "Nonaktif", value: inactiveUsers, icon: Power, tone: "bg-rose-50 text-rose-700" },
    ];
  }, [users]);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const resetCreateForms = () => {
    setBidanForm(emptyBidanForm);
    setAdminDesaForm(emptyAdminDesaForm);
  };

  const submitBidan = async (event) => {
    event.preventDefault();
    clearMessages();

    if (!bidanForm.penduduk_id || !bidanForm.name.trim() || !bidanForm.email.trim() || !bidanForm.phone_number.trim() || !bidanForm.password.trim() || !bidanForm.desa_id || !bidanForm.no_str.trim() || !bidanForm.no_sipb.trim()) {
      setErrorMessage("Semua field bidan wajib diisi");
      return;
    }

    try {
      setSubmitting(true);
      await createBidanUser({
        penduduk_id: Number(bidanForm.penduduk_id),
        name: bidanForm.name.trim(),
        email: bidanForm.email.trim(),
        phone_number: bidanForm.phone_number.trim(),
        password: bidanForm.password.trim(),
        desa_id: Number(bidanForm.desa_id),
        no_str: bidanForm.no_str.trim(),
        no_sipb: bidanForm.no_sipb.trim(),
      });
      resetCreateForms();
      await loadUsers();
      setSuccessMessage("Akun bidan berhasil dibuat dan di-assign ke desa");
    } catch (error) {
      setErrorMessage(superadminUserErrorMessage(error, "Gagal membuat akun bidan"));
    } finally {
      setSubmitting(false);
    }
  };

  const submitAdminDesa = async (event) => {
    event.preventDefault();
    clearMessages();

    if (!adminDesaForm.name.trim() || !adminDesaForm.email.trim() || !adminDesaForm.phone_number.trim() || !adminDesaForm.password.trim() || !adminDesaForm.desa_id) {
      setErrorMessage("Nama, email, nomor HP, password, dan desa wajib diisi");
      return;
    }

    try {
      setSubmitting(true);
      await createAdminDesaUser({
        penduduk_id: adminDesaForm.penduduk_id ? Number(adminDesaForm.penduduk_id) : undefined,
        name: adminDesaForm.name.trim(),
        email: adminDesaForm.email.trim(),
        phone_number: adminDesaForm.phone_number.trim(),
        password: adminDesaForm.password.trim(),
        desa_id: Number(adminDesaForm.desa_id),
      });
      setAdminDesaForm(emptyAdminDesaForm);
      await loadUsers();
      setSuccessMessage("Akun admin desa berhasil dibuat");
    } catch (error) {
      setErrorMessage(superadminUserErrorMessage(error, "Gagal membuat akun admin desa"));
    } finally {
      setSubmitting(false);
    }
  };

  const openResetModal = (user) => {
    setResetUser(user);
    setResetForm(emptyResetForm);
    setShowResetModal(true);
  };

  const submitResetPassword = async (event) => {
    event.preventDefault();
    if (!resetUser) return;

    if (!resetForm.password.trim() || resetForm.password.trim().length < 8) {
      setErrorMessage("Password baru minimal 8 karakter");
      return;
    }

    clearMessages();
    try {
      setSubmitting(true);
      await resetSuperadminUserPassword(resetUser.id, { password: resetForm.password.trim() });
      setShowResetModal(false);
      setResetUser(null);
      setResetForm(emptyResetForm);
      setSuccessMessage("Password user berhasil direset");
    } catch (error) {
      setErrorMessage(superadminUserErrorMessage(error, "Gagal reset password"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (user) => {
    if ((user.role || "").toLowerCase() === "superadmin") {
      setErrorMessage("Akun superadmin tidak dapat dinonaktifkan");
      return;
    }

    const confirmed = window.confirm(`Nonaktifkan user ${user.name}?`);
    if (!confirmed) return;

    clearMessages();
    try {
      setSubmitting(true);
      await deactivateSuperadminUser(user.id);
      await loadUsers();
      setSuccessMessage("User berhasil dinonaktifkan");
    } catch (error) {
      setErrorMessage(superadminUserErrorMessage(error, "Gagal menonaktifkan user"));
    } finally {
      setSubmitting(false);
    }
  };

  const applyFilters = async (event) => {
    event.preventDefault();
    clearMessages();
    await loadUsers();
  };

  const handleRefresh = async () => {
    clearMessages();
    await loadUsers();
  };

  return (
    <MainLayout>
      <div className="p-8 space-y-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {activeStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</h3>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.tone}`}>
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-start gap-3">
            <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <form onSubmit={activeTab === "bidan" ? submitBidan : submitAdminDesa} className={`${cardClass} p-6 space-y-5`}>
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
              <button
                type="button"
                onClick={() => setActiveTab("bidan")}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${activeTab === "bidan" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                <ShieldPlus size={16} />
                Tambah Bidan
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("admin")}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${activeTab === "admin" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                <UserPlus size={16} />
                Assign Admin Desa
              </button>
            </div>

            {activeTab === "bidan" ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-slate-600">Penduduk ID</label>
                    <input type="number" value={bidanForm.penduduk_id} onChange={(e) => setBidanForm((prev) => ({ ...prev, penduduk_id: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="123" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Desa</label>
                    <select value={bidanForm.desa_id} onChange={(e) => setBidanForm((prev) => ({ ...prev, desa_id: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" disabled={loadingDesa}>
                      <option value="">{loadingDesa ? "Memuat desa..." : "Pilih desa"}</option>
                      {desaOptions.map((desa) => (
                        <option key={desa.id} value={desa.id}>{desa.nama_desa} - {desa.kode_desa}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-slate-600">Nama</label>
                    <input type="text" value={bidanForm.name} onChange={(e) => setBidanForm((prev) => ({ ...prev, name: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Email</label>
                    <input type="email" value={bidanForm.email} onChange={(e) => setBidanForm((prev) => ({ ...prev, email: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-slate-600">Nomor HP</label>
                    <input type="text" value={bidanForm.phone_number} onChange={(e) => setBidanForm((prev) => ({ ...prev, phone_number: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Password Awal</label>
                    <input type="password" value={bidanForm.password} onChange={(e) => setBidanForm((prev) => ({ ...prev, password: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-slate-600">No STR</label>
                    <input type="text" value={bidanForm.no_str} onChange={(e) => setBidanForm((prev) => ({ ...prev, no_str: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">No SIPB</label>
                    <input type="text" value={bidanForm.no_sipb} onChange={(e) => setBidanForm((prev) => ({ ...prev, no_sipb: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-slate-600">Penduduk ID Opsional</label>
                    <input type="number" value={adminDesaForm.penduduk_id} onChange={(e) => setAdminDesaForm((prev) => ({ ...prev, penduduk_id: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Kosongkan jika akun murni login" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Desa</label>
                    <select value={adminDesaForm.desa_id} onChange={(e) => setAdminDesaForm((prev) => ({ ...prev, desa_id: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" disabled={loadingDesa}>
                      <option value="">{loadingDesa ? "Memuat desa..." : "Pilih desa"}</option>
                      {desaOptions.map((desa) => (
                        <option key={desa.id} value={desa.id}>{desa.nama_desa} - {desa.kode_desa}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-slate-600">Nama</label>
                    <input type="text" value={adminDesaForm.name} onChange={(e) => setAdminDesaForm((prev) => ({ ...prev, name: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Email</label>
                    <input type="email" value={adminDesaForm.email} onChange={(e) => setAdminDesaForm((prev) => ({ ...prev, email: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-slate-600">Nomor HP</label>
                    <input type="text" value={adminDesaForm.phone_number} onChange={(e) => setAdminDesaForm((prev) => ({ ...prev, phone_number: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Password Awal</label>
                    <input type="password" value={adminDesaForm.password} onChange={(e) => setAdminDesaForm((prev) => ({ ...prev, password: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Simpan
              </button>
              <button type="button" onClick={resetCreateForms} className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
                <X size={16} />
                Reset Form
              </button>
            </div>
          </form>

          <div className={`${cardClass} p-6 space-y-5`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Daftar user</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">Kelola bidan dan admin desa</h2>
              </div>
              <button onClick={handleRefresh} className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                <Loader2 size={16} />
                Refresh
              </button>
            </div>

            <form onSubmit={applyFilters} className="grid gap-3 md:grid-cols-4">
              <div className="md:col-span-2 relative">
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama, email, atau nomor HP"
                  className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4"
                />
              </div>
              <div>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-3 py-2.5">
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <select value={desaFilter} onChange={(e) => setDesaFilter(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-3 py-2.5" disabled={loadingDesa}>
                  <option value="">Semua desa</option>
                  {desaOptions.map((desa) => (
                    <option key={desa.id} value={desa.id}>{desa.nama_desa}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-4 flex gap-3">
                <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700">
                  <Search size={16} />
                  Terapkan Filter
                </button>
              </div>
            </form>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50 text-left text-sm text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Desa</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Kontak</th>
                    <th className="px-4 py-3 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-slate-500">Memuat data user...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-slate-500">Belum ada user yang sesuai filter</td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const isSuperadmin = (user.role || "").toLowerCase() === "superadmin";
                      const desaName = user.desa_name || (user.desa_id ? desaMap[String(user.desa_id)]?.nama_desa : "-") || "-";
                      return (
                        <tr key={user.id} className="border-t border-slate-100 align-top hover:bg-slate-50/70">
                          <td className="px-4 py-4">
                            <div className="font-semibold text-slate-900">{user.name}</div>
                            <div className="text-sm text-slate-500">ID {user.id}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{user.role}</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">
                            <div>{desaName}</div>
                            {user.desa_id ? <div className="text-xs text-slate-400">desa_id: {user.desa_id}</div> : null}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${user.is_active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                              {user.is_active ? "Aktif" : "Nonaktif"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">
                            <div>{user.email}</div>
                            <div className="text-xs text-slate-400">{user.phone_number || "-"}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              <button type="button" onClick={() => openResetModal(user)} className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100">
                                <KeyRound size={16} />
                                Reset Password
                              </button>
                              <button type="button" onClick={() => handleDeactivate(user)} disabled={isSuperadmin || submitting} className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60">
                                <Power size={16} />
                                {isSuperadmin ? "Dilindungi" : "Nonaktifkan"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {showResetModal && resetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Reset Password</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">{resetUser.name}</h3>
                <p className="mt-1 text-sm text-slate-500">Masukkan password baru untuk akun ini.</p>
              </div>
              <button type="button" onClick={() => setShowResetModal(false)} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitResetPassword} className="mt-5 space-y-4">
              <div>
                <label className="text-sm text-slate-600">Password Baru</label>
                <input type="password" value={resetForm.password} onChange={(e) => setResetForm({ password: e.target.value })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Minimal 8 karakter" />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowResetModal(false)} className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                  Simpan Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default UserManagement;
