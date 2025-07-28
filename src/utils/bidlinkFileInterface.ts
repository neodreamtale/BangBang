/**
 * Bidlink应用专用文件操作接口
 * 用于在com.bidlink.cn应用的WebView中操作本地文件
 */

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

    return typeof (window as any).BidlinkInterface !== 'undefined' ||
        typeof (window as any).Android !== 'undefined' ||
        (window as any).isBidlinkApp === true;
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
            if (typeof (window as any).BidlinkInterface?.getCurrentUserId === 'function') {
                const userId = (window as any).BidlinkInterface.getCurrentUserId();
                resolve(userId || null);
            } else if (typeof (window as any).Android?.getCurrentUserId === 'function') {
                const userId = (window as any).Android.getCurrentUserId();
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
async function getUserLogFolderInfo(userId: string): Promise<{
    userId: string;
    folderPath: string;
    files: BidlinkFileInfo[];
    totalSize: number;
} | null> {
    return new Promise((resolve) => {
        try {
            if (typeof (window as any).BidlinkInterface?.getUserLogInfo === 'function') {
                const result = (window as any).BidlinkInterface.getUserLogInfo(userId);
                if (result) {
                    const logInfo = JSON.parse(result);
                    resolve(logInfo);
                    return;
                }
            } else if (typeof (window as any).Android?.getUserLogInfo === 'function') {
                const result = (window as any).Android.getUserLogInfo(userId);
                if (result) {
                    const logInfo = JSON.parse(result);
                    resolve(logInfo);
                    return;
                }
            }
            resolve(null);
        } catch (error) {
            console.error('Failed to get user log info:', error);
            resolve(null);
        }
    });
}

/**
 * 检查文件是否存在并获取文件信息
 */
async function checkFileExists(filePath: string): Promise<{ size: number, lastModified: number } | null> {
    return new Promise((resolve) => {
        try {
            if (typeof (window as any).BidlinkInterface?.getFileInfo === 'function') {
                const result = (window as any).BidlinkInterface.getFileInfo(filePath);
                if (result) {
                    const info = JSON.parse(result);
                    if (info.exists) {
                        resolve({
                            size: info.size || 0,
                            lastModified: info.lastModified || Date.now()
                        });
                        return;
                    }
                }
            } else if (typeof (window as any).Android?.getFileInfo === 'function') {
                const result = (window as any).Android.getFileInfo(filePath);
                if (result) {
                    const info = JSON.parse(result);
                    if (info.exists) {
                        resolve({
                            size: info.size || 0,
                            lastModified: info.lastModified || Date.now()
                        });
                        return;
                    }
                }
            }
            resolve(null);
        } catch (error) {
            resolve(null);
        }
    });
}/**
 * 读取Bidlink应用的特定缓存文件
 */
export async function readBidlinkCacheFile(filePath: string): Promise<BidlinkCacheFile> {
    if (!isBidlinkApp()) {
        throw new Error('Not running in Bidlink App');
    }

    return new Promise((resolve, reject) => {
        try {
            // 尝试调用原生接口
            if (typeof (window as any).BidlinkInterface?.readCacheFile === 'function') {
                const result = (window as any).BidlinkInterface.readCacheFile(filePath);
                resolve(JSON.parse(result));
            }
            // 备用接口  
            else if (typeof (window as any).Android?.readCacheFile === 'function') {
                const result = (window as any).Android.readCacheFile(filePath);
                resolve(JSON.parse(result));
            }
            else {
                reject(new Error('Bidlink file read interface not available'));
            }
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 上传缓存文件到服务器
 */
export async function uploadCacheFileToServer(file: BidlinkCacheFile, endpoint: string): Promise<any> {
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
        (typeof (window as any).BidlinkInterface !== 'undefined' ||
            typeof (window as any).Android !== 'undefined');
}

/**
 * 获取当前用户ID
 */
export async function getUserLogInfo(userId: string): Promise<{
    userId: string;
    logCount: number;
    totalSize: number;
    folderPath: string;
} | null> {
    return new Promise((resolve) => {
        try {
            if (typeof (window as any).BidlinkInterface?.getUserLogInfo === 'function') {
                const result = (window as any).BidlinkInterface.getUserLogInfo(userId);
                if (result) {
                    const logInfo = JSON.parse(result);
                    resolve(logInfo);
                    return;
                }
            } else if (typeof (window as any).Android?.getUserLogInfo === 'function') {
                const result = (window as any).Android.getUserLogInfo(userId);
                if (result) {
                    const logInfo = JSON.parse(result);
                    resolve(logInfo);
                    return;
                }
            }
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
export async function createUserLogZip(userId: string): Promise<string | null> {
    return new Promise((resolve) => {
        try {
            if (typeof (window as any).BidlinkInterface?.createUserLogZip === 'function') {
                const zipPath = (window as any).BidlinkInterface.createUserLogZip(userId);
                resolve(zipPath || null);
            } else if (typeof (window as any).Android?.createUserLogZip === 'function') {
                const zipPath = (window as any).Android.createUserLogZip(userId);
                resolve(zipPath || null);
            } else {
                resolve(null);
            }
        } catch (error) {
            console.error('Failed to create user log zip:', error);
            resolve(null);
        }
    });
}

/**
 * 清理用户的所有日志文件
 */
export async function cleanupUserLogs(userId: string): Promise<boolean> {
    return new Promise((resolve) => {
        try {
            if (typeof (window as any).BidlinkInterface?.cleanupUserLogs === 'function') {
                const result = (window as any).BidlinkInterface.cleanupUserLogs(userId);
                resolve(!!result);
            } else if (typeof (window as any).Android?.cleanupUserLogs === 'function') {
                const result = (window as any).Android.cleanupUserLogs(userId);
                resolve(!!result);
            } else {
                resolve(false);
            }
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
export async function getBidlinkAppInfo(): Promise<any> {
    if (!isBidlinkApp()) {
        return null;
    }

    return new Promise((resolve) => {
        try {
            if (typeof (window as any).BidlinkInterface?.getAppInfo === 'function') {
                const result = (window as any).BidlinkInterface.getAppInfo();
                resolve(JSON.parse(result));
            } else if (typeof (window as any).Android?.getAppInfo === 'function') {
                const result = (window as any).Android.getAppInfo();
                resolve(JSON.parse(result));
            } else {
                resolve({
                    packageName: 'com.bidlink.cn',
                    detected: true,
                    method: 'javascript_detection'
                });
            }
        } catch (error) {
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

    if ((window as any).MockAndroid) {
        delete (window as any).MockAndroid;
        delete (window as any).Android;
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
        mockInterfaceAvailable: typeof (window as any).MockAndroid !== 'undefined'
    };
}

/**
 * 设置模拟的 Android 接口（仅调试用）
 */
function setupMockAndroidInterface(): void {
    if (process.env.NODE_ENV !== 'development') return;

    const mockAndroid = {
        getCurrentUserId: () => 'debug_user_123',

        getUserLogInfo: (userId: string) => {
            return JSON.stringify({
                userId: userId,
                logCount: 3,
                totalSize: 1024 * 50, // 50KB
                folderPath: `/data/data/com.bidlink.cn/logs/${userId}`
            });
        },

        createUserLogZip: (userId: string) => {
            return `/data/data/com.bidlink.cn/cache/logs_${userId}_${Date.now()}.zip`;
        },

        readCacheFile: (filePath: string) => {
            // 模拟读取文件内容
            const mockContent = `Mock log content for ${filePath}\nTimestamp: ${new Date().toISOString()}\nUser: debug_user_123\nSample log data for testing...`;
            const base64Content = btoa(mockContent);

            return JSON.stringify({
                content: base64Content,
                encoding: 'base64',
                metadata: {
                    name: filePath.split('/').pop() || 'mock.zip',
                    path: filePath,
                    size: base64Content.length,
                    type: 'application/zip',
                    lastModified: Date.now()
                }
            });
        },

        cleanupUserLogs: (userId: string) => {
            console.log(`🗑️ Mock: 清理用户 ${userId} 的日志文件`);
            return true;
        },

        getAppInfo: () => {
            return JSON.stringify({
                packageName: 'com.bidlink.cn',
                versionName: '1.0.0',
                versionCode: 1,
                debugMode: true
            });
        }
    };

    (window as any).MockAndroid = mockAndroid;
    (window as any).Android = mockAndroid;

    console.log('🔧 模拟 Android 接口已设置', mockAndroid);
}

/**
 * 初始化全局调试命令（开发环境）
 */
export function initBidlinkDebugCommands(): void {
    if (process.env.NODE_ENV !== 'development') return;

    // 将调试函数挂载到全局 window 对象
    (window as any).enableDebugMode = enableDebugMode;
    (window as any).disableBidlinkDebugMode = disableBidlinkDebugMode;
    (window as any).getBidlinkDebugStatus = getBidlinkDebugStatus;
    (window as any).uploadAllExceptionLogs = uploadAllExceptionLogs;

    // 添加调试面板控制命令
    (window as any).showDebugPanel = () => {
        window.dispatchEvent(new CustomEvent('showDebugPanel'));
        console.log('🔧 显示 Bidlink 调试面板');
    };

    (window as any).hideDebugPanel = () => {
        window.dispatchEvent(new CustomEvent('hideDebugPanel'));
        console.log('🔧 隐藏 Bidlink 调试面板');
    };

    // 显示可用命令
    (window as any).bidlinkHelp = () => {
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