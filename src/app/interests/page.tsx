"use client";

import { useEffect, useState } from "react";
import { api, errMsg, Pagination } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Nav from "@/components/Nav";
import Pager from "@/components/Pager";

export default function Interests() {
  const user = useAuth();
  const [groups, setGroups] = useState<{ _id: string; users: string[] }[]>([]);
  const [pg, setPg] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [interest, setInterest] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api
      .get("/users/interests", { params: { page, limit: 6, interest: interest || undefined } })
      .then((r) => {
        setGroups(r.data.data);
        setPg(r.data.pagination);
        setErr("");
      })
      .catch((e) => setErr(errMsg(e)))
      .finally(() => setLoading(false));
  }, [user, page, interest]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-sm">Loading interests directory...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav user={user} />
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Interests Directory</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                Aggregation Pipeline
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore user groups clustered by shared skills, hobbies, and topics
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Filter by interest (e.g. chess, crypto)..."
              value={interest}
              onChange={(e) => {
                setPage(1);
                setInterest(e.target.value);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {err && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {err}
          </div>
        )}

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((g) => (
            <div
              key={g._id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 p-5 shadow-lg shadow-black/20 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
                    <span className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
                      {g._id}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                    {g.users.length} {g.users.length === 1 ? "member" : "members"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {g.users.map((username, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {username}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {groups.length === 0 && !loading && (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400">
            <p className="text-sm font-medium">No interests found matching &quot;{interest}&quot;.</p>
          </div>
        )}

        <Pager p={pg} onPage={setPage} />
      </main>
    </>
  );
}
