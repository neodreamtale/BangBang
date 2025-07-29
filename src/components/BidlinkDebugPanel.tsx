import React, { useState, useEffect } from 'react';
import {
    enableDebugMode,
    disableBidlinkDebugMode,
    getBidlinkDebugStatus,
} from '@/utils/bidlinkFileInterface';

export default function BidlinkDebugPanel() {
    const [debugStatus, setDebugStatus] = useState(getBidlinkDebugStatus());
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setDebugStatus(getBidlinkDebugStatus());
        }, 1000);

        // 监听全局显示/隐藏事件
        const handleShowPanel = () => setIsVisible(true);
        const handleHidePanel = () => setIsVisible(false);
        const handleTogglePanel = () => setIsVisible(prev => !prev);

        window.addEventListener('showDebugPanel', handleShowPanel);
        window.addEventListener('hideDebugPanel', handleHidePanel);
        window.addEventListener('showDebugPanel', handleTogglePanel);

        // 将控制函数挂载到全局对象
        (window as any).showDebugPanel = () => {
            setIsVisible(true);
            console.log('🔧 Bidlink 调试面板已显示');
        };
        (window as any).hideDebugPanel = () => {
            setIsVisible(false);
            console.log('🔧 Bidlink 调试面板已隐藏');
        };
        (window as any).showDebugPanel = () => {
            setIsVisible(prev => {
                const newState = !prev;
                console.log(`🔧 Bidlink 调试面板已${newState ? '显示' : '隐藏'}`);
                return newState;
            });
        };

        return () => {
            clearInterval(interval);
            window.removeEventListener('showDebugPanel', handleShowPanel);
            window.removeEventListener('hideDebugPanel', handleHidePanel);
            window.removeEventListener('showDebugPanel', handleTogglePanel);
        };
    }, []);

    const handleToggleDebugMode = () => {
        if (debugStatus.isDebugMode) {
            disableBidlinkDebugMode();
        } else {
            enableDebugMode();
        }
        setDebugStatus(getBidlinkDebugStatus());
    };

    // 只在开发环境显示
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    // 不可见时不渲染
    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
            <div className="flex justify-between items-center mb-3 border-b border-gray-600 pb-2">
                <div className="text-sm font-bold">
                    🔧 Bidlink 调试面板
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-white text-lg leading-none"
                    title="关闭面板"
                >
                    ×
                </button>
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
                    <div>控制台命令:</div>
                    <code className="block bg-gray-800 p-1 rounded mt-1">
                        showDebugPanel()
                    </code>
                    <code className="block bg-gray-800 p-1 rounded mt-1">
                        enableDebugMode()
                    </code>
                </div>
            </div>
        </div>
    );
}
