import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SecureNotes — Encrypted Workspace & Notes Vault",
  description: "End-to-end protected notes, community posts, and access control management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
