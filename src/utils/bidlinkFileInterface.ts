/**
 * Bidlink应用专用文件操作接口
 * 用于在com.bidlink.cn应用的WebView中操作本地文件
 */

// 扩展 Window 接口
declare global {
  interface Window {
    // Bidlink 专用接口
    bidlinkSupport?: {
      getDeviceInfo?: () => Record<string, unknown>
      loadCrashLogs?: () => string | Promise<string>
      onCrashLogUploaded?: () => void
    }
    // Android WebView 接口
    android?: {
      getJid?: () => string
      getToken?: (userId: string) => string
    }
    // 调试相关
    MockAndroid?: Record<string, unknown>
  }
}

export interface ExceptLogFile {
  name: string
  path: string
  size: number
  type: string
  lastModified: number
}

// ====== 环境检测接口和功能 ======

export interface EnvironmentInfo {
  userAgent: string
  browser: string
  version: string
  os: string
  screen: string
  isWebView: boolean
  webViewType?: string
  appPackage?: string
  nativeInfo?: Record<string, unknown>
}

/**
 * 检查是否在Bidlink应用中
 */
export function isBidlinkApp(): boolean {
  // 服务器端渲染时返回 false
  if (typeof window === 'undefined') {
    return false
  }

  // 开发环境调试模式
  if (process.env.NODE_ENV === 'development') {
    // 检查是否设置了调试模式
    if (typeof localStorage !== 'undefined') {
      const debugMode = localStorage.getItem('bidlink-debug-mode')
      if (debugMode === 'true') {
        return true
      }
    }
  }

  return (
    typeof window.bidlinkSupport !== 'undefined' ||
    typeof window.android !== 'undefined'
  )
}

/**
 * 获取当前用户ID（同步版本）
 */
export function getUserId(): string | null {
  try {
    if (typeof window !== 'undefined' && window.android?.getJid) {
      const userId = window.android.getJid()
      if (userId && typeof userId === 'string') {
        console.log('获取到用户ID:', userId)
        return userId
      }
    }
    console.log('无法获取用户ID，android.getJid 不可用')
    return null
  } catch (error) {
    console.error('获取用户ID失败:', error)
    return null
  }
}

/**
 * 加载崩溃日志ZIP文件（base64格式）
 */
export async function loadExceptionLogZip(): Promise<string | null> {
  try {
    if (typeof window !== 'undefined' && window.bidlinkSupport) {
      if (window.bidlinkSupport.loadCrashLogs) {
        const base64Zip = await window.bidlinkSupport.loadCrashLogs()
        console.log('加载到的异常日志长度:', base64Zip?.length || 0)

        // 检查是否真的读取到了有效的文件内容
        if (
          base64Zip &&
          typeof base64Zip === 'string' &&
          base64Zip.trim().length > 0
        ) {
          console.log(
            base64Zip.length > 13 * 1024 * 1024
              ? '⚠️ 崩溃日志文件较大:'
              : '✅ 成功加载崩溃日志文件:',
            formatFileSize(base64Zip.length)
          )
          return base64Zip
        } else {
          console.log('⚠️ 未找到有效的崩溃日志文件')
          return null
        }
      }
    } else {
      console.log('未检测到 bidlinkSupport 接口')
    }
  } catch (error) {
    console.error('加载异常日志失败:', error)
  }
  return null
}

/**
 * 检查是否在 Bidlink WebView 环境中
 */
export function isBidlinkWebView(): boolean {
  return (
    isBidlinkApp() &&
    (typeof window.bidlinkSupport !== 'undefined' ||
      typeof window.android !== 'undefined')
  )
}

/**
 * 检测浏览器信息
 */
function detectBrowser(): { browser: string; version: string } {
  // 服务器端渲染时返回默认值
  if (typeof navigator === 'undefined') {
    return { browser: 'Unknown', version: 'Unknown' }
  }

  const userAgent = navigator.userAgent

  // Chrome
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    const match = userAgent.match(/Chrome\/(\d+)/)
    return { browser: 'Chrome', version: match ? match[1] : 'Unknown' }
  }

  // Edge
  if (userAgent.includes('Edg')) {
    const match = userAgent.match(/Edg\/(\d+)/)
    return { browser: 'Edge', version: match ? match[1] : 'Unknown' }
  }

  // Firefox
  if (userAgent.includes('Firefox')) {
    const match = userAgent.match(/Firefox\/(\d+)/)
    return { browser: 'Firefox', version: match ? match[1] : 'Unknown' }
  }

  // Safari
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    const match = userAgent.match(/Version\/(\d+)/)
    return { browser: 'Safari', version: match ? match[1] : 'Unknown' }
  }

  return { browser: 'Unknown', version: 'Unknown' }
}

