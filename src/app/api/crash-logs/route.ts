import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const uploadDir = path.join(process.cwd(), 'uploads', 'crash-logs')

    try {
      const files = await readdir(uploadDir)
      const fileList = await Promise.all(
        files.map(async fileName => {
          const filePath = path.join(uploadDir, fileName)
          const stats = await stat(filePath)

          // 解析文件名中的信息
          const parts = fileName.split('_')
          const deviceId = parts[0] || 'unknown'
          const timestamp = parts[1] || ''

          return {
            fileName,
            deviceId,
            uploadTime: stats.birthtime,
            fileSize: stats.size,
            fileSizeReadable: formatFileSize(stats.size),
          }
        })
      )

      // 按上传时间倒序排列
      fileList.sort((a, b) => b.uploadTime.getTime() - a.uploadTime.getTime())

      return NextResponse.json({ files: fileList })
    } catch (error) {
      // 如果目录不存在，返回空列表
      return NextResponse.json({ files: [] })
    }
  } catch (error) {
    console.error('获取崩溃日志列表失败:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
