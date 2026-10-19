import { notFound } from "next/navigation";
import { RecipeDetailView } from "@/components/RecipeDetailView";
import { getPopularRecipeSlugs, getRecipeBySlug } from "@/lib/recipes";

// Only the popular slugs returned by generateStaticParams() are served from the
// static SSG cache (`x-nextjs-cache: HIT`). All other slugs fall through to
// `/dynamic-recipes/[slug]` (`force-dynamic`), which queries the Recipe DB API
// on every request with `Cache-Control: private, no-cache, no-store`.
export const dynamicParams = false;

/**
 * Next.js calls `generateStaticParams()` during `next build`.
 * Authenticates against the live Recipe DB API (`GET /recipes?popular=true`)
 * using the `BUILD` secret `RECIPE_DB_TOKEN`.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getPopularRecipeSlugs();
}

export default async function StaticRecipePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getRecipeBySlug(slug, true);

  if (!result.recipe) {
    notFound();
  }

  return (
    <RecipeDetailView
      recipe={result.recipe}
      renderMode={result.renderMode}
      renderedAt={result.renderedAt}
      requestDbQueryMs={result.requestDbQueryMs}
      buildDbQueryMs={result.buildDbQueryMs}
      photoUrl={result.photoUrl}
    />
  );
}
