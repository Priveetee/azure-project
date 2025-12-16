import type { NextConfig } from "next";
import { config } from "dotenv";

// Load credentials from .env_cred
config({ path: ".env_cred" });

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
