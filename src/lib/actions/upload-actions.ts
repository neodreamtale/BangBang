'use server'

import { promises as fs } from 'fs'
import path from 'path'

export interface UploadResult {
  success: boolean
  filename?: string
  message: string
  size?: number
}

export async function uploadCrashLogAction(
  formData: FormData
): Promise<UploadResult> {
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

export async function submitBugReportAction(formData: FormData) {
  'use server'

  try {
    const description = formData.get('description') as string
    const steps = formData.get('steps') as string
    const contact = formData.get('contact') as string
    const crashLogFile = formData.get('crashLogFile') as File | null
    const deviceId = formData.get('deviceId') as string
    const appVersion = formData.get('appVersion') as string
    const timestamp = formData.get('timestamp') as string

    // 如果有崩溃日志文件，先处理文件上传
    let uploadResult = null
    if (crashLogFile && crashLogFile.size > 0) {
      const uploadFormData = new FormData()
      uploadFormData.append('file', crashLogFile)
      uploadFormData.append('description', description)
      uploadFormData.append('deviceId', deviceId || 'unknown')
      uploadFormData.append('appVersion', appVersion || '1.0.0')
      uploadFormData.append('timestamp', timestamp || new Date().toISOString())

      uploadResult = await uploadCrashLogAction(uploadFormData)

      if (!uploadResult.success) {
        return {
          success: false,
          message: `文件上传失败: ${uploadResult.message}`,
        }
      }
    }

    // 处理 Bug 反馈数据
    console.log('Bug 反馈提交:', {
      description,
      steps,
      contact,
      hasFile: !!crashLogFile,
      uploadResult,
    })

    return {
      success: true,
      message: crashLogFile
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
