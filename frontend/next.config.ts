import type { NextConfig } from "next";

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Proxy API calls to Laravel backend
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
      // Proxy storage files (rendered videos, images, audio) to Laravel storage
      {
        source: '/storage/:path*',
        destination: `${apiBase}/storage/:path*`,
      },
    ];
  },
};

export default nextConfig;
