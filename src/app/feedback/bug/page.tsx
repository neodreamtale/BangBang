'use client'

import Link from 'next/link'
import { ArrowLeft, Bug, FileText } from 'lucide-react'
import BidlinkDebugPanel from '@/components/BidlinkDebugPanel'
import { useState, useEffect } from 'react'
import { isBidlinkApp, getEnvironmentInfo } from '@/utils/bidlinkFileInterface'

export default function BugFeedback() {
  const [isBidlink, setIsBidlink] = useState<boolean>(false)

  // 表单状态
  const [formData, setFormData] = useState({
    description: '',
    steps: '',
    contact: '',
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 清空表单
      setFormData({
        description: '',
        steps: '',
        contact: '',
      })
      setSelectedFile(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadExceptionLogZip = async () => {
    try {
      // 检查是否存在 bidlinkSupport 接口
      if (typeof window !== 'undefined' && window.bidlinkSupport) {
        // 加载崩溃日志
        if (window.bidlinkSupport.loadCrashLogs) {
          const logs = await window.bidlinkSupport.loadCrashLogs()
          console.log('加载到的异常日志:', logs)

          return logs
        }
      } else {
        console.log('未检测到 bidlinkSupport 接口')
      }
    } catch (error) {
      console.error('加载异常日志失败:', error)
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
            <label htmlFor="description">问题详情 *</label>
            <textarea
              className="rounded p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              id="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="请详细描述问题的发生过程、错误信息等"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="steps">重现步骤</label>
            <textarea
              className="rounded p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              id="steps"
              rows={6}
              value={formData.steps}
              onChange={handleInputChange}
              placeholder="1. 打开某些页面&#10;2. 点击某些按钮&#10;3. 出现何种错误"
            />
          </div>

          {isBidlink && (
            <div className="flex items-center gap-2 p-2">
              <FileText size={20} />
              <span>异常日志会自动上传</span>
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
