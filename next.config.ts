import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 临时注释掉实验性功能，等需要时再启用
  // experimental: {
  //   ppr: 'incremental'
  // },
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
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
