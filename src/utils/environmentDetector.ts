/**
 * 环境信息检测工具
 */

interface EnvironmentInfo {
    userAgent: string;
    browser: string;
    version: string;
    os: string;
    platform: string;
    screen: string;
    language: string;
    timezone: string;
    isWebView: boolean;
    webViewType?: string;
}

/**
 * 检测浏览器信息
 */
function detectBrowser(): { browser: string; version: string } {
    const userAgent = navigator.userAgent;

    // Chrome
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        const match = userAgent.match(/Chrome\/(\d+)/);
        return { browser: 'Chrome', version: match ? match[1] : 'Unknown' };
    }

    // Edge
    if (userAgent.includes('Edg')) {
        const match = userAgent.match(/Edg\/(\d+)/);
        return { browser: 'Edge', version: match ? match[1] : 'Unknown' };
    }

    // Firefox
    if (userAgent.includes('Firefox')) {
        const match = userAgent.match(/Firefox\/(\d+)/);
        return { browser: 'Firefox', version: match ? match[1] : 'Unknown' };
    }

    // Safari
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        const match = userAgent.match(/Version\/(\d+)/);
        return { browser: 'Safari', version: match ? match[1] : 'Unknown' };
    }

    return { browser: 'Unknown', version: 'Unknown' };
}

/**
 * 检测操作系统
 */
function detectOS(): string {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    if (/Android/i.test(userAgent)) {
        const match = userAgent.match(/Android (\d+(?:\.\d+)?)/);
        return `Android ${match ? match[1] : 'Unknown'}`;
    }

    if (/iPhone|iPad|iPod/i.test(userAgent)) {
        const match = userAgent.match(/OS (\d+(?:_\d+)?)/);
        const version = match ? match[1].replace('_', '.') : 'Unknown';
        return `iOS ${version}`;
    }

    if (/Windows/i.test(userAgent)) {
        if (/Windows NT 10/i.test(userAgent)) return 'Windows 10/11';
        if (/Windows NT 6\.3/i.test(userAgent)) return 'Windows 8.1';
        if (/Windows NT 6\.2/i.test(userAgent)) return 'Windows 8';
        if (/Windows NT 6\.1/i.test(userAgent)) return 'Windows 7';
        return 'Windows';
    }

    if (/Mac/i.test(platform) || /Mac/i.test(userAgent)) {
        return 'macOS';
    }

    if (/Linux/i.test(platform)) {
        return 'Linux';
    }

    return 'Unknown';
}

/**
 * 检测是否在WebView中
 */
function detectWebView(): { isWebView: boolean; webViewType?: string } {
    const userAgent = navigator.userAgent;

    // Android WebView
    if (/wv\)/i.test(userAgent)) {
        return { isWebView: true, webViewType: 'Android WebView' };
    }

    // iOS WebView (非Safari)
    if (/iPhone|iPad|iPod/i.test(userAgent) && !/Safari/i.test(userAgent)) {
        return { isWebView: true, webViewType: 'iOS WebView' };
    }

    // 微信WebView
    if (/MicroMessenger/i.test(userAgent)) {
        return { isWebView: true, webViewType: 'WeChat WebView' };
    }

    // QQ WebView
    if (/QQ\//i.test(userAgent)) {
        return { isWebView: true, webViewType: 'QQ WebView' };
    }

    // 支付宝WebView
    if (/AlipayClient/i.test(userAgent)) {
        return { isWebView: true, webViewType: 'Alipay WebView' };
    }

    return { isWebView: false };
}

/**
 * 获取屏幕信息
 */
function getScreenInfo(): string {
    const screen = window.screen;
    const devicePixelRatio = window.devicePixelRatio || 1;

    return `${screen.width}x${screen.height} (${devicePixelRatio}x)`;
}

/**
 * 尝试从原生应用获取额外信息
 * 这些方法需要原生应用注入相应的JavaScript接口
 */
function getNativeAppInfo(): Promise<any> {
    return new Promise((resolve) => {
        // 检查是否有原生应用注入的接口
        const nativeInterfaces = [
            'AndroidInterface',  // 安卓原生接口
            'webkit.messageHandlers.iosInterface',  // iOS原生接口
            'window.ReactNativeWebView',  // React Native WebView
            'window.flutter_inappwebview'  // Flutter WebView
        ];

        let nativeInfo = {};

        // 尝试调用原生接口获取更详细信息
        try {
            // 安卓接口示例
            if (typeof (window as any).AndroidInterface !== 'undefined') {
                const androidInterface = (window as any).AndroidInterface;
                if (typeof androidInterface.getDeviceInfo === 'function') {
                    nativeInfo = {
                        ...nativeInfo,
                        android: androidInterface.getDeviceInfo()
                    };
                }
            }

            // iOS接口示例
            if (typeof (window as any).webkit?.messageHandlers?.iosInterface !== 'undefined') {
                // iOS通常通过消息传递，这里是示例
                (window as any).webkit.messageHandlers.iosInterface.postMessage({
                    action: 'getDeviceInfo'
                });
            }

        } catch (error) {
            console.log('Native interface not available or error:', error);
        }

        // 设置超时，避免无限等待
        setTimeout(() => resolve(nativeInfo), 100);
    });
}

/**
 * 获取完整的环境信息
 */
export async function getEnvironmentInfo(): Promise<EnvironmentInfo> {
    const { browser, version } = detectBrowser();
    const os = detectOS();
    const { isWebView, webViewType } = detectWebView();
    const screen = getScreenInfo();

    // 尝试获取原生应用信息
    const nativeInfo = await getNativeAppInfo();

    const envInfo: EnvironmentInfo = {
        userAgent: navigator.userAgent,
        browser,
        version,
        os,
        platform: navigator.platform,
        screen,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isWebView,
        webViewType
    };

    // 如果有原生信息，合并进去
    if (Object.keys(nativeInfo).length > 0) {
        (envInfo as any).nativeInfo = nativeInfo;
    }

    return envInfo;
}

/**
 * 格式化环境信息为用户友好的字符串
 */
export function formatEnvironmentInfo(envInfo: EnvironmentInfo): string {
    const parts = [
        `${envInfo.browser} ${envInfo.version}`,
        envInfo.os,
        `屏幕: ${envInfo.screen}`,
        `语言: ${envInfo.language}`,
        `时区: ${envInfo.timezone}`
    ];

    if (envInfo.isWebView && envInfo.webViewType) {
        parts.push(`WebView: ${envInfo.webViewType}`);
    }

    return parts.join(' | ');
}

/**
 * 获取格式化的环境信息字符串
 */
export async function getFormattedEnvironmentInfo(): Promise<string> {
    const envInfo = await getEnvironmentInfo();
    return formatEnvironmentInfo(envInfo);
}
