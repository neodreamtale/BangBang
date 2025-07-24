import Image from "next/image";
import Link from "next/link";
import { Hammer, Bug, Lightbulb, AlertCircle, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex items-center gap-4">
          <Hammer size={48} className="text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">意见反馈系统</h1>
        </div>
        
        <p className="text-lg text-gray-600 text-center sm:text-left max-w-2xl">
          帮助我们改进产品体验，您的每一个反馈都很重要
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
          <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-md transition-shadow bg-white">
            <Bug size={32} className="text-red-500 mb-3" />
            <h3 className="font-semibold mb-2">Bug反馈</h3>
            <p className="text-sm text-gray-600 text-center">报告程序错误和问题</p>
          </div>
          
          <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-md transition-shadow bg-white">
            <Lightbulb size={32} className="text-yellow-500 mb-3" />
            <h3 className="font-semibold mb-2">功能建议</h3>
            <p className="text-sm text-gray-600 text-center">提出新功能想法</p>
          </div>
          
          <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-md transition-shadow bg-white">
            <AlertCircle size={32} className="text-blue-500 mb-3" />
            <h3 className="font-semibold mb-2">改进建议</h3>
            <p className="text-sm text-gray-600 text-center">优化现有功能体验</p>
          </div>
          
          <div className="flex flex-col items-center p-6 border rounded-lg hover:shadow-md transition-shadow bg-white">
            <MessageSquare size={32} className="text-green-500 mb-3" />
            <h3 className="font-semibold mb-2">其他反馈</h3>
            <p className="text-sm text-gray-600 text-center">其他意见和建议</p>
          </div>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/feedback"
          >
            <Hammer size={20} />
            提交反馈
          </Link>
          <Link
            className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center hover:bg-gray-50 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="/icons"
          >
            查看图标库
          </Link>
        </div>
      </main>
      
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500">
        <span>© 2025 意见反馈系统</span>
        <span>·</span>
        <span>帮助改进产品体验</span>
      </footer>
    </div>
  );
}