/**
 * 检测操作系统
 */
function detectOS(): string {
  // 服务器端渲染时返回默认值
  if (typeof navigator === 'undefined') {
    return 'Unknown'
  }

  const userAgent = navigator.userAgent
  const platform = navigator.platform

  if (/Android/i.test(userAgent)) {
    const match = userAgent.match(/Android (\d+(?:\.\d+)?)/)
    return `Android ${match ? match[1] : 'Unknown'}`
  }

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    const match = userAgent.match(/OS (\d+(?:_\d+)?)/)
    const version = match ? match[1].replace('_', '.') : 'Unknown'
    return `iOS ${version}`
  }

  if (/Windows/i.test(userAgent)) {
    if (/Windows NT 10/i.test(userAgent)) return 'Windows 10/11'
    if (/Windows NT 6\.3/i.test(userAgent)) return 'Windows 8.1'
    if (/Windows NT 6\.2/i.test(userAgent)) return 'Windows 8'
    if (/Windows NT 6\.1/i.test(userAgent)) return 'Windows 7'
    return 'Windows'
  }

  if (/Mac/i.test(platform) || /Mac/i.test(userAgent)) {
    return 'macOS'
  }

  if (/Linux/i.test(platform)) {
    return 'Linux'
  }

  return 'Unknown'
}

/**
 * 检测是否在WebView中
 */
function detectWebView(): {
  isWebView: boolean
  webViewType?: string
  appPackage?: string
} {
  // 服务器端渲染时返回默认值
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { isWebView: false }
  }

  const userAgent = navigator.userAgent

  // 检测 Bidlink 应用
  if (/BidlinkApp/i.test(userAgent) || isBidlinkApp()) {
    return {
      isWebView: true,
      webViewType: 'Bidlink App WebView',
      appPackage: 'com.bidlink.cn',
    }
  }

  // Android WebView
  if (/wv\)/i.test(userAgent)) {
    return { isWebView: true, webViewType: 'Android WebView' }
  }

  // iOS WebView (非Safari)
  if (/iPhone|iPad|iPod/i.test(userAgent) && !/Safari/i.test(userAgent)) {
    return { isWebView: true, webViewType: 'iOS WebView' }
  }

  // 微信WebView
  if (/MicroMessenger/i.test(userAgent)) {
    return { isWebView: true, webViewType: 'WeChat WebView' }
  }

  // QQ WebView
  if (/QQ\//i.test(userAgent)) {
    return { isWebView: true, webViewType: 'QQ WebView' }
  }

  // 支付宝WebView
  if (/AlipayClient/i.test(userAgent)) {
    return { isWebView: true, webViewType: 'Alipay WebView' }
  }

  return { isWebView: false }
}

/**
 * 获取屏幕信息
 */
function getScreenInfo(): string {
  // 服务器端渲染时返回默认值
  if (typeof window === 'undefined') {
    return 'Unknown'
  }

  const screen = window.screen
  const devicePixelRatio = window.devicePixelRatio || 1

  return `${screen.width}x${screen.height} (${devicePixelRatio}x)`
}

/**
 * 尝试从原生应用获取额外信息
 */
function getNativeAppInfo(): Promise<Record<string, unknown>> {
  return new Promise(resolve => {
    let nativeInfo: Record<string, unknown> = {}

    try {
      // Bidlink 应用接口
      if (typeof window.bidlinkSupport !== 'undefined') {
        const bidlinkSupportInterface = window.bidlinkSupport
        if (typeof bidlinkSupportInterface.getDeviceInfo === 'function') {
          nativeInfo = {
            ...nativeInfo,
            bidlink: bidlinkSupportInterface.getDeviceInfo(),
          }
        }
      }
    } catch (error) {
      console.log('Native interface not available or error:', error)
    }
    // 设置超时，避免无限等待
    setTimeout(() => resolve(nativeInfo), 100)
  })
}

/**
 * 获取完整的环境信息
 */
export async function getEnvironmentInfo(): Promise<EnvironmentInfo> {
  // 服务器端渲染时返回默认值
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      userAgent: 'Unknown',
      browser: 'Unknown',
      version: 'Unknown',
      os: 'Unknown',
      screen: 'Unknown',
      isWebView: false,
    }
  }

  const { browser, version } = detectBrowser()
  const os = detectOS()
  const { isWebView, webViewType, appPackage } = detectWebView()
  const screen = getScreenInfo()

  // 尝试获取原生应用信息
  const nativeInfo = await getNativeAppInfo()

  const envInfo: EnvironmentInfo = {
    userAgent: navigator.userAgent,
    browser,
    version,
    os,
    screen,
    isWebView,
    webViewType,
    appPackage,
  }

  // 如果有原生信息，合并进去
  if (Object.keys(nativeInfo).length > 0) {
    envInfo.nativeInfo = nativeInfo
  }

  return envInfo
}

