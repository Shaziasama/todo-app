import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // This ensures a standalone build which works well with Hugging Face Spaces
};

export default nextConfig;
