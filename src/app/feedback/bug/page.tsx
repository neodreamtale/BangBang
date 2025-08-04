'use client'

import Link from 'next/link'
import { ArrowLeft, Bug, FileText } from 'lucide-react'
import BidlinkDebugPanel from '@/components/BidlinkDebugPanel'
import { useState, useEffect } from 'react'
import {
  isBidlinkApp,
  getEnvironmentInfo,
  formatFileSize,
} from '@/utils/bidlinkFileInterface'
import {
  uploadCrashLogAction,
  submitBugReportAction,
} from '@/lib/actions/upload-actions'

export default function BugFeedback() {
  const [isBidlink, setIsBidlink] = useState<boolean>(false)
  const [crashLogFile, setCrashLogFile] = useState<string | null>(null)

  // 表单状态
  const [formData, setFormData] = useState({
    description: '',
    steps: '',
    contact: '',
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0) // 添加上传进度

  useEffect(() => {
    // 检查是否在Bidlink应用中
    getEnvironmentInfo().then(() => {
      const inBidlinkApp = isBidlinkApp()
      setIsBidlink(inBidlinkApp)
      if (inBidlinkApp) {
        loadExceptionLogZip()
      }
    })
  }, [])

  // 处理表单输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }))
  }

  // 提交表单 - 使用 Server Actions（包含文件上传）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 构建 FormData，包含所有数据
      const submitData = new FormData()
      submitData.append('description', formData.description)
      submitData.append('steps', formData.steps)
      submitData.append('contact', formData.contact)

      // 如果有崩溃日志，添加到同一个请求中
      if (isBidlink && crashLogFile && crashLogFile !== 'uploaded') {
        setUploadProgress(25)

        // 将 base64 转换为 Blob
        const byteCharacters = atob(crashLogFile.split(',')[1] || crashLogFile)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const file = new Blob([byteArray], { type: 'application/zip' })

        console.log('准备上传崩溃日志，文件大小:', formatFileSize(file.size))

        // 添加文件到同一个 FormData
        submitData.append('crashLogFile', file, `crash-log-${Date.now()}.zip`)
        submitData.append('deviceId', 'android-webview')
        submitData.append('appVersion', '1.0.0')
        submitData.append('timestamp', new Date().toISOString())

        setUploadProgress(50)
      }

      // 一次性提交所有数据
      const result = await submitBugReportAction(submitData)

      setUploadProgress(75)

      if (result.success) {
        setUploadProgress(100)

        // 清空表单
        setFormData({
          description: '',
          steps: '',
          contact: '',
        })
        setCrashLogFile('uploaded')

        alert(result.message)

        if (window.bidlinkSupport?.onCrashLogUploaded) {
          window.bidlinkSupport.onCrashLogUploaded(result)
        }
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      setUploadProgress(0)
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      alert(`提交失败: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadExceptionLogZip = async () => {
    try {
      if (typeof window !== 'undefined' && window.bidlinkSupport) {
        if (window.bidlinkSupport.loadCrashLogs) {
          const base64Zip = await window.bidlinkSupport.loadCrashLogs()
          console.log('加载到的异常日志长度:', base64Zip?.length || 0)

          // 检查是否真的读取到了有效的文件内容
          if (
            base64Zip &&
            typeof base64Zip === 'string' &&
            base64Zip.trim().length > 0
          ) {
            setCrashLogFile(base64Zip)
            console.log(
              base64Zip.length > 13 * 1024 * 1024
                ? '⚠️ 崩溃日志文件较大:'
                : '✅ 成功加载崩溃日志文件:',
              formatFileSize(base64Zip.length)
            )
            return base64Zip
          } else {
            console.log('⚠️ 未找到有效的崩溃日志文件')
            setCrashLogFile(null)
          }
        }
      } else {
        console.log('未检测到 bidlinkSupport 接口')
      }
    } catch (error) {
      console.error('加载异常日志失败:', error)
      setCrashLogFile(null) // 确保错误时重置状态
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-start items-center gap-2">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="flex flex-row justify-start items-center p-2 self-start"
        >
          <ArrowLeft size={20} />
          返回首页
        </Link>

        {/* 页面标题 */}
        <div className="flex justify-center items-center">
          <Bug
            size={32}
            className="text-blue-500 hover:text-blue-600 transition-colors rounded-lg"
          />
          <h1 className="text-2xl p-2 bg-gradient-to-r from-red-400 to-blue-300 bg-clip-text text-transparent">
            Bug反馈
          </h1>
        </div>

        <p>请详细描述您遇到的问题，我们会尽快修复</p>

        {/* 反馈表单 */}
        <form
          onSubmit={handleSubmit}
          className="mt-2 w-full max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] p-2 space-y-4"
        >
          <div className="flex flex-col">
            <label htmlFor="description">问题详情 {!crashLogFile && '*'}</label>
            <textarea
              className="rounded p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              id="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder={
                crashLogFile
                  ? '问题详情（可选，已有崩溃日志）'
                  : '请详细描述问题的发生过程、错误信息等'
              }
              required={!crashLogFile}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="steps">重现步骤</label>
            <textarea
              className="rounded p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              id="steps"
              rows={4}
              value={formData.steps}
              onChange={handleInputChange}
              placeholder="1. 打开某些页面&#10;2. 点击某些按钮&#10;3. 出现何种错误"
            />
          </div>

          {isBidlink && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <FileText
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />
              <div className="flex flex-col flex-1">
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  {crashLogFile === 'uploaded'
                    ? '✅ 异常日志已上传'
                    : crashLogFile
                      ? '✅ 异常日志已准备好'
                      : '📂 正在加载异常日志...'}
                </span>
                {crashLogFile && crashLogFile !== 'uploaded' && (
                  <div className="flex flex-col gap-1">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">
                      文件大小: {formatFileSize(crashLogFile.length)} |
                      日志将随反馈一起自动上传
                    </span>
                    {crashLogFile.length > 6 * 1024 * 1024 && (
                      <span className="text-orange-600 dark:text-orange-400 text-xs">
                        ⚠️ 文件较大，上传可能需要一些时间
                      </span>
                    )}
                  </div>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400 mb-1">
                      <span>上传中...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col">
            <label htmlFor="contact">联系方式</label>
            <input
              className="rounded p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              type="email"
              id="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="您的邮箱地址（可选）"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  提交中...
                </>
              ) : (
                '提交Bug反馈'
              )}
            </button>
            <Link
              href="/"
              className="px-8 py-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200  transform hover:scale-105 text-center"
            >
              取消
            </Link>
          </div>
        </form>
      </div>

      {/* 调试面板（仅开发环境显示） */}
      <BidlinkDebugPanel />
    </div>
  )
}
