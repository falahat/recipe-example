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
  accentColor: string;
  imageUrl: string;
  chefNote: string;
  ingredients: string[];
  steps: string[];
}

/**
 * Simulated Recipe Database records.
 * In production, fetching these during `next build` requires authenticating
 * against the recipe database with `process.env.RECIPE_DB_TOKEN`.
 */
const RECIPE_DATABASE: Recipe[] = [
  {
    slug: "sourdough-focaccia",
    title: "Rosemary & Flaky Sea Salt Focaccia",
    subtitle: "High-hydration overnight dough baked in cold-pressed olive oil until golden and crisp.",
    category: "Artisan Bread",
    popular: true,
    weeklyViews: "48,200 / wk",
    prepTime: "25 mins",
    cookTime: "28 mins",
    servings: 8,
    accentColor: "#B45309",
    imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=1000&q=80",
    chefNote: "Pre-compiled at build time because this is our #1 most-visited weekend bake.",
    ingredients: [
      "500g bread flour (12.7% protein)",
      "420g warm filtered water (84% hydration)",
      "100g active bubbly sourdough levain (or 4g instant yeast)",
      "12g fine sea salt + flaky Maldon salt for finishing",
      "45ml extra-virgin olive oil, divided",
      "3 sprigs fresh rosemary, needles stripped"
    ],
    steps: [
      "Whisk the warm water and active levain in a large ceramic bowl until milky, then fold in the bread flour and fine sea salt until no dry pockets remain.",
      "Perform 3 sets of gentle coil folds spaced 30 minutes apart, then cover and cold-proof in the refrigerator for 12–18 hours.",
      "Coat a 9×13-inch anodized pan generously with 25ml olive oil, transfer the chilled dough, and let it relax in a warm spot for 2 hours until billowy.",
      "Drizzle the remaining olive oil over the surface, dimple deeply with oiled fingertips, scatter fresh rosemary and flaky sea salt, and bake at 230°C (450°F) for 28 minutes."
    ]
  },
  {
    slug: "brown-butter-gnocchi",
    title: "Brown Butter, Crispy Sage & Hazelnut Gnocchi",
    subtitle: "Pillow-soft roasted potato gnocchi tossed in nutty beurre noisette and Parmigiano-Reggiano.",
    category: "Handmade Pasta",
    popular: true,
    weeklyViews: "39,400 / wk",
    prepTime: "30 mins",
    cookTime: "12 mins",
    servings: 4,
    accentColor: "#92400E",
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=80",
    chefNote: "Statically generated during Cloud Build for instant zero-latency page loads.",
    ingredients: [
      "900g russet potatoes, baked whole on a bed of coarse salt",
      "160g Italian Tipo 00 flour, plus extra for dusting",
      "1 pasture-raised egg yolk, lightly beaten",
      "65g unsalted cultured butter",
      "16 fresh sage leaves",
      "50g toasted Piedmont hazelnuts, coarsely crushed",
      "60g aged 24-month Parmigiano-Reggiano, finely grated"
    ],
    steps: [
      "Halve the hot baked potatoes, scoop the dry flesh through a fine ricer onto a wooden board, and let steam escape for 5 minutes.",
      "Sprinkle Tipo 00 flour and sea salt over the potato cloud, drizzle the egg yolk, and gently cut and press into a tender dough without overworking the gluten.",
      "Roll into 2cm ropes, cut into pillows, and simmer in salted water until they float for 60 seconds.",
      "Melt butter in a wide skillet until foaming and nutty-brown, crisp the sage leaves, and toss the gnocchi with a splash of pasta water, hazelnuts, and Parmigiano."
    ]
  },
  {
    slug: "miso-glazed-salmon",
    title: "Charred Yuzu & White Miso Glazed Salmon",
    subtitle: "Wild king salmon marinated in sweet Kyoto Saikyo white miso and broiled until caramelized.",
    category: "Seafood",
    popular: true,
    weeklyViews: "31,800 / wk",
    prepTime: "15 mins",
    cookTime: "10 mins",
    servings: 4,
    accentColor: "#9A3412",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80",
    chefNote: "Top-3 weeknight recipe — statically compiled into the container image at build time.",
    ingredients: [
      "4 wild king salmon fillets (170g each), skin-on and pin-boned",
      "75g sweet white miso (Saikyo miso)",
      "2 tbsp mirin (sweet Japanese rice wine)",
      "1 tbsp pure cane sugar",
      "1 tbsp fresh yuzu juice (or Meyer lemon juice)",
      "1 tsp toasted white and black sesame seeds",
      "2 scallions, thinly sliced on a sharp bias"
    ],
    steps: [
      "Simmer the mirin in a small saucepan for 30 seconds to burn off alcohol, then whisk in the white miso, sugar, and yuzu juice until glossy and smooth.",
      "Pat the salmon fillets dry, coat evenly with the cooled miso glaze, and marinate in the refrigerator for 30 minutes (or overnight for deeper umami).",
      "Wipe excess marinade from the top so the sugars caramelize cleanly, then broil 15cm from the heat element for 8–10 minutes until blistered mahogany.",
      "Finish with a squeeze of fresh yuzu, toasted sesame seeds, and crisp scallion greens."
    ]
  },
  {
    slug: "matcha-tiramisu",
    title: "Kyoto Uji Matcha & Mascarpone Tiramisu",
    subtitle: "Velvety mascarpone zabaglione layered with ceremonial matcha-soaked savoiardi ladyfingers.",
    category: "Pastry & Dessert",
    popular: false,
    weeklyViews: "1,240 / wk",
    prepTime: "35 mins",
    cookTime: "4 hrs chill",
    servings: 6,
    accentColor: "#15803D",
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1000&q=80",
    chefNote: "Long-tail seasonal recipe — rendered dynamically on the server at request time.",
    ingredients: [
      "250g chilled Italian mascarpone cheese",
      "3 egg yolks + 65g superfine caster sugar",
      "200ml heavy whipping cream, whipped to soft peaks",
      "2 tbsp ceremonial-grade Uji matcha powder, sifted",
      "180ml warm water (75°C) + 1 tbsp honey",
      "18 crisp Italian savoiardi ladyfingers"
    ],
    steps: [
      "Whisk egg yolks and sugar over a gently simmering bain-marie until pale, thick, and 72°C, then cool and fold into the softened mascarpone.",
      "Gently fold the softly whipped cream into the mascarpone base in two additions to keep the mousse airy.",
      "Whisk 1.5 tbsp sifted matcha with 75°C water and honey in a shallow dish until frothy.",
      "Briefly dip each ladyfinger for 1 second per side, layer with the mascarpone cream, chill for 4 hours, and dust with the remaining ceremonial matcha right before serving."
    ]
  },
  {
    slug: "shakshuka-verde",
    title: "Charred Tomatillo & Herb Shakshuka Verde",
    subtitle: "Farm eggs poached in a smoky roasted tomatillo, poblano, spinach, and cilantro sauce.",
    category: "Brunch",
    popular: false,
    weeklyViews: "840 / wk",
    prepTime: "15 mins",
    cookTime: "18 mins",
    servings: 4,
    accentColor: "#0F766E",
    imageUrl: "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1000&q=80",
    chefNote: "Dynamic catalog page — generated on demand per incoming HTTP request.",
    ingredients: [
      "450g husked tomatillos, halved",
      "1 poblano pepper & 1 jalapeño, halved and seeded",
      "150g baby spinach & 1 bunch fresh cilantro",
      "1 tsp toasted cumin seeds, freshly ground",
      "4 pasture-raised eggs",
      "60g crumbled cotija or feta cheese",
      "Warm charred sourdough or corn tortillas, to serve"
    ],
    steps: [
      "Broil the halved tomatillos, poblano, and jalapeño cut-side down until blackened in spots (about 8 minutes).",
      "Pulse the charred vegetables in a blender with baby spinach, cilantro, ground cumin, and sea salt until a vibrant coarse salsa verde forms.",
      "Simmer the verde sauce in a cast-iron skillet for 5 minutes, make 4 wells, and crack an egg into each well.",
      "Cover and cook on low heat for 4–5 minutes until whites are set and yolks are runny, then scatter with cotija and fresh herbs."
    ]
  },
  {
    slug: "cardamom-buns",
    title: "Swedish Brown-Sugar Cardamom Knots",
    subtitle: "Tender brioche dough twisted with freshly mortared green cardamom pods and pearl sugar.",
    category: "Nordic Baking",
    popular: false,
    weeklyViews: "690 / wk",
    prepTime: "45 mins",
    cookTime: "14 mins",
    servings: 12,
    accentColor: "#7E22CE",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
    chefNote: "Dynamic catalog page — rendered on the server when a visitor requests this route.",
    ingredients: [
      "450g bread flour + 250ml warm whole milk",
      "75g softened unsalted butter for dough + 100g for filling",
      "2 tbsp freshly crushed green cardamom seeds (divided)",
      "90g dark muscovado or brown sugar",
      "1 egg for glaze + Swedish pearl sugar for topping"
    ],
    steps: [
      "Knead the milk, flour, yeast, sugar, 1 tbsp crushed cardamom, and softened butter into a supple, glossy dough; let rise for 1 hour.",
      "Roll the dough into a 40×50cm rectangle and spread evenly with softened butter whipped with dark muscovado sugar and 1 tbsp coarse cardamom.",
      "Fold into thirds like a letter, slice into 12 strips, cut a slit down each strip, twist into a baker's knot, and proof for 45 minutes.",
      "Brush with beaten egg, scatter pearl sugar and extra crushed cardamom, and bake at 215°C (420°F) for 13–14 minutes."
    ]
  }
];

