// 应用配置文件
export const appConfig = {
  // 站点基础配置
  site: {
    name: '意见反馈系统',
    description: '用户意见反馈系统 - 帮助我们改进产品体验',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
    defaultLocale: 'zh-CN',
  },

  // API 配置
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 10000,
  },
} as const;

// 导出类型
export type AppConfig = typeof appConfig;
