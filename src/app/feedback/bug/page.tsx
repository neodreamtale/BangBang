'use client'

import Link from "next/link";
import { ArrowLeft, Bug, FileText } from "lucide-react";
import BidlinkDebugPanel from "@/components/BidlinkDebugPanel";
import { useState, useEffect } from "react";
import {
    isBidlinkApp,
    getEnvironmentInfo,
    type ExceptLogFile
} from "@/utils/bidlinkFileInterface";

export default function BugFeedback() {
    const [isBidlink, setIsBidlink] = useState<boolean>(false);
    const [exceptionLogs, setExceptionLogs] = useState<ExceptLogFile[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [autoUploadEnabled, setAutoUploadEnabled] = useState<boolean>(true);

    // 表单状态
    const [formData, setFormData] = useState({
        description: '',
        steps: '',
        contact: ''
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitResult, setSubmitResult] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        // 检查是否在Bidlink应用中
        getEnvironmentInfo().then(() => {
            const inBidlinkApp = isBidlinkApp();
            setIsBidlink(inBidlinkApp);
            if (inBidlinkApp) {
                loadExceptionLogZip();
            }
        });
    }, []);

    // 处理表单输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // 将文件转换为 base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // 移除 data:application/zip;base64, 前缀
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    // 提交表单
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.description.trim()) {
            setSubmitResult('请填写问题详情');
            return;
        }

        setIsSubmitting(true);
        setSubmitResult('');

        try {
            const submitData = {
                type: 'bug' as const,
                description: formData.description,
                steps: formData.steps,
                contact: formData.contact,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                attachedZipFile: null as string | null,
                exceptionLogsUploaded: null as number | null
            };


            setSubmitResult('Bug反馈提交成功！我们会尽快处理您的问题。');

            // 清空表单
            setFormData({
                description: '',
                steps: '',
                contact: ''
            });
            setSelectedFile(null);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            setSubmitResult(`提交失败: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const loadExceptionLogZip = async () => {

    };


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
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                            问题详情 *
                        </label>
                        <textarea
                            id="description"
                            rows={6}
                            value={formData.description}
                            onChange={handleInputChange}
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
                            value={formData.steps}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1. 打开某些页面&#10;2. 点击某些按钮&#10;3. 出现何种错误"
                        />
                    </div>

                    {/* Bidlink应用异常日志自动上传 */}
                    {isBidlink && (
                        <div className="border border-blue-200 rounded-lg p-4 ">
                            <div className="flex items-center gap-2">
                                <FileText size={20} className="text-blue-500" />
                                <label className="block text-sm font-medium">
                                    异常日志自动上传
                                </label>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="contact" className="block text-sm font-medium mb-2">
                            联系方式
                        </label>
                        <input
                            type="email"
                            id="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-default rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="您的邮箱地址（可选）"
                        />
                    </div>

                    {/* 提交结果显示 */}
                    {submitResult && (
                        <div className={`p-3 rounded-lg text-sm ${submitResult.includes('成功')
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {submitResult}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isSubmitting ? '提交中...' : '提交Bug反馈'}
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

            {/* 调试面板（仅开发环境显示） */}
            <BidlinkDebugPanel />
        </div>
    );
}
