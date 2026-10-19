import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,

  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 300,
    },
  },

  // Security & caching headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'none';",
          },
        ],
      },
      // Static recipe photos are bundled at build time and immutable
      {
        source: "/photos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Popular recipes (/recipes/sourdough-focaccia, /recipes/brown-butter-gnocchi,
  // /recipes/miso-glazed-salmon) are pre-rendered at build time via generateStaticParams()
  // in /app/recipes/[slug]/page.tsx. All other /recipes/:slug URLs route to the
  // force-dynamic SSR handler (/app/dynamic-recipes/[slug]/page.tsx), which queries
  // recipe-db-api live on every request using the RUNTIME secret RECIPE_DB_TOKEN.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source:
            "/recipes/:slug((?!sourdough-focaccia|brown-butter-gnocchi|miso-glazed-salmon).*)",
          destination: "/dynamic-recipes/:slug",
        },
      ],
    };
  },
};

export default nextConfig;
