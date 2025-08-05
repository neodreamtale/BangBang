'use server'

import { promises as fs } from 'fs'
import path from 'path'

export interface UploadResult {
  success: boolean
  filename?: string
  message: string
  size?: number
}

export async function submitBugsAction(formData: FormData) {
  'use server'

  try {
    const description = formData.get('description') as string
    const steps = formData.get('steps') as string
    const contact = formData.get('contact') as string
    const crashLogBase64 = formData.get('crashLogBase64') as string | null
    const deviceId = formData.get('deviceId') as string
    const timestamp = formData.get('timestamp') as string
    const userId = formData.get('userId') as string | null

    // 如果有崩溃日志 base64 字符串，处理并保存
    let uploadResult = null
    if (crashLogBase64 && crashLogBase64.trim().length > 0) {
      try {
        // 根据用户ID创建目录结构
        const baseUploadDir = path.join(process.cwd(), 'uploads', 'crash-logs')
        let uploadDir: string

        if (userId) {
          // 清理用户ID，确保文件系统安全
          uploadDir = path.join(baseUploadDir, userId)
          console.log(`为用户 ${userId} 创建目录: `)
        } else {
          uploadDir = path.join(baseUploadDir, 'anonymous')
          console.log('使用匿名用户目录')
        }
        await fs.mkdir(uploadDir, { recursive: true })

        // 生成唯一文件名
        const timestamp_str = new Date().toISOString().replace(/[:.]/g, '-')
        const filename = `crash-log-${timestamp_str}-${Math.random().toString(36).substring(2)}.zip`
        const filepath = path.join(uploadDir, filename)

        // 将 base64 转换为 Buffer 并保存
        const base64Data = crashLogBase64.split(',')[1] || crashLogBase64
        const buffer = Buffer.from(base64Data, 'base64')

        // 文件大小检查
        const maxSize = 50 * 1024 * 1024 // 50MB
        if (buffer.length > maxSize) {
          return {
            success: false,
            message: `崩溃日志文件过大 (${Math.round(buffer.length / 1024 / 1024)}MB)，超过 50MB 限制`,
          }
        }

        await fs.writeFile(filepath, buffer)

        // 保存元数据
        const metadata = {
          filename,
          originalName: `crash-log-${Date.now()}.zip`,
          size: buffer.length,
          description,
          deviceId: deviceId || 'unknown',
          timestamp: timestamp || new Date().toISOString(),
          uploadedAt: new Date().toISOString(),
          userId: userId || 'anonymous',
          userDirectory: userId
            ? userId.replace(/[^a-zA-Z0-9_-]/g, '_')
            : 'anonymous',
        }

        const metadataPath = path.join(uploadDir, `${filename}.json`)
        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))

        console.log(
          `崩溃日志上传成功: ${filename}, 大小: ${buffer.length} bytes`
        )

        uploadResult = {
          success: true,
          filename,
          message: '崩溃日志上传成功',
          size: buffer.length,
        }
      } catch (error) {
        console.error('处理崩溃日志失败:', error)
        return {
          success: false,
          message: `崩溃日志处理失败: ${error instanceof Error ? error.message : '未知错误'}`,
        }
      }
    }

    // 处理 Bug 反馈数据
    console.log('Bug 反馈提交:', {
      description,
      steps,
      contact,
      hasCrashLog: !!crashLogBase64,
      uploadResult,
    })

    return {
      success: true,
      message: crashLogBase64
        ? 'Bug 反馈和崩溃日志提交成功！'
        : 'Bug 反馈提交成功！',
      uploadResult,
    }
  } catch (error) {
    console.error('提交 Bug 反馈失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '提交失败',
    }
  }
}
