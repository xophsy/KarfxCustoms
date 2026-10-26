
/** @type {import('next').NextConfig} */
const nextConfig = {
  // PGlite (local dev database, see lib/admin/db.ts) ships WASM files webpack can't bundle.
  experimental: {
    serverComponentsExternalPackages: ["@electric-sql/pglite"],
  },

  images: {
    // Serve AVIF first (30–40% smaller than WebP), WebP as fallback
    formats: ["image/avif", "image/webp"],

    // Cache optimized images for 30 days on the edge
    minimumCacheTTL: 2_592_000,

    // Match common device widths — avoids generating unnecessary sizes
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 288, 384],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },

  // Long-lived cache headers for static gallery assets
  async headers() {
    return [
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
