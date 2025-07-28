'use client'

import Link from "next/link";
import { ArrowLeft, Bug } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import { getFormattedEnvironmentInfo } from "@/utils/environmentDetector";

export default function BugFeedback() {
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
            <div className="max-w-2xl mx-auto">
                {/* 返回按钮 */}
                <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    返回首页
                </Link>

                {/* 页面标题 */}
                <div className="flex items-center gap-4 mb-8">
                    <Bug size={48} className="text-red-500" />
                    <h1 className="text-4xl font-bold">Bug反馈</h1>
                </div>

                <p className="text-lg text-secondary mb-8">
                    请详细描述您遇到的问题，我们会尽快修复
                </p>

                {/* 反馈表单 */}
                <form className="space-y-6">
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                            问题详情 *
                        </label>
                        <textarea
                            id="description"
                            rows={6}
                            className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请详细描述问题的发生过程、错误信息等"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="steps" className="block text-sm font-medium mb-2">
                            重现步骤
                        </label>
                        <textarea
                            id="steps"
                            rows={4}
                            className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1. 打开某些页面&#10;2. 点击某些按钮&#10;3. 出现何种错误"
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
                            className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors font-medium"
                        >
                            提交Bug反馈
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
