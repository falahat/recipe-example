import Link from "next/link";
import { notFound } from "next/navigation";
import {
  findRecipeBySlug,
  getAllRecipesList,
  getPopularRecipeSlugs,
  verifyBuildSecret
} from "@/lib/recipes";

/**
 * Allow non-popular recipe slugs to be rendered dynamically on demand at request time.
 */
export const dynamicParams = true;

/**
 * Pre-compiles popular recipes at `next build` time.
 * Requires `RECIPE_DB_TOKEN` to be present in the build environment.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getPopularRecipeSlugs();
}

export default async function RecipeDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = findRecipeBySlug(slug);
  if (!recipe) {
    notFound();
  }

  let renderTimestamp: string;
  let tokenSummary: string;

  if (recipe.popular) {
    // Popular recipe: statically compiled during `next build` using RECIPE_DB_TOKEN
    const buildMeta = verifyBuildSecret(`StaticRecipePage:${recipe.slug}`);
    renderTimestamp = buildMeta.compiledAt;
    tokenSummary = `RECIPE_DB_TOKEN=${buildMeta.maskedToken} (verified during build)`;
  } else {
    // Long-tail recipe: not in generateStaticParams(), so Next.js renders it on demand at request time
    renderTimestamp = new Date().toISOString();
    const hasRuntimeToken = Boolean(process.env.RECIPE_DB_TOKEN?.trim());
    tokenSummary = hasRuntimeToken
      ? "RECIPE_DB_TOKEN present at runtime"
      : "Rendered on demand at request time (build secret not needed at runtime)";
  }

  const allRecipes = getAllRecipesList();

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb + Quick Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
        >
          ← Back to all recipes
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-400">Compare routes:</span>
          {allRecipes.map((item) => {
            const active = item.slug === recipe.slug;
            return (
              <Link
                key={item.slug}
                href={`/recipes/${item.slug}`}
                className={`rounded-full px-3 py-1 font-medium transition ${
                  active
                    ? item.popular
                      ? "bg-emerald-900 text-white"
                      : "bg-amber-900 text-white"
                    : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-100"
                }`}
              >
                {item.popular ? "⚡ " : "🔄 "}
                {item.slug}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Visual Render Mode & Secret Inspector Banner */}
      <div
        className={`rounded-2xl border p-5 shadow-sm ${
          recipe.popular
            ? "border-emerald-300 bg-emerald-950 text-emerald-50"
            : "border-amber-300 bg-amber-950 text-amber-50"
        }`}
      >
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${
                  recipe.popular
                    ? "bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-400/40"
                    : "bg-amber-400/20 text-amber-200 ring-1 ring-amber-400/40"
                }`}
              >
                {recipe.popular
                  ? "⚡ STATICALLY COMPILED AT BUILD TIME (SSG)"
                  : "🔄 DYNAMICALLY GENERATED AT REQUEST TIME (SSR)"}
              </span>
              <span className="font-mono text-xs opacity-80">
                Route: <code>/recipes/{recipe.slug}</code>
              </span>
            </div>
            <p className="text-sm opacity-90">{recipe.chefNote}</p>
          </div>

          <div className="rounded-xl bg-black/30 px-4 py-3 font-mono text-xs backdrop-blur-sm">
            <div className="flex items-center justify-between gap-6">
              <span className="opacity-70">
                {recipe.popular ? "Compiled Timestamp (Fixed):" : "Request Timestamp (Live):"}
              </span>
              <span className="font-semibold text-white">{renderTimestamp}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-6">
              <span className="opacity-70">DB Auth Status:</span>
              <span className={recipe.popular ? "text-emerald-300" : "text-amber-300"}>
                {tokenSummary}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Recipe Editorial Card */}
      <article className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-12">
          <div className="relative min-h-[320px] bg-stone-100 lg:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
          </div>

          <div className="flex flex-col justify-between p-8 lg:col-span-7 lg:p-10">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-amber-800">
                <span>{recipe.category}</span>
                <span>•</span>
                <span className="font-mono text-stone-500">Traffic: {recipe.weeklyViews}</span>
              </div>

              <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                {recipe.title}
              </h1>

              <p className="text-base leading-relaxed text-stone-600">{recipe.subtitle}</p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-4 text-center">
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  Prep Time
                </span>
                <span className="mt-1 block font-serif text-lg font-bold text-stone-900">
                  {recipe.prepTime}
                </span>
              </div>
              <div className="border-x border-stone-200/80">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  Cook Time
                </span>
                <span className="mt-1 block font-serif text-lg font-bold text-stone-900">
                  {recipe.cookTime}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  Yield
                </span>
                <span className="mt-1 block font-serif text-lg font-bold text-stone-900">
                  {recipe.servings} servings
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients & Method */}
        <div className="grid gap-10 border-t border-stone-200 p-8 lg:grid-cols-12 lg:p-10">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-xl font-bold text-stone-900">Ingredients</h2>
            <p className="mt-1 text-xs text-stone-500">
              Scaled for {recipe.servings} servings · Metric weights recommended
            </p>
            <ul className="mt-4 divide-y divide-stone-100">
              {recipe.ingredients.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 py-2.5 text-sm text-stone-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <h2 className="font-serif text-xl font-bold text-stone-900">Preparation</h2>
            <p className="mt-1 text-xs text-stone-500">Step-by-step test kitchen method</p>
            <ol className="mt-4 space-y-5">
              {recipe.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex gap-4 rounded-2xl border border-stone-200/70 bg-[#FAF7F2]/60 p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-900 font-mono text-xs font-bold text-amber-200">
                    {idx + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-stone-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </article>
    </div>
  );
}
