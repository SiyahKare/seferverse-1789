import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 bg-slate-900/80 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
          <span className="font-semibold tracking-tight">SeferVerse 1789</span>
          <span className="ml-auto text-xs text-slate-400">Deployment Dashboard</span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10">
        {children}
      </main>
      <footer className="py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} SeferVerse 1789
      </footer>
    </div>
  );
}


