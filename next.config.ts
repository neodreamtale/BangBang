import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 支持大文件上传
  experimental: {
    // 设置 Server Actions 的请求体大小限制
    serverActions: {
      bodySizeLimit: '50mb', // 50MB 限制
    },
  },
  // 其他配置...
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    'http://localhost:3000',
    'http://localhost:3001',      // ← 加上这个
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://172.30.16.95:3000',
    'http://172.30.16.95:3001',   // ← 也建议加上
  ],
  // WebView 专用配置
  async headers() {
    return [
      // 为上传的文件添加下载头
      {
        source: '/uploads/(.*)',
        headers: [
          {
            key: 'Content-Disposition',
            value: 'attachment',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
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
    unoptimized: true,
  },

  // Docker 构建时跳过 ESLint 检查（生产环境临时配置）
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
