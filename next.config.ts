import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    minimumCacheTTL: 31536000,
  },

  experimental: {
    optimizePackageImports: ["react-icons", "framer-motion"],
  },

  // Silence the "ESM" framer-motion warning
  transpilePackages: ["framer-motion"],
};

export default nextConfig;
