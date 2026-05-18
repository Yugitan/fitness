import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/fitness',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // In dev mode, proxy API calls to Spring Boot backend
  async rewrites() {
    return [
      {
        source: '/fitness/api/:path*',
        destination: 'http://localhost:8080/fitness/api/:path*',
      },
      {
        source: '/fitness/admin/api/:path*',
        destination: 'http://localhost:8080/fitness/admin/api/:path*',
      },
      {
        source: '/fitness/admin/login',
        destination: 'http://localhost:8080/fitness/admin/login',
      },
    ];
  },
};

export default nextConfig;
