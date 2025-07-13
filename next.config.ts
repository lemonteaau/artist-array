import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.artistarray.com",
      },
    ],
  },
};
export default nextConfig;
