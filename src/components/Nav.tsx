"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/lib/api";

export default function Nav({ user }: { user: User }) {
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    location.href = "/login";
  };

  const navLinks = [
    { href: "/notes", label: "My Notes", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { href: "/posts", label: "Community Feed", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
    { href: "/interests", label: "Interests", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
  ];

  const adminLinks = [
    { href: "/admin/users", label: "Manage Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { href: "/admin/notes", label: "Global Notes", icon: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/notes" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-white tracking-tight">SecureNotes</span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    Vault
                  </span>
                </div>
              </div>
            </Link>

            {/* Navigation tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      active
                        ? "bg-slate-800 text-indigo-400 border border-slate-700/80 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                    </svg>
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {user.role === "admin" && (
                <div className="flex items-center gap-1 pl-2 ml-2 border-l border-slate-800">
                  {adminLinks.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          active
                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                            : "text-slate-400 hover:text-amber-300 hover:bg-slate-800/60"
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                        </svg>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </nav>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  {user.role === "admin" ? (
                    <span className="text-amber-400 font-medium">Administrator</span>
                  ) : (
                    <span className="text-slate-400">{user.email}</span>
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout session"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/30 text-slate-300 hover:text-rose-300 text-xs font-medium transition flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center gap-2 py-2 border-t border-slate-800/80 overflow-x-auto text-xs">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition ${
                pathname === item.href ? "bg-slate-800 text-indigo-400 font-semibold" : "text-slate-400"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user.role === "admin" &&
            adminLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition ${
                  pathname === item.href ? "bg-amber-500/20 text-amber-300 font-semibold" : "text-amber-400/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
        </div>
      </div>
    </header>
  );
}
