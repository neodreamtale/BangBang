// 模拟 Next.js 的环境变量加载过程
const { loadEnvConfig } = require('@next/env')
const path = require('path')

console.log('=== 模拟 Next.js 环境变量加载 ===')

// Next.js 会这样加载环境变量
const projectDir = process.cwd()
loadEnvConfig(projectDir)

console.log('加载后的环境变量:')
console.log('DATABASE_URL:', process.env.DATABASE_URL)
console.log('NEXT_PUBLIC_SITE_NAME:', process.env.NEXT_PUBLIC_SITE_NAME)

// 现在测试 Prisma Client
const { PrismaClient } = require('@prisma/client')

try {
  console.log('=== 创建 Prisma Client ===')
  const prisma = new PrismaClient({
    log: ['info'], // 显示连接信息
  })

  console.log('Prisma Client 创建成功，使用的 DATABASE_URL:', process.env.DATABASE_URL)

  prisma.$disconnect()
} catch (error) {
  console.log('Prisma 错误:', error.message)
}
