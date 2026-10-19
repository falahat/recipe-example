import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8080);

const RECIPES = [
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
    photoSizeKb: 210,
    chefNote: "Popular recipe: pre-compiled at build time with RECIPE_DB_TOKEN so requests hit static cache (0 DB queries at runtime).",
    ingredients: [
      "500g bread flour (12.7% protein)",
      "420g warm filtered water (84% hydration)",
      "100g active bubbly sourdough levain (or 4g instant yeast)",
      "12g fine sea salt + flaky Maldon salt for finishing",
      "45ml extra-virgin olive oil, divided",
      "3 sprigs fresh rosemary, needles stripped"
    ],
    steps: [
      "Whisk the warm water and active levain in a large ceramic bowl until milky, then fold in the bread flour and fine sea salt until no dry flour remains.",
      "Perform 4 sets of gentle coil folds spaced 30 minutes apart, then cover and cold-proof in the refrigerator for 14 to 18 hours.",
      "Coat a 9x13-inch anodized baking pan generously with 30ml extra-virgin olive oil and transfer the cold dough into the pan, letting it relax for 2 hours at room temperature.",
      "Drizzle the remaining olive oil over the surface, oil your fingertips, and press deep dimples across the entire dough.",
      "Scatter fresh rosemary needles and flaky sea salt over the top and bake at 450°F (232°C) for 26–28 minutes until deeply blistered and golden brown."
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
    photoSizeKb: 186,
    chefNote: "Popular recipe: pre-compiled at build time with RECIPE_DB_TOKEN so requests hit static cache (0 DB queries at runtime).",
    ingredients: [
      "900g russet potatoes, baked whole on a bed of kosher salt",
      "160g Italian Tipo 00 flour, plus extra for dusting",
      "1 large pasture-raised egg yolk",
      "85g unsalted cultured butter",
      "24 fresh sage leaves",
      "50g toasted hazelnuts, coarsely crushed",
      "60g 24-month aged Parmigiano-Reggiano, finely grated"
    ],
    steps: [
      "Halve the hot baked potatoes immediately out of the oven, scoop the fluffy flesh through a fine-mesh tamis or ricer onto a wooden board, and let steam escape for 5 minutes.",
      "Drizzle the egg yolk over the warm potato snow, dust with Tipo 00 flour and a pinch of salt, and gently knead just until a tender, cohesive dough forms.",
      "Roll logs to 2cm thickness, cut into 2cm pillows, and flick each across the tines of a fork or rigagnocchi board.",
      "Simmer gnocchi in salted water until they float for 45 seconds, then transfer directly into a skillet of foaming brown butter and crisp sage leaves.",
      "Toss with a splash of pasta water, grated Parmigiano-Reggiano, and crushed roasted hazelnuts to form a glossy emulsion."
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
    photoSizeKb: 177,
    chefNote: "Popular recipe: pre-compiled at build time with RECIPE_DB_TOKEN so requests hit static cache (0 DB queries at runtime).",
    ingredients: [
      "4 center-cut wild King salmon fillets (170g each), skin-on",
      "90g sweet white miso paste (Saikyo miso)",
      "45ml mirin (sweet Japanese rice wine)",
      "30ml cooking sake",
      "15ml fresh yuzu juice (or Meyer lemon juice)",
      "1 tbsp organic unrefined cane sugar",
      "Thinly sliced scallions and toasted white sesame seeds"
    ],
    steps: [
      "Combine the sake and mirin in a small saucepan, bring to a rapid boil for 20 seconds to burn off the alcohol, then whisk in the white miso and sugar over low heat until smooth.",
      "Remove from heat, stir in the fresh yuzu juice, and cool completely to room temperature.",
      "Pat the salmon fillets dry, coat evenly in the cooled miso marinade, and refrigerate for at least 4 hours (or up to 24 hours).",
      "Wipe excess marinade from the top of the fillets so the sugars caramelize cleanly without burning.",
      "Broil 6 inches from the heating element for 7–9 minutes until mahogany blisters form and the center reaches 125°F (52°C)."
    ]
  },
  {
    slug: "matcha-tiramisu",
    title: "Kyoto Uji Matcha & Mascarpone Tiramisu",
    subtitle: "Velvety mascarpone zabaglione layered with ceremonial matcha-soaked savoiardi.",
    category: "Pastry & Dessert",
    popular: false,
    weeklyViews: "1,240 / wk",
    prepTime: "35 mins",
    cookTime: "4 hrs chill",
    servings: 6,
    photoSizeKb: 165,
    chefNote: "Long-tail recipe: fetched dynamically from the Recipe DB API at request time using the runtime RECIPE_DB_TOKEN secret.",
    ingredients: [
      "24g ceremonial-grade Uji matcha powder, sifted (divided)",
      "450g chilled Italian mascarpone",
      "4 large egg yolks + 65g superfine caster sugar",
      "240ml cold heavy whipping cream (36% fat)",
      "24 crisp Italian savoiardi (ladyfinger biscuits)",
      "180ml warm water (175°F / 80°C) + 15ml dark rum"
    ],
    steps: [
      "Whisk egg yolks and sugar in a heatproof bowl set over barely simmering water until pale, thick, and 160°F (71°C), then whip until cool.",
      "Fold the softened mascarpone into the yolk ribbon, followed by softly whipped cream until cloud-like.",
      "Whisk 16g sifted matcha with 175°F water and dark rum in a shallow dish until frothy.",
      "Briefly dip each ladyfinger for 1 second per side and layer with the mascarpone cream in a ceramic dish.",
      "Chill for at least 4 hours and dust generously with the remaining ceremonial matcha right before serving."
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
    photoSizeKb: 203,
    chefNote: "Long-tail recipe: fetched dynamically from the Recipe DB API at request time using the runtime RECIPE_DB_TOKEN secret.",
    ingredients: [
      "600g husked tomatillos, halved",
      "2 poblano peppers, halved and seeded",
      "150g baby spinach + 1 bunch fresh cilantro",
      "1 tsp toasted cumin seeds, freshly ground",
      "6 pasture-raised eggs",
      "80g crumbled aged cotija or feta cheese"
    ],
    steps: [
      "Broil the halved tomatillos and poblanos cut-side down until blackened in spots and softened, about 8 minutes.",
      "Pulse the roasted vegetables in a food processor with fresh spinach, cilantro, ground cumin, and sea salt until a coarse emerald sauce forms.",
      "Simmer the verde sauce in a cast-iron skillet for 5 minutes, make 6 wells, and crack an egg into each well.",
      "Cover and cook over medium-low heat for 5–6 minutes until whites are set and yolks remain jammy, then scatter with cotija."
    ]
  },
  {
    slug: "cardamom-buns",
    title: "Swedish Brown-Sugar Cardamom Knots (Kardemummabullar)",
    subtitle: "Tender brioche dough twisted with freshly mortared green cardamom pods and pearl sugar.",
    category: "Nordic Baking",
    popular: false,
    weeklyViews: "690 / wk",
    prepTime: "45 mins",
    cookTime: "14 mins",
    servings: 12,
    photoSizeKb: 206,
    chefNote: "Long-tail recipe: fetched dynamically from the Recipe DB API at request time using the runtime RECIPE_DB_TOKEN secret.",
    ingredients: [
      "18g green cardamom pods, hulls removed and seeds freshly crushed in a mortar",
      "500g bread flour + 300ml warm whole milk",
      "110g softened salted butter + 95g dark muscovado sugar for filling",
      "1 egg for glazing + Swedish pearl sugar + cardamom simple syrup"
    ],
    steps: [
      "Knead the enriched milk dough with half of the freshly crushed cardamom until supple and windowpane-thin, then proof for 1 hour.",
      "Roll into a rectangle, spread with the whipped brown butter, muscovado sugar, and remaining crushed cardamom, and fold into thirds.",
      "Slice into strips, twist each strip around two fingers into a knot, proof for 45 minutes, brush with egg wash, and bake at 425°F (220°C) for 13–14 minutes."
    ]
  }
];

function isAuthorized(req) {
  const expected = (process.env.RECIPE_DB_TOKEN || "").trim();
  if (!expected) {
    return false;
  }
  const authHeader = req.headers["authorization"] || "";
  if (!authHeader.startsWith("Bearer ")) {
    return false;
  }
  const provided = authHeader.slice("Bearer ".length).trim();
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/healthz") {
    return sendJson(res, 200, { status: "ok", service: "recipe-db-api" });
  }

  // Enforce Bearer token authentication against RECIPE_DB_TOKEN on all Recipe DB endpoints
  if (!isAuthorized(req)) {
    return sendJson(res, 401, {
      error: "Unauthorized",
      message: "Valid Authorization: Bearer <RECIPE_DB_TOKEN> header is required to query the Recipe DB."
    });
  }

  if (req.method === "GET" && url.pathname === "/recipes") {
    const popularParam = url.searchParams.get("popular");
    let list = RECIPES;
    if (popularParam === "true") {
      list = RECIPES.filter((r) => r.popular);
    } else if (popularParam === "false") {
      list = RECIPES.filter((r) => !r.popular);
    }
    return sendJson(res, 200, {
      recipes: list,
      queriedAt: new Date().toISOString()
    });
  }

  const photoMatch = url.pathname.match(/^\/recipes\/([a-z0-9-]+)\/photo$/);
  if (req.method === "GET" && photoMatch) {
    const slug = photoMatch[1];
    const recipe = RECIPES.find((r) => r.slug === slug);
    if (!recipe) {
      return sendJson(res, 404, { error: "Recipe not found" });
    }
    const photoPath = path.join(__dirname, "photos", `${slug}.jpg`);
    if (!fs.existsSync(photoPath)) {
      return sendJson(res, 404, { error: "Photo not found" });
    }
    const buf = fs.readFileSync(photoPath);
    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": buf.length,
      "Cache-Control": "no-store"
    });
    return res.end(buf);
  }

  const slugMatch = url.pathname.match(/^\/recipes\/([a-z0-9-]+)$/);
  if (req.method === "GET" && slugMatch) {
    const slug = slugMatch[1];
    const recipe = RECIPES.find((r) => r.slug === slug);
    if (!recipe) {
      return sendJson(res, 404, { error: "Recipe not found" });
    }
    return sendJson(res, 200, {
      recipe,
      queriedAt: new Date().toISOString()
    });
  }

  return sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`recipe-db-api listening on port ${PORT}`);
});
