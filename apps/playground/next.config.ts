import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@mande/ui"],
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "../../packages/ui/src");
    return config;
  },
};

export default nextConfig;
