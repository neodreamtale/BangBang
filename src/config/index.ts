import appConfigJson from './app.config.json';

// 获取当前环境
const getEnvironment = (): 'development' | 'production' => {
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
};

// 合并配置
export const getAppConfig = () => {
  const env = getEnvironment();
  const envConfig = appConfigJson.environments[env];
  
  return {
    ...appConfigJson,
    site: {
      ...appConfigJson.site,
      url: process.env.NEXT_PUBLIC_SITE_URL || envConfig.siteUrl,
    },
    api: {
      ...appConfigJson.api,
      baseUrl: process.env.NEXT_PUBLIC_API_URL || envConfig.apiUrl,
    },
    environment: env,
  };
};

// 导出配置实例
export const appConfig = getAppConfig();

// 类型定义
export type AppConfig = ReturnType<typeof getAppConfig>;
