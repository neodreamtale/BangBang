'use client'

import Link from 'next/link'
import { ArrowLeft, Bug, FileText } from 'lucide-react'
import { useState, useEffect, useActionState } from 'react'
import BidlinkDebugPanel from '@/components/BidlinkDebugPanel'
import LoadingOverlay from '@/components/LoadingOverlay'

import { isBidlinkApp, getEnvironmentInfo, formatFileSize, getUserId, loadExceptionLogZip } from '@/utils/bidlinkFileInterface'
import { submitBugsAction } from '@/lib/actions/upload-actions'

import withBasePath from '@/lib/basePath'

export default function BugFeedback() {
  const [isBidlink, setIsBidlink] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  // 使用 useActionState 来处理表单提交
  const [state, submitAction, isPending] = useActionState(
    async (prevState: { success: boolean; message: string }, formData: FormData) => {
      setUploadProgress(25)
      try {
        // 如果在 Bidlink 环境中，尝试读取最新的崩溃日志
        if (isBidlink) {
          setUploadProgress(40)
          const latestCrashLog = await loadExceptionLogZip()
          formData.append('userId', getUserId() ?? '')
          formData.append('timestamp', new Date().toLocaleString())
          if (latestCrashLog) {
            console.log('最新崩溃日志:', formatFileSize(latestCrashLog.length))
            // 直接添加 base64 字符串到 FormData
            formData.append('crashLogBase64', latestCrashLog)
            setUploadProgress(60)
          }
        }
        setUploadProgress(75)
        // 提交表单数据
        const result = await submitBugsAction(formData)
        setUploadProgress(100)
        if (result.success) {
          if (window.bidlinkSupport?.onCrashLogUploaded) {
            window.bidlinkSupport.onCrashLogUploaded()
          }
          return {
            success: true,
            message: result.message,
          }
        } else {
          throw new Error(result.message)
        }
      } catch (error) {
        setUploadProgress(0)
        return {
          success: false,
          message: error instanceof Error ? error.message : '未知错误',
        }
      }
    },
    { success: false, message: '' }
  )

  // 当提交成功时显示消息并重置进度
  useEffect(() => {
    if (state.success && state.message) {
      alert(state.message)
      setUploadProgress(0)
    } else if (!state.success && state.message) {
      console.info(state)
      alert(`提交失败: ${state.message}`)
      setUploadProgress(0)
    }
  }, [state])

  // 当开始提交时重置进度
  useEffect(() => {
    if (isPending) {
      setUploadProgress(10)
    }
  }, [isPending])

  // 表单状态
  const [formData, setFormData] = useState({
    description: '',
    steps: '',
    contact: '',
  })

  useEffect(() => {
    // 检查是否在Bidlink应用中
    getEnvironmentInfo().then(() => {
      setIsBidlink(isBidlinkApp())

      // 调试信息：检查可用的接口
      console.log('🔍 环境调试信息:')
      console.log('- isBidlinkApp():', isBidlinkApp())
      console.log('- window.bidlinkSupport:', typeof window.bidlinkSupport, window.bidlinkSupport)
      console.log('- window.android:', typeof window.android, window.android)
      console.log('- getUserId():', getUserId())
    })
  }, [])

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }))
  }

  // 当提交成功时重置表单
  useEffect(() => {
    if (state.success) {
      setFormData({
        description: '',
        steps: '',
        contact: '',
      })
    }
  }, [state.success])

  // 生成进度描述文本
  const getProgressText = (progress: number) => {
    if (progress <= 25) return '正在准备数据...'
    if (progress <= 40) return '检测崩溃日志...'
    if (progress <= 60) return '读取日志文件...'
    if (progress <= 75) return '上传数据中...'
    return '处理反馈信息...'
  }

  return (
    <div className="relative">
      {/* 全屏加载蒙层 */}
      <LoadingOverlay
        isVisible={isPending}
        title="正在提交反馈"
        progress={uploadProgress}
        progressText={getProgressText(uploadProgress)}
        description="请稍候，不要关闭页面..."
      />

      <div className="flex flex-col justify-start items-center gap-2">
        {/* 返回按钮 */}
        <Link href="/" className="flex flex-row justify-start items-center p-2 self-start">
          <ArrowLeft size={20} />
          返回首页
        </Link>

        {/* 页面标题 */}
        <div className="flex justify-center items-center">
          <Bug size={32} className="text-blue-500 hover:text-blue-600 transition-colors rounded-lg" />
          <h1 className="text-2xl p-2 bg-gradient-to-r from-red-400 to-blue-300 bg-clip-text text-transparent">Bug反馈</h1>
        </div>

        <p>请详细描述您遇到的问题，我们会尽快修复!</p>

        {/* 反馈表单 */}
        <form action={submitAction} className="mt-2 w-full max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] p-2 space-y-4">
          <div className="flex flex-col">
            <label htmlFor="description">问题详情</label>
            <textarea
              className="rounded p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="请详细描述问题的发生过程、错误信息等"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="steps">重现步骤</label>
            <textarea
              className="rounded p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              id="steps"
              name="steps"
              rows={4}
              value={formData.steps}
              onChange={handleInputChange}
              placeholder="1. 打开某些页面&#10;2. 点击某些按钮&#10;3. 出现何种错误"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <FileText size={20} className="text-blue-600 dark:text-blue-400" />
            <div className="flex flex-col flex-1 text-blue-600 dark:text-blue-400">提交时会自动读取最新的崩溃日志文件</div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="contact">联系方式</label>
            <input
              className="rounded p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              type="email"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="您的邮箱地址（可选）"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              {isPending ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  提交中...
                </>
              ) : (
                '提交Bug反馈'
              )}
            </button>
            <Link href="/" className="px-8 py-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200  transform hover:scale-105 text-center">
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