/**
 * Masks a secret token for safe diagnostic display without leaking the secret value.
 */
function maskToken(token: string): string {
  const clean = token.trim();
  if (clean.length <= 4) {
    return `•••• (${clean.length} chars)`;
  }
  return `${clean.slice(0, 2)}••••${clean.slice(-2)} (${clean.length} chars)`;
}

/**
 * Verifies that `RECIPE_DB_TOKEN` is available when accessing the Recipe DB during build.
 * Never hardcodes a fallback secret: fails closed if the build secret is missing.
 */
export function verifyBuildSecret(context: string): {
  authenticated: boolean;
  maskedToken: string;
  compiledAt: string;
} {
  // Never hardcode secrets or fallback strings in source code.
  const token = process.env.RECIPE_DB_TOKEN?.trim();
  if (!token) {
    throw new Error(
      `[RecipeDB] Missing build secret RECIPE_DB_TOKEN while executing "${context}". ` +
        `Provide RECIPE_DB_TOKEN at build time to statically compile popular recipes.`
    );
  }
  const masked = maskToken(token);
  console.log(`✓ [RecipeDB] Authenticated (${context}) with RECIPE_DB_TOKEN=${masked}`);
  return {
    authenticated: true,
    maskedToken: masked,
    compiledAt: new Date().toISOString()
  };
}

