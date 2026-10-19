import { notFound } from "next/navigation";
import { RecipeDetailView } from "@/components/RecipeDetailView";
import { getRecipeBySlug } from "@/lib/recipes";

// Force dynamic server rendering on every request (`Cache-Control: no-store`).
// Never cached in Next.js Full Route Cache; requires `RECIPE_DB_TOKEN` at RUNTIME.
export const dynamic = "force-dynamic";

export default async function DynamicRecipePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getRecipeBySlug(slug, false);

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
