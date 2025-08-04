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
    const appVersion = formData.get('appVersion') as string
    const timestamp = formData.get('timestamp') as string

    // 如果有崩溃日志 base64 字符串，处理并保存
    let uploadResult = null
    if (crashLogBase64 && crashLogBase64.trim().length > 0) {
      try {
        // 创建上传目录
        const uploadDir = path.join(process.cwd(), 'uploads', 'crash-logs')
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
          appVersion: appVersion || '1.0.0',
          timestamp: timestamp || new Date().toISOString(),
          uploadedAt: new Date().toISOString(),
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

async function uploadCrashLogAction(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File
    const description = formData.get('description') as string
    const deviceId = formData.get('deviceId') as string
    const appVersion = formData.get('appVersion') as string
    const timestamp = formData.get('timestamp') as string

    if (!file || file.size === 0) {
      return {
        success: false,
        message: '没有找到有效的文件',
      }
    }

    // 验证文件类型
    if (!file.type.includes('zip') && !file.name.endsWith('.zip')) {
      return {
        success: false,
        message: '只支持 ZIP 文件格式',
      }
    }

    // 文件大小限制 (50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return {
        success: false,
        message: '文件大小超过限制 (50MB)',
      }
    }

    // 创建上传目录
    const uploadDir = path.join(process.cwd(), 'uploads', 'crash-logs')
    await fs.mkdir(uploadDir, { recursive: true })

    // 生成唯一文件名
    const timestamp_str = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `crash-log-${timestamp_str}-${Math.random().toString(36).substring(2)}.zip`
    const filepath = path.join(uploadDir, filename)

    // 保存文件
    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(filepath, buffer)

    // 保存元数据
    const metadata = {
      filename,
      originalName: file.name,
      size: file.size,
      description,
      deviceId,
      appVersion,
      timestamp: timestamp || new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
    }

    const metadataPath = path.join(uploadDir, `${filename}.json`)
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))

    console.log(`崩溃日志上传成功: ${filename}, 大小: ${file.size} bytes`)

    return {
      success: true,
      filename,
      message: '文件上传成功',
      size: file.size,
    }
  } catch (error) {
    console.error('上传崩溃日志失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '上传失败',
    }
  }
}
