import { Pagination } from "@/lib/api";

export default function Pager({
  p,
  onPage,
}: {
  p: Pagination | null;
  onPage: (n: number) => void;
}) {
  if (!p || p.totalPages <= 1) {
    if (p && p.totalItems > 0) {
      return (
        <div className="text-center py-3 text-xs text-slate-500">
          Showing all {p.totalItems} item{p.totalItems === 1 ? "" : "s"}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80 my-4 text-xs">
      <div className="text-slate-400">
        Page <span className="font-semibold text-slate-200">{p.currentPage}</span> of{" "}
        <span className="font-semibold text-slate-200">{Math.max(p.totalPages, 1)}</span>{" "}
        <span className="text-slate-500">({p.totalItems} total)</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={p.currentPage <= 1}
          onClick={() => onPage(p.currentPage - 1)}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700 disabled:opacity-40 disabled:hover:bg-slate-900 disabled:cursor-not-allowed font-medium transition flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <button
          type="button"
          disabled={p.currentPage >= p.totalPages}
          onClick={() => onPage(p.currentPage + 1)}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700 disabled:opacity-40 disabled:hover:bg-slate-900 disabled:cursor-not-allowed font-medium transition flex items-center gap-1"
        >
          <span>Next</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
