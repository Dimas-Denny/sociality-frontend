import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is intentionally NOT enabled.
  // Sociality fetches almost all data on the client via TanStack Query
  // (token-based, optimistic UI, infinite scroll).

  // Required: runs Tailwind CSS v4 through Turbopack.
  // Without this rule, @theme / @apply / @custom-variant are not processed.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
