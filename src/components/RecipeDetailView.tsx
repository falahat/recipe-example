import Link from "next/link";
import { ClientLoadTimer } from "@/components/ClientLoadTimer";
import { Recipe } from "@/lib/recipes";

interface RecipeDetailViewProps {
  recipe: Recipe;
  renderMode: "STATIC_BUILD_TIME" | "DYNAMIC_REQUEST_TIME";
  renderedAt: string;
  requestDbQueryMs: number;
  buildDbQueryMs: number | null;
  photoUrl: string;
}

export function RecipeDetailView({
  recipe,
  renderMode,
  renderedAt,
  requestDbQueryMs,
  buildDbQueryMs,
  photoUrl
}: RecipeDetailViewProps) {
  const isStatic = renderMode === "STATIC_BUILD_TIME";

  return (
    <article className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          prefetch={true}
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
        >
          <span>←</span>
          <span>Back to all recipes</span>
        </Link>

        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/recipes/sourdough-focaccia"
            prefetch={true}
            className="rounded-full border border-stone-200 bg-white px-3 py-1 text-stone-700 hover:border-stone-300"
          >
            Compare Static (Focaccia)
          </Link>
          <Link
            href="/recipes/matcha-tiramisu"
            prefetch={false}
            className="rounded-full border border-stone-200 bg-white px-3 py-1 text-stone-700 hover:border-stone-300"
          >
            Compare Dynamic (Tiramisu)
          </Link>
        </div>
      </div>

      {/* Render Mode & Live Measured Timing Inspector Banner */}
      <div
        className={`rounded-2xl border p-5 shadow-sm ${
          isStatic
            ? "border-emerald-300 bg-emerald-50/90 text-emerald-950"
            : "border-amber-300 bg-amber-50/90 text-amber-950"
        }`}
      >
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  isStatic ? "bg-emerald-600" : "bg-amber-600"
                }`}
              />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                {isStatic
                  ? "● Static Build-Time Page (SSG · x-nextjs-cache: HIT)"
                  : "ƒ Dynamic Request-Time Page (SSR · Cache-Control: no-store)"}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${
                  isStatic
                    ? "bg-emerald-800 text-emerald-50"
                    : "bg-amber-800 text-amber-50"
                }`}
              >
                {isStatic
                  ? "0 ms DB query on request"
                  : `${requestDbQueryMs} ms live DB API query`}
              </span>
            </div>
            <p className="text-sm opacity-90">
              {isStatic ? (
                <>
                  Pre-compiled during <code className="font-mono font-semibold">next build</code>{" "}
                  using the <strong>BUILD</strong> secret{" "}
                  <code className="font-mono font-semibold">RECIPE_DB_TOKEN</code> (build-time DB
                  fetch took <code className="font-mono">{buildDbQueryMs} ms</code>). Served from
                  static cache with <strong>0 runtime DB calls</strong>.
                </>
              ) : (
                <>
                  Not pre-compiled at build time. Every request authenticates to{" "}
                  <code className="font-mono font-semibold">recipe-db-api</code> using the{" "}
                  <strong>RUNTIME</strong> secret{" "}
                  <code className="font-mono font-semibold">RECIPE_DB_TOKEN</code> (this request
                  took <code className="font-mono">{requestDbQueryMs} ms</code>) and streams the
                  photo on demand via <code className="font-mono">/api/recipe-photo/{recipe.slug}</code>.
                </>
              )}
            </p>
          </div>

          <div className="shrink-0 rounded-xl border border-black/10 bg-white/85 px-4 py-2.5 font-mono text-xs">
            <span className="block text-[10px] uppercase tracking-wider text-stone-500">
              {isStatic ? "Compiled at (Build Timestamp)" : "Queried at (Live Request Timestamp)"}
            </span>
            <span className="font-semibold text-stone-900">{renderedAt}</span>
          </div>
        </div>

        <ClientLoadTimer
          photoUrl={photoUrl}
          isStatic={isStatic}
          serverDbMs={requestDbQueryMs}
        />
      </div>

      {/* Hero Card with Gemini-generated Photo */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-12">
          <div className="relative min-h-[340px] overflow-hidden bg-stone-900 lg:col-span-5">
            <img
              src={photoUrl}
              alt={recipe.title}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="rounded-full bg-black/75 px-3 py-1 font-mono text-[11px] font-semibold text-white backdrop-blur-sm">
                {isStatic ? `Static Asset: ${photoUrl}` : `Dynamic API Stream: ${photoUrl}`}
              </span>
              <span
                className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold shadow-sm ${
                  isStatic
                    ? "bg-emerald-400 text-emerald-950"
                    : "bg-amber-300 text-amber-950"
                }`}
              >
                {recipe.photoSizeKb} KB JPG
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/70 px-3.5 py-2 text-xs text-stone-100 backdrop-blur-sm">
              {isStatic
                ? "✓ Gemini-generated photo bundled into static assets during build (Cache-Control: immutable)"
                : "⏳ Gemini-generated photo fetched on demand from recipe-db-api with runtime RECIPE_DB_TOKEN"}
            </div>
          </div>

          <div className="flex flex-col justify-between p-8 lg:col-span-7 lg:p-10">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-500">
                <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-800">
                  {recipe.category}
                </span>
                <span>•</span>
                <span className="font-mono">{recipe.weeklyViews}</span>
              </div>

              <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                {recipe.title}
              </h1>
              <p className="text-base leading-relaxed text-stone-600">{recipe.subtitle}</p>

              <div className="rounded-2xl border border-stone-200 bg-[#FAF7F2] p-4 text-xs text-stone-700">
                <strong className="font-semibold text-stone-900">Architecture Note: </strong>
                {recipe.chefNote}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-stone-100 pt-6 text-center">
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-stone-400">
                  Prep Time
                </span>
                <span className="mt-1 block font-serif text-base font-bold text-stone-900">
                  {recipe.prepTime}
                </span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-stone-400">
                  Cook Time
                </span>
                <span className="mt-1 block font-serif text-base font-bold text-stone-900">
                  {recipe.cookTime}
                </span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-stone-400">
                  Yield
                </span>
                <span className="mt-1 block font-serif text-base font-bold text-stone-900">
                  {recipe.servings} Servings
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients & Preparation Steps */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm lg:col-span-5">
          <h2 className="font-serif text-xl font-bold text-stone-900">Ingredients</h2>
          <p className="mt-1 text-xs text-stone-500">
            Fetched from authenticated <code className="font-mono">recipe-db-api</code>{" "}
            {isStatic ? "at build time (BUILD secret)" : "at request time (RUNTIME secret)"}
          </p>
          <ul className="mt-5 space-y-3 text-sm text-stone-700">
            {recipe.ingredients.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 border-b border-stone-100 pb-2.5 last:border-none"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm lg:col-span-7">
          <h2 className="font-serif text-xl font-bold text-stone-900">Preparation</h2>
          <p className="mt-1 text-xs text-stone-500">Step-by-step test kitchen method</p>
          <ol className="mt-5 space-y-5">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-900 font-mono text-xs font-bold text-amber-50">
                  {idx + 1}
                </span>
                <p className="pt-0.5 text-sm leading-relaxed text-stone-700">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}
