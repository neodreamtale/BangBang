// 应用配置文件
export const appConfig = {
  // 站点基础配置
  site: {
    name: '意见反馈系统',
    description: '用户意见反馈系统 - 帮助我们改进产品体验',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    defaultLocale: 'zh-CN',
  },
  
  // API 配置
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 10000,
  },
  
  // 功能开关
  features: {
    enableAnalytics: process.env.NODE_ENV === 'production',
    enableCrashReporting: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  
  // 反馈系统配置
  feedback: {
    categories: ['bug', 'feature', 'improvement', 'other'],
    priorities: ['low', 'medium', 'high', 'critical'],
    maxAttachments: 5,
  }
} as const;

// 导出类型
export type AppConfig = typeof appConfig;
