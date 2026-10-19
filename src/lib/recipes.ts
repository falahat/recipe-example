export interface Recipe {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  popular: boolean;
  weeklyViews: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  photoSizeKb: number;
  chefNote: string;
  ingredients: string[];
  steps: string[];
}

export const RECIPE_DB_API_URL =
  process.env.RECIPE_DB_URL || "http://localhost:8080";

export const POPULAR_RECIPE_SLUGS = new Set([
  "sourdough-focaccia",
  "brown-butter-gnocchi",
  "miso-glazed-salmon"
]);

/**
 * Performs a real authenticated HTTP request against the Recipe DB API (`recipe-db-api`).
 * - Sends `Authorization: Bearer <RECIPE_DB_TOKEN>`.
 * - Never logs any characters or length of the secret.
 * - Fails closed if the Recipe DB API returns 401 Unauthorized or any non-200 status.
 */
async function queryRecipeDbApi<T>(
  endpoint: string,
  context: string,
  cacheMode: RequestCache
): Promise<{ data: T; elapsedMs: number; queriedAt: string }> {
  const token = process.env.RECIPE_DB_TOKEN?.trim() || "";
  const url = `${RECIPE_DB_API_URL}${endpoint}`;
  const t0 = performance.now();

  const res = await fetch(url, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: cacheMode
  });

  const elapsedMs = Math.round((performance.now() - t0) * 10) / 10;

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(
      `[RecipeDB] HTTP ${res.status} from ${url} during "${context}": ${bodyText}. ` +
        `Ensure RECIPE_DB_TOKEN is configured for both BUILD (popular static pages) and RUNTIME (dynamic long-tail pages).`
    );
  }

  console.log(
    `✓ [RecipeDB] Authenticated (${context}) -> HTTP ${res.status} OK from Recipe DB API (${elapsedMs} ms)`
  );

  const data = (await res.json()) as T;
  return {
    data,
    elapsedMs,
    queriedAt: new Date().toISOString()
  };
}

/**
 * Used by Next.js `generateStaticParams()` during `next build`.
 * Queries `GET /recipes?popular=true` on the Recipe DB API using the BUILD secret `RECIPE_DB_TOKEN`.
 */
export async function getPopularRecipeSlugs(): Promise<{ slug: string }[]> {
  const { data } = await queryRecipeDbApi<{ recipes: Recipe[] }>(
    "/recipes?popular=true",
    "generateStaticParams",
    "force-cache"
  );
  return data.recipes.map((r) => ({ slug: r.slug }));
}

/**
 * Used by the home page during `next build` to display the catalog and build verification metadata.
 */
export async function getCatalogForStaticHome() {
  const { data, elapsedMs, queriedAt } = await queryRecipeDbApi<{ recipes: Recipe[] }>(
    "/recipes",
    "HomePageStaticBuild",
    "force-cache"
  );
  const popularRecipes = data.recipes.filter((r) => r.popular);
  const dynamicRecipes = data.recipes.filter((r) => !r.popular);

  return {
    popularRecipes,
    dynamicRecipes,
    buildMeta: {
      apiEndpoint: RECIPE_DB_API_URL,
      authStatus: "HTTP 200 OK (Bearer token verified)",
      buildDbFetchMs: elapsedMs,
      compiledAt: queriedAt
    }
  };
}

/**
 * Fetches a single recipe by slug from the Recipe DB API:
 * - For popular recipes (`popular: true`): called once during `next build` (`force-cache`),
 *   so request-time DB query time is `0 ms` (`x-nextjs-cache: HIT`).
 * - For long-tail recipes (`popular: false`): called on every incoming request (`no-store`)
 *   using the `RUNTIME` secret `RECIPE_DB_TOKEN`.
 */
export async function getRecipeBySlug(
  slug: string,
  isStaticBuildRoute: boolean
): Promise<{
  recipe: Recipe | null;
  renderMode: "STATIC_BUILD_TIME" | "DYNAMIC_REQUEST_TIME";
  renderedAt: string;
  requestDbQueryMs: number;
  buildDbQueryMs: number | null;
  photoUrl: string;
}> {
  const context = isStaticBuildRoute
    ? `StaticRecipeBuild:${slug}`
    : `DynamicRecipeRequest:${slug}`;
  const cacheMode: RequestCache = isStaticBuildRoute ? "force-cache" : "no-store";

  try {
    const { data, elapsedMs, queriedAt } = await queryRecipeDbApi<{ recipe: Recipe }>(
      `/recipes/${encodeURIComponent(slug)}`,
      context,
      cacheMode
    );
    const recipe = data.recipe;
    return {
      recipe,
      renderMode: isStaticBuildRoute ? "STATIC_BUILD_TIME" : "DYNAMIC_REQUEST_TIME",
      renderedAt: queriedAt,
      requestDbQueryMs: isStaticBuildRoute ? 0 : elapsedMs,
      buildDbQueryMs: isStaticBuildRoute ? elapsedMs : null,
      photoUrl: isStaticBuildRoute
        ? `/photos/${recipe.slug}.jpg`
        : `/api/recipe-photo/${recipe.slug}`
    };
  } catch (err) {
    if (err instanceof Error && err.message.includes("HTTP 404")) {
      return {
        recipe: null,
        renderMode: "DYNAMIC_REQUEST_TIME",
        renderedAt: new Date().toISOString(),
        requestDbQueryMs: 0,
        buildDbQueryMs: null,
        photoUrl: ""
      };
    }
    throw err;
  }
}
