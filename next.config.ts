import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // WebView 专用配置
  async headers() {
    return [
      // 为所有静态资源添加 CORS 头
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 为所有 Next.js 内部资源添加 CORS
      {
        source: '/_next/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
      // 为页面添加 WebView 兼容头
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },

  // Docker 部署配置
  output: 'standalone',

  // 优化静态资源
  images: {
    unoptimized: true
  },

  // Docker 构建时跳过 ESLint 检查（生产环境临时配置）
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
