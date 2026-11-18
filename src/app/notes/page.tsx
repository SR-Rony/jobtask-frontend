"use client";

import { useCallback, useEffect, useState } from "react";
import { api, errMsg, Pagination } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Nav from "@/components/Nav";
import Pager from "@/components/Pager";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NotesPage() {
  const user = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [pg, setPg] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get("/notes", { params: { page, limit: 6 } });
      setNotes(r.data.data);
      setPg(r.data.pagination);
      if (r.data.data.length === 0 && page > 1) setPage(page - 1);
    } catch (e) {
      setErr(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!form.title.trim()) {
      setErr("Please enter a note title");
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await api.patch(`/notes/${editId}`, form);
      } else {
        await api.post("/notes", form);
      }
      setForm({ title: "", content: "" });
      setEditId(null);
      load();
    } catch (e) {
      setErr(errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note? This action cannot be undone.")) return;
    try {
      await api.delete(`/notes/${id}`);
      load();
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  const startEdit = (n: Note) => {
    setEditId(n._id);
    setForm({ title: n.title, content: n.content });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ title: "", content: "" });
  };

  const filteredNotes = notes.filter((n) =>
    search
      ? n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
      : true
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-sm">Loading your secure vault...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav user={user} />
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 w-full space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>My Secure Notes</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Encrypted Vault
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Personal protected notes accessible only with your authenticated token
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {err && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{err}</span>
            </div>
            <button onClick={() => setErr("")} className="text-slate-400 hover:text-slate-200">✕</button>
          </div>
        )}

        {/* Create / Edit Note Card */}
        <section className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${editId ? "bg-amber-400" : "bg-indigo-400"}`} />
              {editId ? "Edit Note" : "Write a New Encrypted Note"}
            </h2>
            {editId && (
              <span className="text-xs text-amber-400 font-medium">Currently Editing</span>
            )}
          </div>

          <form onSubmit={save} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Note title (e.g. Server Credentials or Project Roadmap)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition font-medium"
              />
            </div>
            <div>
              <textarea
                rows={4}
                placeholder="Write your secure note content here..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition font-normal"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                {form.content.length} characters
              </span>
              <div className="flex items-center gap-2">
                {editId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-xs font-medium shadow-md shadow-indigo-500/20 disabled:opacity-50 transition flex items-center gap-1.5"
                >
                  {saving && (
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  )}
                  <span>{editId ? "Update Note" : "Save Note"}</span>
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Notes Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Stored Notes {pg ? `(${pg.totalItems})` : ""}
            </h3>
            {loading && <span className="text-xs text-indigo-400 animate-pulse">Syncing...</span>}
          </div>

          {filteredNotes.length === 0 && !loading ? (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-slate-300">
                {search ? "No matching notes found" : "No notes saved yet"}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {search ? "Try searching with a different term." : "Use the editor above to save your first private note."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotes.map((n) => (
                <div
                  key={n._id}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 p-5 shadow-lg shadow-black/20 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-semibold text-sm text-slate-100 group-hover:text-indigo-300 transition line-clamp-1">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {new Date(n.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed line-clamp-5">
                      {n.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-800/80">
                    <button
                      onClick={() => startEdit(n)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => remove(n._id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium transition flex items-center gap-1"
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
          )}

          <Pager p={pg} onPage={setPage} />
        </div>
      </main>
    </>
  );
}
