'use client'

import Link from "next/link";
import { Hammer, Bug, AlertCircle, MessageSquare } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {/* 主题切换按钮 - 固定在右上角 */}
      <div className="fixed top-4 right-4 z-10 flex items-center gap-2">
        <ThemeToggle />
        <span className="text-xs px-2 py-1 rounded bg-secondary text-text-secondary">
          {theme}
        </span>
      </div>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex items-center gap-4">
          <Hammer size={48} className="text-blue-600" />
          <h1 className="text-4xl font-bold">意见反馈系统</h1>
        </div>

        <p className="text-lg text-secondary text-center sm:text-left max-w-2xl">
          帮助我们改进产品体验，您的每一个反馈都很重要
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
          <div className="flex flex-col items-center p-6 border border-default rounded-lg hover:shadow-md transition-shadow bg-card">
            <Bug size={32} className="text-red-500 mb-3" />
            <h3 className="font-semibold mb-2">Bug反馈</h3>
            <p className="text-sm text-secondary text-center">报告程序错误和问题</p>
          </div>

          <div className="flex flex-col items-center p-6 border border-default rounded-lg hover:shadow-md transition-shadow bg-card">
            <AlertCircle size={32} className="text-blue-500 mb-3" />
            <h3 className="font-semibold mb-2">改进建议</h3>
            <p className="text-sm text-secondary text-center">优化现有功能体验</p>
          </div>

          <div className="flex flex-col items-center p-6 border border-default rounded-lg hover:shadow-md transition-shadow bg-card">
            <MessageSquare size={32} className="text-green-500 mb-3" />
            <h3 className="font-semibold mb-2">其他反馈</h3>
            <p className="text-sm text-secondary text-center">其他意见和建议</p>
          </div>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <Link className="rounded-full border transition-colors flex items-center justify-center hover:bg-secondary font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto border-border-default text-text-secondary"
            href="/icons">
            查看图标库
          </Link>
        )}
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-text-secondary">
        <span>© 2025 意见反馈系统</span>
        <span>·</span>
        <span>帮助改进产品体验</span>
      </footer>
    </div>
  );
}
