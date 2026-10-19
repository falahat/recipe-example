import Link from "next/link";
import { getCatalogForStaticHome, Recipe } from "@/lib/recipes";

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const isStatic = recipe.popular;
  const photoSrc = isStatic
    ? `/photos/${recipe.slug}.jpg`
    : `/api/recipe-photo/${recipe.slug}`;

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      prefetch={isStatic}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
    >
      <div className="relative h-52 w-full overflow-hidden bg-stone-200">
        <img
          src={photoSrc}
          alt={recipe.title}
          loading={isStatic ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        {/* Top badges: Render Mode + Cache/DB Behavior */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {isStatic ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/90 px-3 py-1 font-mono text-[11px] font-semibold text-emerald-200 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              STATIC · BUILD SECRET
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/90 px-3 py-1 font-mono text-[11px] font-semibold text-amber-200 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              DYNAMIC · RUNTIME SECRET
            </span>
          )}

          <span
            className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-bold shadow-sm backdrop-blur-sm ${
              isStatic
                ? "bg-emerald-400/95 text-emerald-950"
                : "bg-amber-300/95 text-amber-950"
            }`}
          >
            {isStatic ? "⚡ 0 ms DB on req" : "🔄 Live DB + Photo API"}
          </span>
        </div>

        {/* Bottom overlay: Category + Weekly traffic */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/95">
          <span className="rounded-md bg-black/50 px-2 py-0.5 font-medium backdrop-blur-sm">
            {recipe.category}
          </span>
          <span className="font-mono text-[11px] text-stone-200">
            {recipe.weeklyViews}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="font-serif text-lg font-bold leading-snug text-stone-900 group-hover:text-amber-800">
            {recipe.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone-600">
            {recipe.subtitle}
          </p>
        </div>

        <div className="mt-4 space-y-2.5 border-t border-stone-100 pt-3.5">
          <div
            className={`rounded-xl px-3 py-2 font-mono text-[11px] ${
              isStatic
                ? "border border-emerald-200/80 bg-emerald-50/70 text-emerald-950"
                : "border border-amber-200/80 bg-amber-50/70 text-amber-950"
            }`}
          >
            <div className="flex items-center justify-between font-semibold">
              <span>Request-Time DB Queries:</span>
              <span>{isStatic ? "0 (x-nextjs-cache: HIT)" : "2 (JSON + Photo API)"}</span>
            </div>
            <div className="mt-0.5 flex items-center justify-between text-[10px] opacity-85">
              <span>Secret: {isStatic ? "BUILD" : "RUNTIME"}</span>
              <span>
                Photo ({recipe.photoSizeKb} KB): {isStatic ? "Static /photos" : "Streamed"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>
              Prep: {recipe.prepTime} · Cook: {recipe.cookTime}
            </span>
            <span className="font-semibold text-amber-800 group-hover:translate-x-0.5 transition">
              Inspect load →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const { popularRecipes, dynamicRecipes, buildMeta } = await getCatalogForStaticHome();

  return (
    <div className="space-y-12">
      {/* Editorial Hero + Build & Runtime Secret Architecture */}
      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="grid gap-8 p-8 lg:grid-cols-12 lg:items-center lg:p-10">
          <div className="space-y-5 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-900">
              <span>🔐 Build + Runtime Secret Demo</span>
              <span className="text-amber-400">•</span>
              <span className="font-mono">RECIPE_DB_TOKEN</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Pre-compile popular recipes at build time; query long-tail recipes on demand at runtime.
            </h1>
            <p className="text-base leading-relaxed text-stone-600">
              Our Recipe Database API (<code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs text-stone-800">recipe-db-api</code>)
              requires a valid <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs font-semibold text-amber-950">Authorization: Bearer &lt;RECIPE_DB_TOKEN&gt;</code>{" "}
              header and returns <code className="rounded bg-red-50 px-1.5 py-0.5 font-mono text-xs text-red-800">HTTP 401 Unauthorized</code>{" "}
              without it. By providing <code className="font-mono text-xs font-semibold">RECIPE_DB_TOKEN</code> at{" "}
              <strong>both BUILD and RUNTIME</strong>:
            </p>

            <div className="rounded-2xl border border-stone-200 bg-[#FAF7F2] p-4 font-mono text-xs space-y-2.5">
              <div className="flex items-start justify-between gap-4 border-b border-stone-200/80 pb-2">
                <div>
                  <span className="font-bold text-emerald-900">⚡ Popular Recipes (BUILD Secret · SSG)</span>
                  <p className="mt-0.5 font-sans text-xs text-stone-600">
                    Queried once during <code className="font-mono">next build</code>. Served from{" "}
                    <code className="font-mono">x-nextjs-cache: HIT</code> + static <code className="font-mono">/photos/*.jpg</code>{" "}
                    with <strong>0 runtime DB calls</strong>.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900">
                  0 ms DB wait
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-bold text-amber-900">🔄 Long-Tail Recipes (RUNTIME Secret · SSR)</span>
                  <p className="mt-0.5 font-sans text-xs text-stone-600">
                    Uncached (<code className="font-mono">Cache-Control: no-store</code>). Every request queries{" "}
                    <code className="font-mono">recipe-db-api</code> live for recipe JSON + photo bytes.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
                  Live DB fetch
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-6 font-mono text-xs text-stone-200 shadow-inner">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-stone-400">RECIPE DB API VERIFICATION</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  HTTP 200 OK
                </span>
              </div>

              <dl className="mt-4 space-y-2.5">
                <div className="flex justify-between gap-2">
                  <dt className="text-stone-400">Secret Env Var:</dt>
                  <dd className="text-amber-300">RECIPE_DB_TOKEN</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-stone-400">Secret Availability:</dt>
                  <dd className="text-emerald-300">BUILD + RUNTIME</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-stone-400">Build DB Auth:</dt>
                  <dd className="text-stone-100">{buildMeta.authStatus}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-stone-400">Build DB Fetch Time:</dt>
                  <dd className="text-emerald-300">{buildMeta.buildDbFetchMs} ms (at next build)</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-stone-400">Static Build Timestamp:</dt>
                  <dd className="text-stone-300">{buildMeta.compiledAt}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Statically Compiled Popular Recipes */}
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-2 border-b border-stone-200 pb-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-900">
                ● SSG · BUILD SECRET · x-nextjs-cache: HIT
              </span>
              <span className="text-xs font-medium text-stone-500">
                Fetched once during <code className="font-mono">next build</code> using{" "}
                <code className="font-mono">RECIPE_DB_TOKEN</code>
              </span>
            </div>
            <h2 className="mt-2 font-serif text-2xl font-bold text-stone-900">
              Popular Recipes — Statically Compiled at Build Time
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            0 runtime DB calls · Pre-bundled static photos (<code className="font-mono">/photos/*.jpg</code>)
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularRecipes.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Dynamically Generated Recipes */}
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-2 border-b border-stone-200 pb-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-900">
                ƒ SSR · RUNTIME SECRET · Cache-Control: no-store
              </span>
              <span className="text-xs font-medium text-stone-500">
                Queries <code className="font-mono">recipe-db-api</code> on every request using{" "}
                <code className="font-mono">RECIPE_DB_TOKEN</code>
              </span>
            </div>
            <h2 className="mt-2 font-serif text-2xl font-bold text-stone-900">
              Seasonal &amp; Long-Tail Recipes — Dynamically Generated on Demand
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            Uncached SSR per request · Authenticated photo stream (<code className="font-mono">/api/recipe-photo/*</code>)
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dynamicRecipes.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      </section>
    </div>
  );
}
