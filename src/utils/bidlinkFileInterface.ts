/**
 * Bidlink应用专用文件操作接口
 * 用于在com.bidlink.cn应用的WebView中操作本地文件
 */

// 扩展 Window 接口
declare global {
    interface Window {
        // Bidlink 专用接口
        bidlinkSupport?: {
            getDeviceInfo?: () => Record<string, unknown>;
            loadCrashLogs?: () => string;
        };
        // Android WebView 接口
        android?: {
            getJid?: () => string;
            getToken?: (userId: string) => string;
        };
        // 调试相关
        MockAndroid?: Record<string, unknown>;
    }
}

export interface BidlinkFileInfo {
    name: string;
    path: string;
    size: number;
    type: string;
    lastModified: number;
}

export interface BidlinkCacheFile {
    content: string;
    encoding: 'base64' | 'utf8';
    metadata: BidlinkFileInfo;
}

/**
 * 检查是否在Bidlink应用中
 */
export function isBidlinkApp(): boolean {
    // 开发环境调试模式
    if (process.env.NODE_ENV === 'development') {
        // 检查是否设置了调试模式
        const debugMode = localStorage.getItem('bidlink-debug-mode');
        if (debugMode === 'true') {
            return true;
        }
    }

    return typeof window.bidlinkSupport !== 'undefined' ||
        typeof window.android !== 'undefined';
}

/**
 * 自动获取Bidlink应用的异常日志文件（按用户ID组织）
 */
export async function getBidlinkExceptionLogs(): Promise<BidlinkFileInfo[]> {
    if (!isBidlinkApp()) {
        return [];
    }

    try {
        // 首先获取当前用户ID
        const userId = await getCurrentUserId();
        if (!userId) {
            console.warn('无法获取用户ID，跳过日志检测');
            return [];
        }

        // 获取用户日志文件夹信息
        const userLogInfo = await getUserLogFolderInfo(userId);
        return userLogInfo?.files || [];

    } catch (error) {
        console.error('Failed to get exception logs:', error);
        return [];
    }
}

/**
 * 获取当前用户ID
 */
async function getCurrentUserId(): Promise<string | null> {
    return new Promise((resolve) => {
        try {
            // 使用 android.getJid() 获取用户ID
            if (typeof window.android?.getJid === 'function') {
                const userId = window.android.getJid();
                resolve(userId || null);
            } else {
                resolve(null);
            }
        } catch (error) {
            console.error('Failed to get user ID:', error);
            resolve(null);
        }
    });
}

/**
 * 获取用户日志文件夹信息
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getUserLogFolderInfo(_userId: string): Promise<{
    userId: string;
    folderPath: string;
    files: BidlinkFileInfo[];
    totalSize: number;
} | null> {
    return new Promise((resolve) => {
        try {
            // Android interface methods have been removed
            // This function now returns null
            resolve(null);
        } catch (error) {
            console.error('Failed to get user log info:', error);
            resolve(null);
        }
    });
}



/**
 * 读取Bidlink应用的特定缓存文件
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function readBidlinkCacheFile(_filePath: string): Promise<BidlinkCacheFile> {
    if (!isBidlinkApp()) {
        throw new Error('Not running in Bidlink App');
    }
    return new Promise((resolve, reject) => {
        try {
            reject(new Error('Bidlink file read interface not available'));
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 上传缓存文件到服务器
 */
