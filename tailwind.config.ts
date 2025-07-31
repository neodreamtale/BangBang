import type { Config } from "tailwindcss";

export default {
    darkMode: 'class', // 启用类名模式的暗色主题
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // 语义化颜色 - 自动响应主题
                primary: 'var(--color-bg-primary)',
                secondary: 'var(--color-bg-secondary)',
                card: 'var(--color-card-bg)',

                // 文字色系  
                'text-primary': 'var(--color-text-primary)',
                'text-secondary': 'var(--color-text-secondary)',

                // 边框色系
                'border-default': 'var(--color-border)',
            }
        },
    },
    plugins: [],
} satisfies Config;
