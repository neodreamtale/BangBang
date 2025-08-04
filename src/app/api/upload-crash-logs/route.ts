import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

// 确保上传目录存在
async function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), 'uploads', 'crash-logs')
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }
  return uploadDir
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const deviceId = formData.get('deviceId') as string
    const appVersion = formData.get('appVersion') as string
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 })
    }

    // 验证文件类型
    if (!file.name.endsWith('.zip') && !file.name.endsWith('.log')) {
      return NextResponse.json(
        { error: '只支持 .zip 和 .log 文件' },
        { status: 400 }
      )
    }

    // 验证文件大小 (最大 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: '文件大小不能超过 50MB' },
        { status: 400 }
      )
    }

    const uploadDir = await ensureUploadDir()

    // 生成唯一文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `${deviceId || 'unknown'}_${timestamp}_${file.name}`
    const filePath = path.join(uploadDir, fileName)

    // 保存文件
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // 这里可以保存到数据库
    // await saveCrashLogToDatabase({
    //   fileName,
    //   filePath,
    //   deviceId,
    //   appVersion,
    //   description,
    //   fileSize: file.size,
    //   uploadTime: new Date()
    // })

    console.log('崩溃日志已保存:', {
      fileName,
      deviceId,
      appVersion,
      fileSize: file.size,
      description,
    })

    return NextResponse.json({
      success: true,
      message: '日志上传成功',
      fileName,
      fileSize: file.size,
    })
  } catch (error) {
    console.error('上传崩溃日志失败:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// 如果需要数据库存储，可以添加这个函数
// async function saveCrashLogToDatabase(logData: {
//   fileName: string
//   filePath: string
//   deviceId?: string
//   appVersion?: string
//   description?: string
//   fileSize: number
//   uploadTime: Date
// }) {
//   // 使用你的数据库 ORM/客户端
//   // 例如 Prisma、TypeORM 等
// }
