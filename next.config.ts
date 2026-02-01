import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/Portfolio-v2' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Portfolio-v2/' : '',
  trailingSlash: true,
};

export default nextConfig;
