interface EnvironmentInfo {
    userAgent: string;
    browser: string;
    version: string;
    os: string;
    screen: string;
    isWebView: boolean;
    webViewType?: string;
    appPackage?: string;
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
function detectWebView(): { isWebView: boolean; webViewType?: string; appPackage?: string } {
    const userAgent = navigator.userAgent;

    // 检测您的应用 com.bidlink.cn
    if (/BidlinkApp/i.test(userAgent) || checkBidlinkApp()) {
        return {
            isWebView: true,
            webViewType: 'Bidlink App WebView',
            appPackage: 'com.bidlink.cn'
        };
    }

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
 * 检测是否在Bidlink应用中
 */
function checkBidlinkApp(): boolean {
    // 检查是否有 bidlinkSupport 接口
    return typeof window.bidlinkSupport !== 'undefined';
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
 * 获取完整的环境信息
 */
export async function getEnvironmentInfo(): Promise<EnvironmentInfo> {
    const { browser, version } = detectBrowser();
    const os = detectOS();
    const { isWebView, webViewType, appPackage } = detectWebView();
    const screen = getScreenInfo();

    const envInfo: EnvironmentInfo = {
        userAgent: navigator.userAgent,
        browser,
        version,
        os,
        screen,
        isWebView,
        webViewType,
        appPackage
    };

    return envInfo;
}


