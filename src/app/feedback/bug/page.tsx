'use client'

import Link from "next/link";
import { ArrowLeft, Bug, FileText } from "lucide-react";
import BidlinkDebugPanel from "@/components/BidlinkDebugPanel";
import { useState, useEffect } from "react";
import { getEnvironmentInfo } from "@/utils/environmentDetector";
import {
    isBidlinkApp,
    getBidlinkExceptionLogs,
    uploadAllExceptionLogs,
    type BidlinkFileInfo
} from "@/utils/bidlinkFileInterface";

export default function BugFeedback() {
    const [isBidlink, setIsBidlink] = useState<boolean>(false);
    const [exceptionLogs, setExceptionLogs] = useState<BidlinkFileInfo[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [autoUploadEnabled, setAutoUploadEnabled] = useState<boolean>(true);

    useEffect(() => {
        // 检查是否在Bidlink应用中
        getEnvironmentInfo().then(envInfo => {
            const inBidlinkApp = envInfo.isBidlinkApp || isBidlinkApp();
            setIsBidlink(inBidlinkApp);

            if (inBidlinkApp) {
                loadExceptionLogs();
            }
        });
    }, []);

    const loadExceptionLogs = async () => {
        try {
            const logs = await getBidlinkExceptionLogs();
            setExceptionLogs(logs);

            if (logs.length > 0) {
                setUploadStatus(`发现 ${logs.length} 个异常日志文件，可随Bug反馈一起提交`);
            } else {
                setUploadStatus('未发现异常日志文件');
            }
        } catch (error) {
            console.error('Failed to load exception logs:', error);
            setUploadStatus('获取异常日志失败');
        }
    };

    const handleAutoUploadLogs = async () => {
        if (exceptionLogs.length === 0) {
            setUploadStatus('没有异常日志需要上传');
            return;
        }

        setIsUploading(true);
        setUploadStatus('正在自动上传异常日志...');

        try {
            const result = await uploadAllExceptionLogs();
            setUploadStatus(result.message);

            if (result.success && result.uploadedCount > 0) {
                // 上传成功后重新检查异常日志
                await loadExceptionLogs();
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setUploadStatus(`上传失败: ${errorMessage}`);
        } finally {
            setIsUploading(false);
        }
    }; return (
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

                    {/* Bidlink应用异常日志自动上传 */}
                    {isBidlink && (
                        <div className="border border-blue-200 rounded-lg p-4 ">
                            <div className="flex items-center gap-2">
                                <FileText size={20} className="text-blue-500" />
                                <label className="block text-sm font-medium">
                                    异常日志自动上传
                                </label>
                            </div>

                            {/* 异常日志状态显示 */}
                            <div className="bg-card rounded p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">异常日志状态</span>
                                    <button
                                        type="button"
                                        onClick={loadExceptionLogs}
                                        className="text-xs text-blue-500 hover:text-blue-600"
                                    >
                                        刷新
                                    </button>
                                </div>

                                {exceptionLogs.length > 0 && (
                                    <div className="text-xs text-text-secondary space-y-1">
                                        {exceptionLogs.map((log, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span>{log.name}</span>
                                                <span>{(log.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 自动上传控制 */}
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={autoUploadEnabled}
                                        onChange={(e) => setAutoUploadEnabled(e.target.checked)}
                                        className="w-4 h-4 text-blue-500"
                                    />
                                    <span className="text-sm">随Bug反馈一起提交异常日志</span>
                                </label>

                                {exceptionLogs.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleAutoUploadLogs}
                                        disabled={isUploading}
                                        className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {isUploading ? '上传中...' : '立即上传'}
                                    </button>
                                )}
                            </div>

                            {/* 上传状态显示 */}
                            {uploadStatus && (
                                <div className={`text-sm p-2 rounded ${uploadStatus.includes('成功')
                                    ? 'bg-green-100 text-green-700'
                                    : uploadStatus.includes('失败')
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {uploadStatus}
                                </div>
                            )}
                        </div>
                    )}

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

            {/* 调试面板（仅开发环境显示） */}
            <BidlinkDebugPanel />
        </div>
    );
}
