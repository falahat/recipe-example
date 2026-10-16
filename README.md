# Saffron & Salt (`recipe-example`)

A minimal Next.js App Router recipe application built to demonstrate **build-time secrets (`RECIPE_DB_TOKEN`)** across Cloud Run and Firebase App Hosting.

## How It Works

During `next build`, the app connects to its Recipe DB (`src/lib/recipes.ts`) using `process.env.RECIPE_DB_TOKEN` to **statically pre-compile (`SSG`)** the top 3 popular recipes via `generateStaticParams()`, while leaving long-tail seasonal recipes to render **dynamically on demand (`SSR`)** at request time:

| Route | Render Strategy | Requires `RECIPE_DB_TOKEN` at Build? |
| :--- | :--- | :--- |
| `/` | `○ Static` (Compiled at build time) | **Yes** |
| `/recipes/sourdough-focaccia` | `● SSG` (`generateStaticParams`) | **Yes** |
| `/recipes/brown-butter-gnocchi` | `● SSG` (`generateStaticParams`) | **Yes** |
| `/recipes/miso-glazed-salmon` | `● SSG` (`generateStaticParams`) | **Yes** |
| `/recipes/matcha-tiramisu` | `ƒ Dynamic` (On-demand SSR per request) | No (rendered per request) |
| `/recipes/shakshuka-verde` | `ƒ Dynamic` (On-demand SSR per request) | No (rendered per request) |
| `/recipes/cardamom-buns` | `ƒ Dynamic` (On-demand SSR per request) | No (rendered per request) |

If `RECIPE_DB_TOKEN` is missing during `next build`, the build fails closed:
```text
Error: [RecipeDB] Missing build secret RECIPE_DB_TOKEN while executing "generateStaticParams".
Provide RECIPE_DB_TOKEN at build time to statically compile popular recipes.
```

---

## Local Development & Verification

```bash
npm install

# 1. Building without RECIPE_DB_TOKEN fails closed:
npm run build

# 2. Building with RECIPE_DB_TOKEN statically compiles the 3 popular recipes:
RECIPE_DB_TOKEN="sk_live_recipe_demo_token_2026" npm run build
npm run start
```

---

## Build Secret Deployment Scenarios

### Prerequisite: Create the secret in Secret Manager
```bash
printf 'sk_live_recipe_demo_token_2026' | gcloud secrets create recipe-db-token --data-file=-
```

### 1. Cloud Run without BAPI Support (Custom `cloudbuild.yaml`)
Users must write a custom `cloudbuild.yaml` using `availableSecrets`, `secretEnv`, and a value-less `--env RECIPE_DB_TOKEN` flag on `pack`, then deploy the built image separately:
```bash
gcloud builds submit --region=us-central1 --config=cloudbuild.yaml
gcloud run deploy recipe-example \
  --region=us-central1 \
  --image=us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/recipe-example \
  --allow-unauthenticated
```

### 2. Cloud Run with BAPI + Firebase CLI Support
With BAPI and Firebase CLI support, the secret is stored by reference on the Cloud Run service and passed by reference to Cloud Build:
```bash
firebase run:secrets:create recipe-db-token
firebase run:services:update recipe-example \
  --add-secret RECIPE_DB_TOKEN recipe-db-token@latest BUILD
firebase deploy --only run
```

### 3. Cloud Run with Local Builds + Firebase CLI (No BAPI Support)
Without BAPI support for build secrets, remote Cloud Build deploys reject secret references. Setting `"localBuild": true` in `firebase.json` runs the build on the developer's local machine using the developer's credentials:
```json
{
  "run": {
    "serviceId": "recipe-example",
    "region": "us-central1",
    "localBuild": true
  }
}
```

### 4. Firebase App Hosting (`apphosting.yaml`)
App Hosting natively supports build-time secrets via `apphosting.yaml`:
```yaml
env:
  - variable: RECIPE_DB_TOKEN
    secret: recipe-db-token
    availability:
      - BUILD
```
