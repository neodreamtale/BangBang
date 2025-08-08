// 测试环境变量读取
console.log('=== 环境变量测试 ===')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('DATABASE_URL:', process.env.DATABASE_URL)
console.log('NEXT_PUBLIC_SITE_NAME:', process.env.NEXT_PUBLIC_SITE_NAME)

// 测试 Prisma Client 的数据库连接
const { PrismaClient } = require('@prisma/client')

try {
  const prisma = new PrismaClient()
  console.log('=== Prisma Client 连接信息 ===')

  // Prisma 不公开 datasource URL，建议通过环境变量读取
  console.log('Prisma datasource URL:', process.env.DATABASE_URL || 'URL 不可见')

  prisma.$disconnect()
} catch (error) {
  console.log('Prisma 错误:', error.message)
}
