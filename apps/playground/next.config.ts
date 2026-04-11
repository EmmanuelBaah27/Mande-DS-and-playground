import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mande/ui"],
  // @ alias is resolved via tsconfig paths (Turbopack reads these automatically)
  experimental: {
    optimizePackageImports: ["@mande/ui", "@central-icons-react/all"],
  },
};

export default nextConfig;
