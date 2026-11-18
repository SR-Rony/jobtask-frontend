"use client";

import { useCallback, useEffect, useState } from "react";
import { api, errMsg, Pagination, User } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Nav from "@/components/Nav";
import Pager from "@/components/Pager";

const empty = { name: "", email: "", password: "", role: "user", interests: "" };

export default function AdminUsers() {
  const me = useAuth(true);
  const [users, setUsers] = useState<User[]>([]);
  const [pg, setPg] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [f, setF] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get("/admin/users", { params: { page, limit: 6 } })
      .then((r) => {
        setUsers(r.data.data);
        setPg(r.data.pagination);
        if (!r.data.data.length && page > 1) setPage(page - 1);
      })
      .catch((e) => setErr(errMsg(e)))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    if (me) load();
  }, [me, load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    const body: any = {
      name: f.name.trim(),
      email: f.email.trim(),
      role: f.role,
      interests: f.interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (f.password) body.password = f.password;

    try {
      if (editId) {
        await api.patch(`/admin/users/${editId}`, body);
      } else {
        await api.post("/admin/users", body);
      }
      setF(empty);
      setEditId(null);
      load();
    } catch (e) {
      setErr(errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user and all their notes & posts?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      load();
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  const startEdit = (u: User) => {
    setEditId(u._id);
    setF({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      interests: u.interests.join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!me) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-sm">Verifying administrator permissions...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav user={me} />
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>User Management</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                Admin Area
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Add new members, change roles, edit profile attributes, or remove accounts
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {err && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{err}</span>
            <button onClick={() => setErr("")} className="text-slate-400 hover:text-slate-200">✕</button>
          </div>
        )}

        {/* User Form Card */}
        <section className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl p-5 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${editId ? "bg-amber-400" : "bg-indigo-400"}`} />
            {editId ? "Edit User Account" : "Provision New User"}
          </h2>

          <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Name
              </label>
              <input
                required
                type="text"
                placeholder="Full name"
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                required
                type="email"
                placeholder="user@example.com"
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Password {editId && <span className="lowercase text-slate-500">(leave blank to keep unchanged)</span>}
              </label>
              <input
                type="password"
                placeholder={editId ? "••••••••" : "Minimum 8 characters"}
                value={f.password}
                onChange={(e) => setF({ ...f, password: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Role Permission
              </label>
              <select
                value={f.role}
                onChange={(e) => setF({ ...f, role: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              >
                <option value="user">Standard User (user)</option>
                <option value="admin">Administrator (admin)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Interests <span className="lowercase text-slate-500">(comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. security, cloud, kubernetes"
                value={f.interests}
                onChange={(e) => setF({ ...f, interests: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setF(empty);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white text-xs font-medium shadow-md shadow-indigo-500/20 disabled:opacity-50 transition flex items-center gap-1.5"
              >
                {saving && (
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                <span>{editId ? "Update User" : "Create User"}</span>
              </button>
            </div>
          </form>
        </section>

        {/* Users Table / Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Registered Accounts {pg ? `(${pg.totalItems})` : ""}
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {users.map((u) => (
              <div
                key={u._id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 p-4 shadow-lg shadow-black/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-inner ${
                      u.role === "admin"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-100">{u.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded-full font-semibold uppercase ${
                          u.role === "admin"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{u.email}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Interests: {u.interests && u.interests.length ? u.interests.join(", ") : "None"} · ID: {u._id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => startEdit(u)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => remove(u._id)}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium transition flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pager p={pg} onPage={setPage} />
        </div>
      </main>
    </>
  );
}
