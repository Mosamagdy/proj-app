import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
    ignoreDuringBuilds: true,
  },

  env: {
    NEXT_PUBLIC_BASE_URL: 'https://linked-posts.routemisr.com/',
  },
};

export default nextConfig;
