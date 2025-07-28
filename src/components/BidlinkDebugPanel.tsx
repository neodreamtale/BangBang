import React, { useState, useEffect } from 'react';
import {
    enableBidlinkDebugMode,
    disableBidlinkDebugMode,
    getBidlinkDebugStatus,
    uploadAllExceptionLogs
} from '@/utils/bidlinkFileInterface';

export default function BidlinkDebugPanel() {
    const [debugStatus, setDebugStatus] = useState(getBidlinkDebugStatus());
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<any>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setDebugStatus(getBidlinkDebugStatus());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleToggleDebugMode = () => {
        if (debugStatus.isDebugMode) {
            disableBidlinkDebugMode();
        } else {
            enableBidlinkDebugMode();
        }
        setDebugStatus(getBidlinkDebugStatus());
    };

    const handleTestUpload = async () => {
        setIsUploading(true);
        setUploadResult(null);

        try {
            const result = await uploadAllExceptionLogs();
            setUploadResult(result);
        } catch (error) {
            setUploadResult({
                success: false,
                message: error instanceof Error ? error.message : '测试失败',
                uploadedCount: 0,
                totalCount: 0
            });
        } finally {
            setIsUploading(false);
        }
    };

    // 只在开发环境显示
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
            <div className="text-sm font-bold mb-3 border-b border-gray-600 pb-2">
                🔧 Bidlink 调试面板
            </div>

            <div className="space-y-3 text-xs">
                {/* 状态显示 */}
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span>调试模式:</span>
                        <span className={debugStatus.isDebugMode ? 'text-green-400' : 'text-red-400'}>
                            {debugStatus.isDebugMode ? '启用' : '禁用'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Bidlink检测:</span>
                        <span className={debugStatus.isBidlinkDetected ? 'text-green-400' : 'text-red-400'}>
                            {debugStatus.isBidlinkDetected ? '已检测' : '未检测'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>模拟接口:</span>
                        <span className={debugStatus.mockInterfaceAvailable ? 'text-green-400' : 'text-red-400'}>
                            {debugStatus.mockInterfaceAvailable ? '可用' : '不可用'}
                        </span>
                    </div>
                </div>

                {/* 控制按钮 */}
                <div className="space-y-2">
                    <button
                        onClick={handleToggleDebugMode}
                        className={`w-full py-2 px-3 rounded text-xs font-medium ${debugStatus.isDebugMode
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {debugStatus.isDebugMode ? '禁用调试模式' : '启用调试模式'}
                    </button>

                    {debugStatus.isBidlinkDetected && (
                        <button
                            onClick={handleTestUpload}
                            disabled={isUploading}
                            className="w-full py-2 px-3 rounded text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
                        >
                            {isUploading ? '测试上传中...' : '测试日志上传'}
                        </button>
                    )}
                </div>

                {/* 上传结果 */}
                {uploadResult && (
                    <div className={`p-2 rounded text-xs ${uploadResult.success ? 'bg-green-800' : 'bg-red-800'
                        }`}>
                        <div className="font-medium mb-1">
                            {uploadResult.success ? '✅ 上传成功' : '❌ 上传失败'}
                        </div>
                        <div className="text-xs opacity-80">
                            {uploadResult.message}
                        </div>
                        {uploadResult.success && (
                            <div className="text-xs opacity-80 mt-1">
                                上传文件: {uploadResult.uploadedCount}/{uploadResult.totalCount}
                            </div>
                        )}
                    </div>
                )}

                {/* 使用说明 */}
                <div className="text-xs opacity-60 border-t border-gray-600 pt-2">
                    <div>在控制台运行:</div>
                    <code className="block bg-gray-800 p-1 rounded mt-1">
                        enableBidlinkDebugMode()
                    </code>
                </div>
            </div>
        </div>
    );
}