// ====== 调试工具函数 ======

/**
 * 启用调试模式（仅开发环境）
 */
export function enableDebugMode(): void {
  if (process.env.NODE_ENV === 'development') {
    localStorage.setItem('bidlink-debug-mode', 'true')
    console.log('🔧 Bidlink 调试模式已启用')

    // 模拟 Android 接口
    setupMockAndroidInterface()
  }
}

/**
 * 禁用调试模式
 */
export function disableBidlinkDebugMode(): void {
  localStorage.removeItem('bidlink-debug-mode')
  console.log('🔧 Bidlink 调试模式已禁用')

  if (window.MockAndroid) {
    delete window.MockAndroid
    delete window.android
  }
}

/**
 * 检查调试模式状态
 */
export function getBidlinkDebugStatus(): {
  isDebugMode: boolean
  isBidlinkDetected: boolean
  mockInterfaceAvailable: boolean
} {
  const isDebugMode =
    process.env.NODE_ENV === 'development' &&
    typeof localStorage !== 'undefined' &&
    localStorage.getItem('bidlink-debug-mode') === 'true'

  return {
    isDebugMode,
    isBidlinkDetected: isBidlinkApp(),
    mockInterfaceAvailable:
      typeof window !== 'undefined' &&
      typeof window.MockAndroid !== 'undefined',
  }
}

/**
 * 设置模拟的 Android 接口（仅调试用）
 */
function setupMockAndroidInterface(): void {
  if (process.env.NODE_ENV !== 'development') return

  const mockAndroid = {
    getJid: () => 'debug_user_123',
    getToken: (userId: string) => `mock_token_for_${userId}`,
  }

  const mockBidlinkSupport = {
    getDeviceInfo: () => ({ deviceModel: 'Mock Device', osVersion: 'Mock OS' }),
    loadCrashLogs: () =>
      Promise.resolve('UEsDBAoAAAAAAAECA...mock_base64_zip_content'),
    onCrashLogUploaded: () => console.log('Mock: 崩溃日志上传回调'),
    getUserId: () => 'debug_user_123',
    getJid: () => 'debug_user_123',
    userInfo: {
      userId: 'debug_user_123',
      userName: 'Debug User',
    },
  }

  window.MockAndroid = mockAndroid
  window.android = mockAndroid
  window.bidlinkSupport = mockBidlinkSupport

  console.log('🔧 模拟接口已设置:')
  console.log('- window.android:', mockAndroid)
  console.log('- window.bidlinkSupport:', mockBidlinkSupport)
}

/**
 * 初始化全局调试命令（开发环境）
 */
export function initBidlinkDebugCommands(): void {
  if (process.env.NODE_ENV !== 'development') return

  // 扩展 window 对象的类型
  interface GlobalWindow extends Window {
    enableDebugMode?: typeof enableDebugMode
    disableBidlinkDebugMode?: typeof disableBidlinkDebugMode
    getBidlinkDebugStatus?: typeof getBidlinkDebugStatus
    showDebugPanel?: () => void
    hideDebugPanel?: () => void
    bidlinkHelp?: () => void
  }

  const globalWindow = window as unknown as GlobalWindow

  // 将调试函数挂载到全局 window 对象
  globalWindow.enableDebugMode = enableDebugMode
  globalWindow.disableBidlinkDebugMode = disableBidlinkDebugMode
  globalWindow.getBidlinkDebugStatus = getBidlinkDebugStatus

  // 添加调试面板控制命令
  globalWindow.showDebugPanel = () => {
    window.dispatchEvent(new CustomEvent('showDebugPanel'))
    console.log('🔧 显示 Bidlink 调试面板')
  }

  globalWindow.hideDebugPanel = () => {
    window.dispatchEvent(new CustomEvent('hideDebugPanel'))
    console.log('🔧 隐藏 Bidlink 调试面板')
  }

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
        `)
  }

  console.log(`
🔧 Bidlink 调试命令已初始化！

快速开始:
  showDebugPanel()   - 显示/隐藏调试面板
  enableDebugMode()    - 启用调试模式
  bidlinkHelp()              - 查看所有命令

在任何页面的控制台中运行上述命令即可使用调试功能。
    `)
}

// ====== 文件工具函数 ======

/**
 * 格式化文件大小显示
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
