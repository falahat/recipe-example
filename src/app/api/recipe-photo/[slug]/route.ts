import path from "node:path";
import { NextResponse } from "next/server";
import { RECIPE_DB_API_URL } from "@/lib/recipes";

export const dynamic = "force-dynamic";

const ALLOWED_SLUGS = new Set([
  "sourdough-focaccia",
  "brown-butter-gnocchi",
  "miso-glazed-salmon",
  "matcha-tiramisu",
  "shakshuka-verde",
  "cardamom-buns"
]);

/**
 * Dynamic photo endpoint used by non-precompiled recipes at request time.
 * Authenticates against the live Recipe DB API (`recipe-db-api`) using the runtime
 * `RECIPE_DB_TOKEN` secret (`Authorization: Bearer <RECIPE_DB_TOKEN>`) and measures
 * the actual elapsed round-trip duration (`Server-Timing: db-photo-fetch;dur=<ms>`).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const cleanSlug = path.basename(slug);
  if (!ALLOWED_SLUGS.has(cleanSlug)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const token = process.env.RECIPE_DB_TOKEN?.trim() || "";
  const t0 = performance.now();

  const upstreamRes = await fetch(
    `${RECIPE_DB_API_URL}/recipes/${encodeURIComponent(cleanSlug)}/photo`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store"
    }
  );

  const elapsedMs = Math.round((performance.now() - t0) * 10) / 10;

  if (!upstreamRes.ok) {
    const errBody = await upstreamRes.text().catch(() => "Unauthorized");
    return new NextResponse(errBody, {
      status: upstreamRes.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "Server-Timing": `db-photo-fetch;dur=${elapsedMs}`
      }
    });
  }

  const imageBuffer = await upstreamRes.arrayBuffer();
  return new NextResponse(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "Server-Timing": `db-photo-fetch;dur=${elapsedMs}`,
      "X-Content-Type-Options": "nosniff"
    }
  });
}