export async function uploadCacheFileToServer(file: BidlinkCacheFile, endpoint: string): Promise<{
    success: boolean;
    message?: string;
}> {
    const formData = new FormData();

    // 将base64内容转换为Blob
    let blob: Blob;
    if (file.encoding === 'base64') {
        const binaryString = atob(file.content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        blob = new Blob([bytes], { type: file.metadata.type });
    } else {
        blob = new Blob([file.content], { type: file.metadata.type || 'text/plain' });
    }

    formData.append('file', blob, file.metadata.name);
    formData.append('metadata', JSON.stringify(file.metadata));

    const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
}

/**
 * 获取常见的缓存文件类型
 */
export function getCommonCacheFileTypes(): string[] {
    return [
        'log', 'txt', 'json', 'xml', 'crash', 'dump',
        'db', 'sqlite', 'cache', 'tmp', 'temp'
    ];
}

/**
 * 检查是否在 Bidlink WebView 环境中
 */
export function isBidlinkWebView(): boolean {
    return isBidlinkApp() &&
        (typeof window.bidlinkSupport !== 'undefined' ||
            typeof window.android !== 'undefined');
}

/**
 * 获取当前用户ID
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getUserLogInfo(_userId: string): Promise<{
    userId: string;
    logCount: number;
    totalSize: number;
    folderPath: string;
} | null> {
    return new Promise((resolve) => {
        try {
            // Android interface methods have been removed
            // This function now returns null
            resolve(null);
        } catch (error) {
            console.error('Failed to get user log info:', error);
            resolve(null);
        }
    });
}

/**
 * 创建用户日志的ZIP文件
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createUserLogZip(_userId: string): Promise<string | null> {
    return new Promise((resolve) => {
        try {
            // Android interface methods have been removed
            // This function now returns null
            resolve(null);
        } catch (error) {
            console.error('Failed to create user log zip:', error);
            resolve(null);
        }
    });
}

/**
 * 清理用户的所有日志文件
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function cleanupUserLogs(_userId: string): Promise<boolean> {
    return new Promise((resolve) => {
        try {
            // Android interface methods have been removed
            // This function now returns false
            resolve(false);
        } catch (error) {
            console.error('Failed to cleanup user logs:', error);
            resolve(false);
        }
    });
}

/**
 * 自动上传所有异常日志文件（以ZIP格式）
 */
export async function uploadAllExceptionLogs(): Promise<{
    success: boolean;
    message: string;
    uploadedCount: number;
    totalCount: number;
}> {
    try {
        // 检查是否在 Bidlink WebView 环境
        if (!isBidlinkWebView()) {
            return {
                success: false,
                message: '当前环境不支持文件操作',
                uploadedCount: 0,
                totalCount: 0
            };
        }

        // 获取当前用户ID
        const userId = await getCurrentUserId();
        if (!userId) {
            return {
                success: false,
                message: '无法获取用户ID',
                uploadedCount: 0,
                totalCount: 0
            };
        }

        // 获取用户的异常日志信息
        const userLogInfo = await getUserLogInfo(userId);
        if (!userLogInfo || userLogInfo.logCount === 0) {
            return {
                success: true,
                message: '未发现异常日志文件',
                uploadedCount: 0,
                totalCount: 0
            };
        }

        // 创建并获取ZIP文件
        const zipFilePath = await createUserLogZip(userId);
        if (!zipFilePath) {
            return {
                success: false,
                message: '创建ZIP文件失败',
                uploadedCount: 0,
                totalCount: userLogInfo.logCount
            };
        }

        // 读取ZIP文件内容
        const zipContent = await readBidlinkCacheFile(zipFilePath);

        // 为ZIP文件添加元数据
        const enrichedZipContent: BidlinkCacheFile = {
            ...zipContent,
            metadata: {
                ...zipContent.metadata,
                name: `user_${userId}_logs_${Date.now()}.zip`
            }
        };

        // 上传ZIP文件
        const uploadResult = await uploadCacheFileToServer(enrichedZipContent, '/api/upload-exception-log-zip');

        if (uploadResult.success) {
            // 上传成功，删除本地所有相关日志
            await cleanupUserLogs(userId);

            return {
                success: true,
                message: `成功上传 ${userLogInfo.logCount} 个异常日志文件（ZIP格式）`,
                uploadedCount: userLogInfo.logCount,
                totalCount: userLogInfo.logCount
            };
        } else {
            return {
                success: false,
                message: `上传失败: ${uploadResult.message}`,
                uploadedCount: 0,
                totalCount: userLogInfo.logCount
            };
        }

    } catch (error) {
        return {
            success: false,
            message: `获取异常日志失败: ${error instanceof Error ? error.message : 'Unknown error'}`,
            uploadedCount: 0,
            totalCount: 0
        };
    }
}/**
 * 获取应用信息（如果可用）
 */
export async function getBidlinkAppInfo(): Promise<{
    packageName?: string;
    versionName?: string;
    versionCode?: number;
    detected: boolean;
    method?: string;
    debugMode?: boolean;
} | null> {
    if (!isBidlinkApp()) {
        return null;
    }

    return new Promise((resolve) => {
        try {
            // Android interface methods have been removed
            // Return basic information
            resolve({
                packageName: 'com.bidlink.cn',
                detected: true,
                method: 'javascript_detection'
            });
        } catch {
            resolve(null);
        }
    });
}

// ====== 调试工具函数 ======

/**
 * 启用调试模式（仅开发环境）
 */
export function enableDebugMode(): void {
    if (process.env.NODE_ENV === 'development') {
        localStorage.setItem('bidlink-debug-mode', 'true');
        console.log('🔧 Bidlink 调试模式已启用');

        // 模拟 Android 接口
        setupMockAndroidInterface();
    }
}

/**
 * 禁用调试模式
 */
export function disableBidlinkDebugMode(): void {
    localStorage.removeItem('bidlink-debug-mode');
    console.log('🔧 Bidlink 调试模式已禁用');

    if (window.MockAndroid) {
        delete window.MockAndroid;
        delete window.android;
    }
}

/**
 * 检查调试模式状态
 */
export function getBidlinkDebugStatus(): {
    isDebugMode: boolean;
    isBidlinkDetected: boolean;
    mockInterfaceAvailable: boolean;
} {
    const isDebugMode = process.env.NODE_ENV === 'development' &&
        localStorage.getItem('bidlink-debug-mode') === 'true';

    return {
        isDebugMode,
        isBidlinkDetected: isBidlinkApp(),
        mockInterfaceAvailable: typeof window.MockAndroid !== 'undefined'
    };
}

/**
 * 设置模拟的 Android 接口（仅调试用）
 */
function setupMockAndroidInterface(): void {
    if (process.env.NODE_ENV !== 'development') return;

    const mockAndroid = {
        getJid: () => 'debug_user_123',
        getToken: (userId: string) => `mock_token_for_${userId}`
    };

    window.MockAndroid = mockAndroid;
    window.android = mockAndroid;

    console.log('🔧 模拟 Android 接口已设置', mockAndroid);
}

/**
 * 初始化全局调试命令（开发环境）
 */
export function initBidlinkDebugCommands(): void {
    if (process.env.NODE_ENV !== 'development') return;

    // 扩展 window 对象的类型
    interface GlobalWindow extends Window {
        enableDebugMode?: typeof enableDebugMode;
        disableBidlinkDebugMode?: typeof disableBidlinkDebugMode;
        getBidlinkDebugStatus?: typeof getBidlinkDebugStatus;
        uploadAllExceptionLogs?: typeof uploadAllExceptionLogs;
        showDebugPanel?: () => void;
        hideDebugPanel?: () => void;
        bidlinkHelp?: () => void;
    }

    const globalWindow = window as unknown as GlobalWindow;

    // 将调试函数挂载到全局 window 对象
    globalWindow.enableDebugMode = enableDebugMode;
    globalWindow.disableBidlinkDebugMode = disableBidlinkDebugMode;
    globalWindow.getBidlinkDebugStatus = getBidlinkDebugStatus;
    globalWindow.uploadAllExceptionLogs = uploadAllExceptionLogs;

    // 添加调试面板控制命令
    globalWindow.showDebugPanel = () => {
        window.dispatchEvent(new CustomEvent('showDebugPanel'));
        console.log('🔧 显示 Bidlink 调试面板');
    };

    globalWindow.hideDebugPanel = () => {
        window.dispatchEvent(new CustomEvent('hideDebugPanel'));
        console.log('🔧 隐藏 Bidlink 调试面板');
    };

    // 显示可用命令
    globalWindow.bidlinkHelp = () => {
        console.log(`
🔧 Bidlink 调试命令:

面板控制:
  showDebugPanel()     - 显示调试面板
  hideDebugPanel()     - 隐藏调试面板  

调试模式:
  enableDebugMode()    - 启用调试模式
  disableBidlinkDebugMode()   - 禁用调试模式
  getBidlinkDebugStatus()     - 获取调试状态
  
帮助:
  bidlinkHelp()              - 显示此帮助信息
        `);
    };

    console.log(`
🔧 Bidlink 调试命令已初始化！

快速开始:
  showDebugPanel()   - 显示/隐藏调试面板
  enableDebugMode()    - 启用调试模式
  bidlinkHelp()              - 查看所有命令

在任何页面的控制台中运行上述命令即可使用调试功能。
    `);
}