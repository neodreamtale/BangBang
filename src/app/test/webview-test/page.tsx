export default function WebViewTest() {
    return (
        <html>
            <head>
                <title>WebView CSS 测试</title>
                <style>{`
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        background-color: #f0f0f0;
                    }
                    .test-box {
                        background-color: #4CAF50;
                        color: white;
                        padding: 20px;
                        margin: 10px 0;
                        border-radius: 8px;
                    }
                    .inline-style {
                        background-color: #2196F3;
                        color: white;
                        padding: 15px;
                        margin: 10px 0;
                        border: 2px solid #0277BD;
                    }
                    .tailwind-test {
                        /* 这里会被 Tailwind 覆盖 */
                    }
                `}</style>
            </head>
            <body>
                <h1>WebView CSS 测试页面</h1>

                {/* 内联样式测试 */}
                <div style={{
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '20px',
                    margin: '10px 0',
                    borderRadius: '8px'
                }}>
                    ✅ 内联样式测试 - 如果看到红色背景说明内联样式工作
                </div>

                {/* CSS-in-JS 样式测试 */}
                <div className="test-box">
                    ✅ CSS-in-JS 测试 - 如果看到绿色背景说明 CSS-in-JS 工作
                </div>

                {/* Tailwind CSS 测试 */}
                <div className="bg-purple-500 text-white p-4 my-2 rounded tailwind-test">
                    ❓ Tailwind CSS 测试 - 如果看到紫色背景说明 Tailwind 工作
                </div>

                {/* 环境信息 */}
                <div className="inline-style">
                    <h3>环境信息：</h3>
                    <p>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR'}</p>
                    <p>当前URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
                    <p>是否WebView: {typeof navigator !== 'undefined' && /wv\)|android.*version/i.test(navigator.userAgent) ? 'Yes' : 'No'}</p>
                </div>

                {/* JavaScript 测试 */}
                <div style={{
                    backgroundColor: '#FF9800',
                    color: 'white',
                    padding: '15px',
                    margin: '10px 0'
                }}>
                    <p>JavaScript 测试: <span id="js-test">Loading...</span></p>
                </div>

                <script dangerouslySetInnerHTML={{
                    __html: `
                        document.getElementById('js-test').textContent = 'JavaScript 工作正常!';
                        console.log('WebView Test Page Loaded');
                        console.log('User Agent:', navigator.userAgent);
                    `
                }} />
            </body>
        </html>
    )
}
