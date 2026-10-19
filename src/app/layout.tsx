import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recipe Kitchen — Hybrid SSG + Dynamic Recipe Demo",
  description:
    "Next.js sample app demonstrating build-time static compilation (SSG) with RECIPE_DB_TOKEN vs. on-demand dynamic rendering (SSR)."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF7F2] text-stone-900 selection:bg-amber-200">
        <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#FAF7F2]/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="group flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-900 text-sm font-semibold tracking-wider text-amber-50 shadow-sm transition group-hover:bg-amber-800">
                RK
              </span>
              <div>
                <span className="block font-serif text-xl font-bold tracking-tight text-stone-900">
                  Recipe Kitchen
                </span>
                <span className="block text-[11px] font-medium uppercase tracking-widest text-stone-500">
                  Cloud Run Build &amp; Runtime Secrets Demo
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-3 text-xs font-medium">
              <Link
                href="/recipes/sourdough-focaccia"
                prefetch={true}
                className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-emerald-900 transition hover:bg-emerald-100"
              >
                ⚡ Sample Static Recipe
              </Link>
              <Link
                href="/recipes/matcha-tiramisu"
                prefetch={false}
                className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-amber-900 transition hover:bg-amber-100"
              >
                🔄 Sample Dynamic Recipe
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>

        <footer className="mt-16 border-t border-stone-200/80 bg-stone-900 py-8 text-stone-400">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 text-xs sm:flex-row sm:items-center">
            <p>
              <strong className="text-stone-200">Recipe Kitchen</strong> — Next.js App Router
              sample for Cloud Run &amp; Firebase App Hosting build and runtime secrets.
            </p>
            <p className="font-mono text-[11px] text-stone-400">
              Secret env: <code className="text-amber-300">RECIPE_DB_TOKEN</code> (required at{" "}
              <code className="text-emerald-300">BUILD</code> &amp;{" "}
              <code className="text-amber-300">RUNTIME</code>)
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
