interface LoadingOverlayProps {
  isVisible: boolean
  title?: string
  progress?: number
  progressText?: string
  description?: string
}

export default function LoadingOverlay({
  isVisible,
  title = '正在处理',
  progress = 0,
  progressText,
  description = '请稍候，不要关闭页面...',
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center space-y-4">
          {/* 加载动画 */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          </div>

          {/* 进度信息 */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {title}
            </h3>
            {progressText && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {progressText}
              </p>
            )}

            {/* 进度条 */}
            {progress > 0 && (
              <>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {progress}% 完成
                </p>
              </>
            )}
          </div>

          {/* 提示信息 */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
