"use client";

import { useEffect, useState } from "react";

interface ClientLoadTimerProps {
  photoUrl: string;
  isStatic: boolean;
  serverDbMs: number;
}

export function ClientLoadTimer({ photoUrl, isStatic, serverDbMs }: ClientLoadTimerProps) {
  const [metrics, setMetrics] = useState<{
    routeMs: number | null;
    routeLabel: string;
    photoMs: number | null;
    photoServerTimingMs: number | null;
  }>({
    routeMs: null,
    routeLabel: "TTFB",
    photoMs: null,
    photoServerTimingMs: null
  });

  useEffect(() => {
    function measure() {
      const currentPath = window.location.pathname;
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      const nav = navEntries[0];

      let navMatchesCurrentPath = false;
      if (nav && nav.name) {
        try {
          navMatchesCurrentPath = new URL(nav.name).pathname === currentPath;
        } catch {
          navMatchesCurrentPath = nav.name.includes(currentPath);
        }
      }

      let routeMs: number | null = null;
      let routeLabel = "TTFB";

      // Find the real RSC fetch entry if navigated via Next.js <Link>, or use document navigation TTFB
      const rscEntries = resources.filter(
        (r) => r.name.includes(currentPath) && (r.initiatorType === "fetch" || r.name.includes("_rsc"))
      );
      const latestRsc = rscEntries[rscEntries.length - 1];

      if (!navMatchesCurrentPath && latestRsc && latestRsc.responseEnd > latestRsc.startTime) {
        routeMs = Math.round((latestRsc.responseEnd - latestRsc.startTime) * 10) / 10;
        routeLabel = "Route Fetch";
      } else if (nav && nav.responseStart > nav.requestStart) {
        routeMs = Math.round((nav.responseStart - nav.requestStart) * 10) / 10;
        routeLabel = "TTFB";
      }

      // Find the real PerformanceResourceTiming entry for the photo
      const matchingPhotos = resources.filter((r) => r.name.includes(photoUrl));
      const photoEntry = matchingPhotos[matchingPhotos.length - 1];
      let photoMs: number | null = null;
      let photoServerTimingMs: number | null = null;

      if (photoEntry && photoEntry.responseEnd > photoEntry.startTime) {
        photoMs = Math.round((photoEntry.responseEnd - photoEntry.startTime) * 10) / 10;
        const st = (photoEntry as PerformanceResourceTiming & {
          serverTiming?: Array<{ name: string; duration: number }>;
        }).serverTiming;
        if (st && st.length > 0) {
          const dbTiming = st.find((x) => x.name === "db-photo-fetch");
          if (dbTiming) {
            photoServerTimingMs = Math.round(dbTiming.duration * 10) / 10;
          }
        }
      }

      setMetrics({
        routeMs,
        routeLabel,
        photoMs,
        photoServerTimingMs
      });
    }

    measure();
    const t1 = setTimeout(measure, 150);
    const t2 = setTimeout(measure, 600);
    window.addEventListener("load", measure);

    let observer: PerformanceObserver | null = null;
    if (typeof PerformanceObserver !== "undefined") {
      try {
        observer = new PerformanceObserver(() => measure());
        observer.observe({ entryTypes: ["resource", "navigation"] });
      } catch {
        // Ignore if entryTypes not supported
      }
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("load", measure);
      observer?.disconnect();
    };
  }, [photoUrl, isStatic]);

  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-stone-200/80 bg-white/90 px-3.5 py-2.5">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400">
          1. Server DB Query on Request
        </span>
        <span
          className={`mt-0.5 block font-mono text-sm font-bold ${
            isStatic ? "text-emerald-800" : "text-amber-800"
          }`}
        >
          {isStatic ? "0 ms (cached at build)" : `${serverDbMs} ms (live DB API)`}
        </span>
        <span className="block text-[11px] text-stone-500">
          {isStatic
            ? "x-nextjs-cache: HIT · 0 runtime DB calls"
            : "Cache-Control: no-store · Bearer auth"}
        </span>
      </div>

      <div className="rounded-xl border border-stone-200/80 bg-white/90 px-3.5 py-2.5">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400">
          2. Photo Source &amp; DB Fetch
        </span>
        <span
          className={`mt-0.5 block font-mono text-sm font-bold ${
            isStatic ? "text-emerald-800" : "text-amber-800"
          }`}
        >
          {isStatic
            ? "0 ms DB (static /photos/*.jpg)"
            : metrics.photoServerTimingMs !== null
              ? `${metrics.photoServerTimingMs} ms DB photo fetch`
              : "Live /api/recipe-photo stream"}
        </span>
        <span className="block text-[11px] text-stone-500">
          {isStatic
            ? "Cache-Control: immutable (bundled at build)"
            : "Authenticated runtime fetch from Recipe DB"}
        </span>
      </div>

      <div className="rounded-xl border border-stone-200/80 bg-white/90 px-3.5 py-2.5">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400">
          3. Browser Measured (Client)
        </span>
        <span className="mt-0.5 block font-mono text-sm font-bold text-stone-900">
          {metrics.routeMs !== null ? `${metrics.routeLabel}: ${metrics.routeMs} ms` : "Measuring..."}{" "}
          {metrics.photoMs !== null ? `· Photo: ${metrics.photoMs} ms` : ""}
        </span>
        <span className="block text-[11px] text-stone-500">
          Measured via Browser Performance API
        </span>
      </div>
    </div>
  );
}
