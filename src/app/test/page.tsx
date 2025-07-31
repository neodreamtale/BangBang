export default function TestIndex() {
    const tests = [
        {
            name: 'CSS 调试页面',
            path: '/test/css-debug',
            description: '测试 Tailwind CSS 颜色类在 WebView 中的加载情况'
        },
        {
            name: 'WebView CSS 内嵌测试',
            path: '/test/webview-css',
            description: '使用页面内嵌 CSS 定义来绕过 WebView 跨域限制'
        },
        {
            name: 'WebView 兼容性测试',
            path: '/test/webview-test',
            description: '对比内联样式、CSS-in-JS 和 Tailwind CSS 的兼容性'
        }
    ];

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">测试页面索引</h1>

                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {tests.map((test, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <h2 className="text-xl font-semibold mb-3 text-gray-800">
                                {test.name}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {test.description}
                            </p>
                            <div className="flex gap-3">
                                <a
                                    href={test.path}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    访问测试页面
                                </a>
                                <a
                                    href={test.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    新窗口打开
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h2 className="text-lg font-semibold mb-3 text-blue-900">使用说明</h2>
                    <ul className="text-blue-800 space-y-2">
                        <li>• <strong>桌面浏览器测试:</strong> 直接点击上面的链接访问</li>
                        <li>• <strong>手机浏览器测试:</strong> 访问 <code className="bg-blue-100 px-2 py-1 rounded">http://172.30.16.95:3001/test</code></li>
                        <li>• <strong>WebView 测试:</strong> 在 App 的 WebView 中打开相同地址</li>
                        <li>• <strong>对比测试:</strong> 观察不同环境下样式的表现差异</li>
                    </ul>
                </div>

                <div className="mt-8 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                    <h2 className="text-lg font-semibold mb-3 text-yellow-900">测试重点</h2>
                    <div className="text-yellow-800 space-y-2">
                        <p><strong>CSS 调试页面:</strong> 检查 Tailwind 颜色类是否正常显示</p>
                        <p><strong>WebView CSS 内嵌测试:</strong> 验证内嵌样式是否能绕过跨域限制</p>
                        <p><strong>WebView 兼容性测试:</strong> 对比三种样式方法的兼容性</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
