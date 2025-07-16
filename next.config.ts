import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudflare-loader.ts",
    deviceSizes: [320, 420, 640, 750, 828, 1080],
    imageSizes: [16, 32, 48, 64],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.artistarray.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
