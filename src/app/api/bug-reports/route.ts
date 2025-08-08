import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const bugReports = await prisma.bugReport.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // 最新的10条记录
    })

    return NextResponse.json(bugReports)
  } catch (error) {
    console.error('获取Bug报告失败:', error)
    return NextResponse.json({ error: 'Failed to fetch bug reports' }, { status: 500 })
  }
}
