'use server'

import { promises as fs } from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import { prisma } from '@/lib/prisma'

export interface UploadResult {
  success: boolean
  filename?: string
  message: string
  size?: number
}

export async function submitBugsAction(formData: FormData) {
  try {
    const description = formData.get('description') as string
    const steps = formData.get('steps') as string
    const contact = formData.get('contact') as string
    const crashLogBase64 = formData.get('crashLogBase64') as string | null
    const userId = formData.get('userId') as string | null

    // 处理崩溃日志上传（如果有的话）
    let uploadResult = null
    if (crashLogBase64 && crashLogBase64.trim().length > 0) {
      uploadResult = await processCrashLogUpload({ crashLogBase64, userId })

      // 如果上传失败，直接返回错误
      if (!uploadResult.success) {
        return uploadResult
      }
    }

    // 处理 Bug 反馈数据 - 保存到数据库
    const bugReport = await prisma.bugReport.create({
      data: {
        description,
        steps: steps || null,
        contact: contact || null,
        userId: userId || null,
        hasCrashLog: !!crashLogBase64,
        crashLogPath: uploadResult?.success ? uploadResult.filename : null,
        crashLogSize: uploadResult?.size || null,
        crashLogFilename: uploadResult?.filename || null,
        status: 'open',
        priority: 'medium',
      },
    })

    console.log('Bug 反馈已保存到数据库:', {
      id: bugReport.id,
      description: bugReport.description,
      hasCrashLog: bugReport.hasCrashLog,
      userId: bugReport.userId,
      createdAt: bugReport.createdAt,
    })

    return {
      success: true,
      message: crashLogBase64 ? 'Bug 反馈和崩溃日志提交成功！' : 'Bug 反馈提交成功！',
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

/**
 * 处理崩溃日志上传
 */
async function processCrashLogUpload({ crashLogBase64, userId }: CrashLogData): Promise<UploadResult> {
  try {
    // 创建用户目录
    const uploadDir = await createUserDirectory(userId)

    // 生成文件名和路径
    const filename = getTempFileName()
    const filepath = path.join(uploadDir, filename)

    // 转换 base64 为 Buffer
    const base64Data = crashLogBase64.split(',')[1] || crashLogBase64
    const buffer = Buffer.from(base64Data, 'base64')

    // 验证文件大小
    const validation = validateFileSize(buffer)
    if (!validation.valid) {
      return {
        success: false,
        message: validation.error!,
      }
    }

    // 写入文件
    await fs.writeFile(filepath, buffer)

    // 如果是ZIP文件，解压并删除原文件
    if (filename.toLowerCase().endsWith('.zip')) {
      try {
        await extractZipFile(filepath, uploadDir)
        await fs.unlink(filepath) // 删除原ZIP文件
        console.log(`✅ ZIP file extracted to: ${uploadDir}`)
      } catch (error) {
        console.error('❌ Failed to extract ZIP file:', error)
        // 解压失败时保留原文件
      }
    }

    console.log(`崩溃日志上传成功: ${filename}, 大小: ${buffer.length} bytes`)

    return {
      success: true,
      filename,
      message: filename.toLowerCase().endsWith('.zip') ? '崩溃日志上传并解压成功' : '崩溃日志上传成功',
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

interface CrashLogData {
  crashLogBase64: string
  userId: string | null
}

/**
 * 创建用户专用的上传目录
 */
async function createUserDirectory(userId: string | null): Promise<string> {
  const baseUploadDir = path.join(process.cwd(), 'uploads', 'crash-logs')
  let uploadDir: string

  if (userId) {
    uploadDir = path.join(baseUploadDir, userId)
    console.log(`为用户 ${userId} 创建目录`)
  } else {
    uploadDir = path.join(baseUploadDir, 'anonymous')
    console.log('使用匿名用户目录')
  }

  await fs.mkdir(uploadDir, { recursive: true })
  return uploadDir
}

/**
 * 生成唯一的文件名
 */
function getTempFileName(): string {
  const timestamp_str = new Date().toISOString().replace(/[:.]/g, '-')
  return `crash-log-${timestamp_str}.zip`
}

/**
 * 验证文件大小
 */
function validateFileSize(buffer: Buffer): { valid: boolean; error?: string } {
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (buffer.length > maxSize) {
    return {
      valid: false,
      error: `崩溃日志文件过大 (${Math.round(buffer.length / 1024 / 1024)}MB)，超过 50MB 限制`,
    }
  }
  return { valid: true }
}

/**
 * 解压ZIP文件到指定目录
 */
async function extractZipFile(zipFilePath: string, extractToDir: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const unzipProcess = spawn('unzip', ['-o', zipFilePath, '-d', extractToDir])

    unzipProcess.on('close', code => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Unzip failed with code ${code}`))
      }
    })

    unzipProcess.on('error', reject)
  })
}
