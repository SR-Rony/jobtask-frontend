"use client";

import { useEffect, useState } from "react";
import { api, errMsg, Pagination } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Nav from "@/components/Nav";
import Pager from "@/components/Pager";

export default function AdminNotes() {
  const user = useAuth(true);
  const [notes, setNotes] = useState<any[]>([]);
  const [pg, setPg] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api
      .get("/notes", { params: { scope: "all", page, limit: 8 } })
      .then((r) => {
        setNotes(r.data.data);
        setPg(r.data.pagination);
        setErr("");
      })
      .catch((e) => setErr(errMsg(e)))
      .finally(() => setLoading(false));
  }, [user, page]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-sm">Loading administrator vault view...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav user={user} />
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>All Users&#39; Notes</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                Global Audit Scope
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Administrator system audit of all stored encrypted notes across all accounts
            </p>
          </div>
        </div>

        {err && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {err}
          </div>
        )}

        {/* Global Notes Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((n) => (
              <div
                key={n._id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 p-5 shadow-lg shadow-black/20 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-[10px] flex items-center justify-center">
                        {n.userId?.name ? n.userId.name.charAt(0) : "U"}
                      </div>
                      <span className="text-xs font-medium text-slate-300">
                        {n.userId?.name || "Unknown Author"}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {n.userId?.email || ""}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-slate-100 mb-1.5">{n.title}</h3>
                  <p className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed line-clamp-4">
                    {n.content}
                  </p>
                </div>

                <div className="mt-3 pt-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/40">
                  <span>Note ID: {n._id}</span>
                  {n.createdAt && <span>{new Date(n.createdAt).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </div>

          {notes.length === 0 && !loading && (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400">
              <p className="text-sm font-medium">No notes recorded in database.</p>
            </div>
          )}

          <Pager p={pg} onPage={setPage} />
        </div>
      </main>
    </>
  );
}