/**
 * Returns the popular recipe slugs to pre-compile at build time via `generateStaticParams()`.
 */
export function getPopularRecipeSlugs(): { slug: string }[] {
  verifyBuildSecret("generateStaticParams");
  return RECIPE_DATABASE.filter((r) => r.popular).map((r) => ({ slug: r.slug }));
}

/**
 * Returns the full recipe catalog and build-time authentication metadata for the homepage.
 */
export function getCatalogForStaticHome(): {
  popularRecipes: Recipe[];
  dynamicRecipes: Recipe[];
  buildMeta: { authenticated: boolean; maskedToken: string; compiledAt: string };
} {
  const buildMeta = verifyBuildSecret("HomePageStaticBuild");
  return {
    popularRecipes: RECIPE_DATABASE.filter((r) => r.popular),
    dynamicRecipes: RECIPE_DATABASE.filter((r) => !r.popular),
    buildMeta
  };
}

/**
 * Looks up a single recipe by slug (validated against a strict slug format).
 */
export function findRecipeBySlug(slug: string): Recipe | undefined {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return undefined;
  }
  return RECIPE_DATABASE.find((r) => r.slug === slug);
}

/**
 * Returns all recipes for navigation links.
 */
export function getAllRecipesList(): Pick<Recipe, "slug" | "title" | "popular" | "category">[] {
  return RECIPE_DATABASE.map(({ slug, title, popular, category }) => ({
    slug,
    title,
    popular,
    category
  }));
}
