'use client'

import { useEffect } from 'react';
import { initBidlinkDebugCommands } from '@/utils/bidlinkFileInterface';

export default function DebugInitializer() {
    useEffect(() => {
        // 只在开发环境初始化调试命令
        if (process.env.NODE_ENV === 'development') {
            initBidlinkDebugCommands();
        }
    }, []);

    return null; // 不渲染任何内容
}
