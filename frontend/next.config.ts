import type { NextConfig } from 'next';

/** 开发用 .next；生产 build 仍导出到 Spring Boot static/ */
const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  ...(isDev ? {} : { output: 'export' as const }),
  basePath: '/fitness',
  distDir: isDev ? '.next' : '../src/main/resources/static',
  trailingSlash: true,
  // 开发时 API 路径不要强制加尾斜杠，否则 /exercise/api/list → 308 → 404，前端读不到数据
  skipTrailingSlashRedirect: isDev,
  images: {
    unoptimized: true,
  },
  // In dev mode, proxy API calls to Spring Boot backend
  async rewrites() {
    return [
      {
        source: '/fitness/user/api/:path*',
        destination: 'http://localhost:8080/fitness/user/api/:path*',
      },
      {
        source: '/fitness/training/api/:path*',
        destination: 'http://localhost:8080/fitness/training/api/:path*',
      },
      {
        source: '/fitness/exercise/api/:path*',
        destination: 'http://localhost:8080/fitness/exercise/api/:path*',
      },
      {
        source: '/fitness/blogger/api/:path*',
        destination: 'http://localhost:8080/fitness/blogger/api/:path*',
      },
      {
        source: '/fitness/plan/api/:path*',
        destination: 'http://localhost:8080/fitness/plan/api/:path*',
      },
      {
        source: '/fitness/statistics/api/:path*',
        destination: 'http://localhost:8080/fitness/statistics/api/:path*',
      },
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
