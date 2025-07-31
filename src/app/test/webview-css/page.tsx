export default function WebViewCSS() {
    return (
        <html>
            <head>
                <title>WebView CSS 内嵌测试</title>
                <style>{`
                    /* 直接内嵌 Tailwind 样式定义 */
                    .bg-red-500 { background-color: #ef4444; }
                    .bg-blue-500 { background-color: #3b82f6; }
                    .bg-green-500 { background-color: #10b981; }
                    .bg-purple-500 { background-color: #8b5cf6; }
                    .bg-yellow-500 { background-color: #eab308; }
                    
                    .text-white { color: #ffffff; }
                    .text-black { color: #000000; }
                    .text-red-500 { color: #ef4444; }
                    .text-blue-500 { color: #3b82f6; }
                    .text-green-500 { color: #10b981; }
                    .text-purple-500 { color: #8b5cf6; }
                    
                    .p-4 { padding: 1rem; }
                    .p-8 { padding: 2rem; }
                    .mb-2 { margin-bottom: 0.5rem; }
                    .mb-4 { margin-bottom: 1rem; }
                    .mb-8 { margin-bottom: 2rem; }
                    
                    .text-xl { font-size: 1.25rem; }
                    .text-3xl { font-size: 1.875rem; }
                    .font-bold { font-weight: 700; }
                    .font-semibold { font-weight: 600; }
                    
                    .border-2 { border-width: 2px; }
                    .border-red-500 { border-color: #ef4444; }
                    .rounded { border-radius: 0.25rem; }
                    
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 16px;
                        background-color: #f9fafb;
                    }
                `}</style>
            </head>
            <body>
                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-8">WebView CSS 内嵌测试</h1>

                    {/* 对比测试：内联样式 vs 内嵌CSS类 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">对比测试</h2>

                        <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '16px', marginBottom: '8px' }}>
                            ✅ 内联样式红色背景 (应该有效)
                        </div>

                        <div className="bg-red-500 text-white p-4 mb-2">
                            ❓ 内嵌CSS类红色背景 (测试是否有效)
                        </div>
                    </section>

                    {/* 完整颜色测试 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">颜色测试</h2>

                        <div className="bg-red-500 text-white p-4 mb-2">
                            红色背景 (bg-red-500) - #ef4444
                        </div>

                        <div className="bg-blue-500 text-white p-4 mb-2">
                            蓝色背景 (bg-blue-500) - #3b82f6
                        </div>

                        <div className="bg-green-500 text-white p-4 mb-2">
                            绿色背景 (bg-green-500) - #10b981
                        </div>

                        <div className="bg-purple-500 text-white p-4 mb-2">
                            紫色背景 (bg-purple-500) - #8b5cf6
                        </div>

                        <div className="bg-yellow-500 text-black p-4 mb-2">
                            黄色背景 (bg-yellow-500) - #eab308
                        </div>
                    </section>

                    {/* 文字颜色测试 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">文字颜色测试</h2>

                        <p className="text-red-500 mb-2">红色文字 (text-red-500)</p>
                        <p className="text-blue-500 mb-2">蓝色文字 (text-blue-500)</p>
                        <p className="text-green-500 mb-2">绿色文字 (text-green-500)</p>
                        <p className="text-purple-500 mb-2">紫色文字 (text-purple-500)</p>
                    </section>

                    {/* 边框测试 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">边框测试</h2>

                        <div className="border-2 border-red-500 p-4 mb-2">
                            红色边框测试
                        </div>
                    </section>

                    {/* 环境信息 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">环境信息</h2>
                        <div style={{ backgroundColor: '#e5e7eb', padding: '16px', borderRadius: '8px' }}>
                            <p><strong>User Agent:</strong> <span id="user-agent">Loading...</span></p>
                            <p><strong>是否 WebView:</strong> <span id="is-webview">检测中...</span></p>
                            <p><strong>CSS 加载状态:</strong> 如果看到颜色说明内嵌CSS生效</p>
                        </div>
                    </section>
                </div>

                <script dangerouslySetInnerHTML={{
                    __html: `
                        document.getElementById('user-agent').textContent = navigator.userAgent;
                        const isWebView = /wv\\)|android.*version/i.test(navigator.userAgent);
                        document.getElementById('is-webview').textContent = isWebView ? 'Yes' : 'No';
                        console.log('WebView 内嵌CSS测试页面已加载');
                        console.log('User Agent:', navigator.userAgent);
                        console.log('是否 WebView:', isWebView);
                    `
                }} />
            </body>
        </html>
    )
}
