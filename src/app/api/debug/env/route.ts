import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NODE_ENV: process.env.NODE_ENV,
    message: '这些环境变量是 Next.js 自动加载的'
  })
}
