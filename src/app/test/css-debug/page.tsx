export default function CSSDebug() {
    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8">CSS 调试页面</h1>

            {/* 基础颜色测试 */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">基础颜色测试</h2>

                <div className="bg-red-500 text-white p-4 mb-2">
                    红色背景 (bg-red-500)
                </div>

                <div className="bg-blue-500 text-white p-4 mb-2">
                    蓝色背景 (bg-blue-500)
                </div>

                <div className="bg-green-500 text-white p-4 mb-2">
                    绿色背景 (bg-green-500)
                </div>

                <div className="bg-purple-500 text-white p-4 mb-2">
                    紫色背景 (bg-purple-500)
                </div>

                <div className="bg-yellow-500 text-black p-4 mb-2">
                    黄色背景 (bg-yellow-500)
                </div>
            </section>

            {/* 文字颜色测试 */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">文字颜色测试</h2>

                <p className="text-red-500 text-lg mb-2">红色文字 (text-red-500)</p>
                <p className="text-blue-500 text-lg mb-2">蓝色文字 (text-blue-500)</p>
                <p className="text-green-500 text-lg mb-2">绿色文字 (text-green-500)</p>
                <p className="text-purple-500 text-lg mb-2">紫色文字 (text-purple-500)</p>
            </section>

            {/* 边框和阴影测试 */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">边框和效果测试</h2>

                <div className="border-2 border-red-500 p-4 mb-2">
                    红色边框 (border-red-500)
                </div>

                <div className="shadow-lg bg-white p-4 mb-2">
                    阴影效果 (shadow-lg)
                </div>

                <div className="rounded-lg bg-blue-100 p-4 mb-2">
                    圆角和浅色背景 (rounded-lg bg-blue-100)
                </div>
            </section>

            {/* 内联样式对比 */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">内联样式对比测试</h2>

                <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '16px', marginBottom: '8px' }}>
                    内联样式红色背景
                </div>

                <div className="bg-red-500 text-white p-4 mb-2">
                    Tailwind 红色背景 (应该看起来一样)
                </div>
            </section>

            {/* CSS 变量测试 */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">CSS 变量测试</h2>

                <div style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', padding: '16px' }}>
                    使用 CSS 变量的样式
                </div>
            </section>

            {/* 强制样式测试 */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">强制样式测试</h2>

                <div className="!bg-orange-500 !text-white !p-4 mb-2">
                    强制橙色背景 (!bg-orange-500)
                </div>
            </section>
        </div>
    )
}
