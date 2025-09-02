'use client'

import Link from 'next/link'
import { Hammer, Bug, AlertCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Home() {
  return (
    <div className="min-h-screen transition-colors bg-white dark:bg-gray-900">
      {/* 主题切换按钮 */}
      <ThemeToggle />

      <main className="container mx-auto px-2 py-4">
        <div className="flex justify-center items-center">
          <Hammer
            size={32}
            className="text-blue-500 hover:text-blue-600 transition-colors rounded-lg"
          />
          <h1 className="text-2xl p-2 bg-gradient-to-r from-red-400 to-blue-300 bg-clip-text text-transparent">
            意见反馈123
          </h1>
        </div>

        <p className="text-center text-lg mb-12 text-gray-600 dark:text-gray-300">
          帮助我们改进产品 您的每个反馈都很重要
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link
            href="/feedback/bug"
            className="card block hover:scale-105 transition-transform"
          >
            <Bug size={32} className="text-red-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Bug反馈</h3>
            <p className="text-gray-600 dark:text-gray-300">
              报告程序错误和问题
            </p>
          </Link>

          <Link
            href="/feedback/suggestion"
            className="card block hover:scale-105 transition-transform"
          >
            <AlertCircle size={32} className="text-yellow-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">改进建议</h3>
            <p className="text-gray-600 dark:text-gray-300">优化现有功能体验</p>
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="text-center mt-8">
            <Link
              href="/icons"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              查看图标库
            </Link>
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-gray-500 dark:text-gray-400">
        <span>© 2025 意见反馈系统</span>
        <span className="mx-2">·</span>
        <span>帮助改进产品体验</span>
      </footer>
    </div>
  )
}
