'use client'

import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import { getFormattedEnvironmentInfo } from "@/utils/environmentDetector";

export default function SuggestionFeedback() {
    const { theme } = useTheme();
    const [environmentInfo, setEnvironmentInfo] = useState<string>('正在检测环境信息...');

    useEffect(() => {
        // 自动获取环境信息
        getFormattedEnvironmentInfo().then(info => {
            setEnvironmentInfo(info);
        }).catch(() => {
            setEnvironmentInfo('无法检测环境信息');
        });
    }, []);

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
                <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    返回首页
                </Link>

                {/* 页面标题 */}
                <div className="flex items-center gap-4 mb-8">
                    <AlertCircle size={48} className="text-blue-500" />
                    <h1 className="text-4xl font-bold">改进建议</h1>
                </div>

                {/* 反馈表单 */}
                <form className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                            建议标题 *
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请简要描述您的建议"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-2">
                            建议类型 *
                        </label>
                        <select
                            id="category"
                            className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                            详细描述 *
                        </label>
                        <textarea
                            id="description"
                            rows={6}
                            className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请详细描述您的改进建议和期望效果"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="expected" className="block text-sm font-medium mb-2">
                            期望效果
                        </label>
                        <textarea
                            id="expected"
                            rows={3}
                            className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="描述您希望达到的效果"
                        />
                    </div>

                    <div>
                        <label htmlFor="contact" className="block text-sm font-medium mb-2">
                            联系方式
                        </label>
                        <input
                            type="email"
                            id="contact"
                            className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="您的邮箱地址（可选）"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                            提交改进建议
                        </button>
                        <Link
                            href="/"
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
