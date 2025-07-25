import type { Config } from "tailwindcss";

export default {
    darkMode: 'class', // 启用类名模式的暗色主题
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // 背景色系
                primary: "var(--color-bg-primary)",
                secondary: "var(--color-bg-secondary)",
                card: "var(--color-bg-card)",

                // 文字色系  
                text: {
                    primary: "var(--color-text-primary)",
                    secondary: "var(--color-text-secondary)",
                },

                // 边框色系
                border: {
                    default: "var(--color-border-default)",
                },

                // 保持原有变量兼容性
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [],
} satisfies Config;
