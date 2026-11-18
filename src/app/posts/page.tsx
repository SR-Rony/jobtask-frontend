"use client";

import { useCallback, useEffect, useState } from "react";
import { api, errMsg, Pagination } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Nav from "@/components/Nav";
import Pager from "@/components/Pager";

export default function Posts() {
  const user = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [pg, setPg] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ title: "", content: "" });
  const [uid, setUid] = useState("");
  const [owner, setOwner] = useState("");
  const [err, setErr] = useState("");
  const [publishing, setPublishing] = useState(false);

  const load = useCallback(async () => {
    try {
      if (uid) {
        const r = await api.get(`/users/${uid}/posts`, { params: { page, limit: 6 } });
        setPosts(r.data.data.posts);
        setOwner(r.data.data.user.name);
        setPg(r.data.pagination);
      } else {
        const r = await api.get("/posts", { params: { page, limit: 6 } });
        setPosts(r.data.data);
        setOwner("");
        setPg(r.data.pagination);
      }
      setErr("");
    } catch (e) {
      setErr(errMsg(e));
    }
  }, [page, uid]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErr("Please provide a title for the post");
      return;
    }
    setPublishing(true);
    try {
      await api.post("/posts", form);
      setForm({ title: "", content: "" });
      load();
    } catch (e) {
      setErr(errMsg(e));
    } finally {
      setPublishing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-sm">Loading community posts...</span>
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
              <span>Community Feed</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                Public Posts
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore shared updates and articles published by all members
            </p>
          </div>

          {/* Filter by User ID */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by User ID ($lookup)..."
                value={uid}
                onChange={(e) => {
                  setPage(1);
                  setUid(e.target.value.trim());
                }}
                className="w-56 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
            </div>
            {uid && (
              <button
                onClick={() => {
                  setUid("");
                  setPage(1);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Indicator */}
        {owner && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
            <span>
              Showing posts authored by <b className="text-white">{owner}</b>
            </span>
            <button
              onClick={() => {
                setUid("");
                setPage(1);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-200 underline"
            >
              Show all posts
            </button>
          </div>
        )}

        {/* Global Error Banner */}
        {err && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{err}</span>
            <button onClick={() => setErr("")} className="text-slate-400 hover:text-slate-200">✕</button>
          </div>
        )}

        {/* Create Public Post Card */}
        <section className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl p-5 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Create a New Public Post
          </h2>
          <form onSubmit={create} className="space-y-3">
            <input
              type="text"
              placeholder="Post title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition font-medium"
            />
            <textarea
              rows={3}
              placeholder="What would you like to share with the community?"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={publishing}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-medium shadow-md shadow-blue-500/20 disabled:opacity-50 transition flex items-center gap-1.5"
              >
                {publishing && (
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                <span>Publish Post</span>
              </button>
            </div>
          </form>
        </section>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((p) => {
            const authorName = p.userId?.name || "Community Member";
            const authorInitial = authorName.charAt(0).toUpperCase();

            return (
              <article
                key={p._id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 p-5 shadow-lg shadow-black/20 transition"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                      {authorInitial}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{authorName}</div>
                      <div className="text-[10px] text-slate-500">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Published"}
                      </div>
                    </div>
                  </div>

                  {p.userId?._id && (
                    <button
                      onClick={() => {
                        setPage(1);
                        setUid(p.userId._id);
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-indigo-400 font-medium transition flex items-center gap-1"
                    >
                      <span>Filter by author</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>

                <h3 className="font-semibold text-base text-slate-100 mb-2">{p.title}</h3>
                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{p.content}</p>
              </article>
            );
          })}

          {posts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400">
              <p className="text-sm font-medium">No posts found in this view.</p>
            </div>
          )}

          <Pager p={pg} onPage={setPage} />
        </div>
      </main>
    </>
  );
}
