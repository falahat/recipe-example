# Recipe Kitchen — Next.js Build + Runtime Secrets Sample

Sample Next.js 15 App Router recipe website demonstrating why a hybrid static + dynamic web application needs a Secret Manager secret (`RECIPE_DB_TOKEN`) at **both `BUILD` and `RUNTIME`**.

## Architecture: Static (`BUILD`) vs. Dynamic (`RUNTIME`) Recipes

- **Authenticated Recipe Database API ([`db-api/server.mjs`](./db-api/server.mjs))**:
  Enforces `Authorization: Bearer <RECIPE_DB_TOKEN>` using `crypto.timingSafeEqual` and returns **`HTTP 401 Unauthorized`** when the token is missing or invalid.
- **Popular Recipes (`BUILD` secret · `SSG`)**:
  `/recipes/sourdough-focaccia`, `/recipes/brown-butter-gnocchi`, and `/recipes/miso-glazed-salmon` are queried from `recipe-db-api` once during `next build` via `generateStaticParams()` (`src/app/recipes/[slug]/page.tsx`) and compiled into static HTML (`x-nextjs-cache: HIT`, `x-nextjs-prerender: 1`) with pre-bundled recipe photos (`/photos/<slug>.jpg`). At request time they make **0 database queries (`0 ms`)**.
- **Seasonal & Long-Tail Recipes (`RUNTIME` secret · `SSR`)**:
  `/recipes/matcha-tiramisu`, `/recipes/shakshuka-verde`, and `/recipes/cardamom-buns` route to `src/app/dynamic-recipes/[slug]/page.tsx` (`export const dynamic = "force-dynamic"`, `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`). Every request authenticates to `recipe-db-api` at runtime for both the recipe JSON (`GET /recipes/<slug>`) and the photo stream (`/api/recipe-photo/<slug>`).

| Metric | Popular Recipe (`SSG` · `BUILD` Secret) | Long-Tail Recipe (`SSR` · `RUNTIME` Secret) |
| :--- | :--- | :--- |
| **Example Route** | `/recipes/sourdough-focaccia` | `/recipes/matcha-tiramisu` |
| **Secret Required When?** | **`BUILD`** (`next build` queries `recipe-db-api`) | **`RUNTIME`** (every request queries `recipe-db-api`) |
| **HTTP Cache Headers** | `x-nextjs-cache: HIT`, `x-nextjs-prerender: 1` | `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` |
| **Server DB Query on Request** | **`0 ms`** *(0 runtime DB calls)* | **Live authenticated `GET /recipes/<slug>`** |
| **Photo Delivery** | Static `/photos/<slug>.jpg` (`0 ms` DB fetch) | Streamed via `/api/recipe-photo/<slug>` (`Server-Timing: db-photo-fetch`) |

## Running Locally

1. **Start the authenticated Recipe DB API**:
   ```bash
   RECIPE_DB_TOKEN="demo-secret-token" PORT=8080 node db-api/server.mjs
   ```

2. **Verify `next build` fails closed without `RECIPE_DB_TOKEN` (`HTTP 401 Unauthorized`)**:
   ```bash
   npm install
   RECIPE_DB_URL="http://localhost:8080" npm run build
   ```

3. **Build and run with `RECIPE_DB_TOKEN`**:
   ```bash
   RECIPE_DB_URL="http://localhost:8080" RECIPE_DB_TOKEN="demo-secret-token" npm run build
   RECIPE_DB_URL="http://localhost:8080" RECIPE_DB_TOKEN="demo-secret-token" npm run start
   ```

## Cloud Run & Firebase Configuration Files

- **[`cloudbuild.yaml`](./cloudbuild.yaml)**: Cloud Build configuration using `availableSecrets`, `secretEnv: [RECIPE_DB_TOKEN]`, and `pack build --env RECIPE_DB_TOKEN`.
- **[`firebase.json`](./firebase.json)**: Firebase CLI configuration for Cloud Run (`run`) and Firebase App Hosting (`apphosting`).
- **[`apphosting.yaml`](./apphosting.yaml)**: Firebase App Hosting secret configuration granting `RECIPE_DB_TOKEN` at both `BUILD` and `RUNTIME`.
