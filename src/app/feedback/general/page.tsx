'use client'

import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
// ...existing code...

export default function GeneralFeedback() {
    const { theme } = useTheme();
    const [environmentInfo, setEnvironmentInfo] = useState<string>('正在检测环境信息...');

    return (
        <div className="font-sans min-h-screen p-8 pb-20 sm:p-20">
            {/* 主题切换按钮 - 固定在右上角 */}
            <div className="fixed top-4 right-4 z-10 flex items-center gap-2">
                <ThemeToggle />
                <span className="text-xs px-2 py-1 rounded bg-secondary text-text-secondary">
                    {theme}
                </span>
            </div>

            <div className="max-w-2xl mx-auto">
                {/* 返回按钮 */}
                <Link href={'/'} className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    返回首页
                </Link>

                {/* 页面标题 */}
                <div className="flex items-center gap-4 mb-8">
                    <MessageSquare size={48} className="text-green-500" />
                    <h1 className="text-4xl font-bold">其他反馈</h1>
                </div>

                <p className="text-lg text-secondary mb-8">
                    分享您的想法、建议或任何其他意见
                </p>

                {/* 反馈表单 */}
                <form className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                            反馈标题 *
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="请简要描述您的反馈内容"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium mb-2">
                            反馈类型 *
                        </label>
                        <select
                            id="type"
                            className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        >
                            <option value="">请选择反馈类型</option>
                            <option value="general">一般意见</option>
                            <option value="question">问题咨询</option>
                            <option value="complaint">投诉建议</option>
                            <option value="praise">表扬鼓励</option>
                            <option value="cooperation">合作建议</option>
                            <option value="other">其他</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                            详细内容 *
                        </label>
                        <textarea
                            id="description"
                            rows={8}
                            className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="请详细描述您的想法、意见或建议..."
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="expectation" className="block text-sm font-medium mb-2">
                            您的期望
                        </label>
                        <textarea
                            id="expectation"
                            rows={3}
                            className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="您希望我们如何回应或处理这个反馈？"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="usage" className="block text-sm font-medium mb-2">
                                使用频率
                            </label>
                            <select
                                id="usage"
                                className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">请选择</option>
                                <option value="daily">每天</option>
                                <option value="weekly">每周</option>
                                <option value="monthly">每月</option>
                                <option value="rarely">偶尔</option>
                                <option value="first-time">首次使用</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="satisfaction" className="block text-sm font-medium mb-2">
                                满意度
                            </label>
                            <select
                                id="satisfaction"
                                className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">请选择</option>
                                <option value="5">非常满意</option>
                                <option value="4">满意</option>
                                <option value="3">一般</option>
                                <option value="2">不满意</option>
                                <option value="1">非常不满意</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="environment" className="block text-sm font-medium mb-2">
                            环境信息 (自动检测)
                        </label>
                        <div className="w-full p-3 border border-default rounded-lg bg-secondary/20 text-sm text-text-secondary min-h-[48px] flex items-center">
                            {environmentInfo}
                        </div>
                        <p className="text-xs text-text-secondary mt-1">
                            有助于我们更好地理解和处理您的反馈
                        </p>
                    </div>

                    <div>
                        <label htmlFor="contact" className="block text-sm font-medium mb-2">
                            联系方式
                        </label>
                        <input
                            type="email"
                            id="contact"
                            className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="您的邮箱地址（可选）"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="follow-up"
                            className="w-4 h-4 text-green-500 border-default rounded focus:ring-green-500"
                        />
                        <label htmlFor="follow-up" className="text-sm text-text-secondary">
                            我希望收到反馈处理结果的通知
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                            提交反馈
                        </button>
                        <Link
                            href={'/'}
                            className="flex-1 bg-secondary text-text-secondary py-3 px-6 rounded-lg hover:bg-secondary/80 transition-colors font-medium text-center"
                        >
                            取消
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
