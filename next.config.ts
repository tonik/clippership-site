import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  devIndicators: false,
  turbopack: {
    // devlooper: source-loc
    ...(process.env.DEVLOOPER_EDITOR
      ? {
          rules: { "*.{tsx,jsx}": { loaders: ["./dl-source-loc-loader.cjs"] } },
        }
      : {}),
    root: import.meta.dirname,
  },
  /* config options here */
};

export default nextConfig;
