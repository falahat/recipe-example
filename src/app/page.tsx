import Link from "next/link";
import { getCatalogForStaticHome, Recipe } from "@/lib/recipes";

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const isStatic = recipe.popular;
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
    >
      <div className="relative h-52 w-full overflow-hidden bg-stone-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        <div className="absolute left-3.5 top-3.5 flex items-center gap-2">
          {isStatic ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-950/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-200 shadow-sm backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              ⚡ STATIC · Compiled at Build
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-950/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-amber-200 shadow-sm backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              🔄 DYNAMIC · Rendered on Request
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white/95">
          <span className="rounded-md bg-black/45 px-2.5 py-0.5 font-medium backdrop-blur-sm">
            {recipe.category}
          </span>
          <span className="font-mono text-[11px] font-medium text-amber-200">
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

        <div className="mt-5 border-t border-stone-100 pt-3.5">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Prep: {recipe.prepTime}</span>
            <span>Cook: {recipe.cookTime}</span>
            <span className="font-semibold text-amber-800 group-hover:translate-x-0.5 transition-transform">
              View recipe →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { popularRecipes, dynamicRecipes, buildMeta } = getCatalogForStaticHome();

  return (
    <div className="space-y-12">
      {/* Editorial Hero + Build Secret Status Banner */}
      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="grid gap-8 p-8 lg:grid-cols-12 lg:items-center lg:p-10">
          <div className="space-y-4 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-900">
              <span>🔐 Build-Time Secret Demo</span>
              <span className="text-amber-400">•</span>
              <span className="font-mono">RECIPE_DB_TOKEN</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Pre-compile popular recipes at build time. Render the long tail on demand.
            </h1>
            <p className="text-base leading-relaxed text-stone-600">
              During <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-sm text-stone-800">next build</code>,
              this app authenticates with the Recipe DB using{" "}
              <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-sm font-semibold text-amber-950">
                RECIPE_DB_TOKEN
              </code>{" "}
              to statically compile our top high-traffic recipes via{" "}
              <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-sm text-stone-800">
                generateStaticParams()
              </code>
              . Less common recipes are rendered dynamically per request.
            </p>
          </div>

          {/* Live Build Verification Card */}
          <div className="rounded-2xl border border-stone-200 bg-stone-900 p-6 text-stone-100 shadow-inner lg:col-span-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-stone-400">
                Build-Time DB Verification
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                AUTHENTICATED
              </span>
            </div>

            <dl className="mt-4 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <dt className="text-stone-400">Secret Env Var:</dt>
                <dd className="rounded bg-stone-800 px-2 py-0.5 text-amber-300">RECIPE_DB_TOKEN</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-stone-400">Token Used at Build:</dt>
                <dd className="text-emerald-300">{buildMeta.maskedToken}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-stone-400">Static Build Time:</dt>
                <dd className="text-stone-200">{buildMeta.compiledAt}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-stone-400">Static / Dynamic Split:</dt>
                <dd className="text-stone-200">
                  {popularRecipes.length} SSG · {dynamicRecipes.length} SSR
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Section 1: Statically Compiled Popular Recipes */}
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-2 border-b border-stone-200 pb-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-emerald-900">
                ● SSG · generateStaticParams()
              </span>
              <span className="text-xs font-medium text-stone-500">
                Fetched during build using <code className="font-mono">RECIPE_DB_TOKEN</code>
              </span>
            </div>
            <h2 className="mt-1.5 font-serif text-2xl font-bold text-stone-900">
              Popular Recipes — Statically Compiled at Build Time
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            Pre-rendered into static HTML during <code className="font-mono">next build</code> for
            instant load &amp; CDN caching
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularRecipes.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Section 2: Dynamically Generated Recipes */}
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-2 border-b border-stone-200 pb-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-amber-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-amber-900">
                ƒ SSR · Dynamic on Request
              </span>
              <span className="text-xs font-medium text-stone-500">
                Not pre-rendered at build time — generated on demand per request
              </span>
            </div>
            <h2 className="mt-1.5 font-serif text-2xl font-bold text-stone-900">
              Seasonal &amp; Long-Tail Recipes — Dynamically Generated
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            Rendered fresh by the server on every request (timestamp updates on refresh)
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
