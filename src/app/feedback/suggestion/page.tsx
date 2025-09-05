'use client'

import Link from 'next/link'
// ...existing code...
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import { useState, useEffect, useActionState } from 'react'
import { submitSuggestionAction } from '@/lib/actions/upload-actions'
import LoadingOverlay from '@/components/LoadingOverlay'

export default function SuggestionFeedback() {
  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    expected: '',
    contact: '',
  })

  // useActionState 处理服务端提交
  const [state, submitAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      try {
        const result = await submitSuggestionAction(formData)
        return result
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : '提交失败',
        }
      }
    },
    { success: false, message: '' }
  )

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }))
  }

  // 提交成功后重置表单
  useEffect(() => {
    if (state.success) {
      setFormData({
        title: '',
        category: '',
        description: '',
        expected: '',
        contact: '',
      })
    }
  }, [state.success])

  return (
    <div className="relative">
      <LoadingOverlay
        isVisible={isPending}
        title="正在提交建议"
        progress={isPending ? 60 : 0}
        progressText={isPending ? '正在上传数据...' : ''}
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
          <AlertCircle size={32} className="text-blue-500 hover:text-blue-600 transition-colors rounded-lg" />
          <h1 className="text-2xl p-2 bg-gradient-to-r from-blue-400 to-green-300 bg-clip-text text-transparent">改进建议</h1>
        </div>

        <p>欢迎提交您的建议，我们会认真评估和采纳</p>

        {/* 反馈表单 */}
        <form action={submitAction} className="mt-2 w-full max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] p-2 space-y-4">
          <div className="flex flex-col">
            <label htmlFor="title">建议标题 *</label>
            <input
              className="rounded p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="请简要描述您的建议"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="category">建议类型 *</label>
            <select
              className="rounded p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">请选择建议类型</option>
              <option value="ui">界面设计改进</option>
              <option value="feature">功能优化</option>
              <option value="performance">性能提升</option>
              <option value="usability">易用性改进</option>
              <option value="other">其他建议</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="description">详细描述 *</label>
            <textarea
              className="rounded p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="请详细描述您的建议和背景"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="expected">期望效果</label>
            <textarea
              className="rounded p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              id="expected"
              name="expected"
              rows={3}
              value={formData.expected}
              onChange={handleInputChange}
              placeholder="描述您希望达到的效果"
            />
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

          {!state.success && state.message && <div className="text-red-600 text-center font-medium">{state.message}</div>}

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
                '提交改进建议'
              )}
            </button>
            <Link href="/" className="px-8 py-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200  transform hover:scale-105 text-center">
              取消
            </Link>
          </div>
        </form>

        {/* 提交成功提示 */}
        {state.success && <div className="p-8 text-green-600 text-center text-lg font-semibold">感谢您的建议，已成功提交！</div>}
      </div>
      {/* 可选：调试面板，可根据需要添加 <BidlinkDebugPanel /> */}
    </div>
  )
}
